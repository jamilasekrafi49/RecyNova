
import tensorflow as tf
import json
from pathlib import Path

# =====================================
# 1. Configuration
# =====================================

DATASET_DIR = Path("dataset")
MODEL_DIR = Path("models")

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 10
SEED = 42

MODEL_DIR.mkdir(exist_ok=True)

# =====================================
# 2. Load datasets
# =====================================

train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR / "train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=True,
    seed=SEED
)

validation_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR / "validation",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=False
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR / "test",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    shuffle=False
)

class_names = train_ds.class_names
NUM_CLASSES = len(class_names)

# Save class names
with open(MODEL_DIR / "class_names.json", "w") as f:
    json.dump(class_names, f, indent=4)

# =====================================
# 3. Preprocessing
# =====================================

preprocess_input = (
    tf.keras.applications.mobilenet_v2.preprocess_input
)

AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.map(
    lambda x, y: (preprocess_input(x), y),
    num_parallel_calls=AUTOTUNE
).prefetch(AUTOTUNE)

validation_ds = validation_ds.map(
    lambda x, y: (preprocess_input(x), y),
    num_parallel_calls=AUTOTUNE
).prefetch(AUTOTUNE)

test_ds = test_ds.map(
    lambda x, y: (preprocess_input(x), y),
    num_parallel_calls=AUTOTUNE
).prefetch(AUTOTUNE)

# =====================================
# 4. Data augmentation
# =====================================

data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
], name="data_augmentation")

# =====================================
# 5. MobileNetV2
# =====================================

base_model = tf.keras.applications.MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False

# =====================================
# 6. Build model
# =====================================

inputs = tf.keras.Input(shape=(224, 224, 3))

x = data_augmentation(inputs)

x = base_model(x, training=False)

x = tf.keras.layers.GlobalAveragePooling2D()(x)

x = tf.keras.layers.Dropout(0.3)(x)

outputs = tf.keras.layers.Dense(
    NUM_CLASSES,
    activation="softmax"
)(x)

model = tf.keras.Model(
    inputs=inputs,
    outputs=outputs,
    name="RecyNova_MobileNetV2"
)

# =====================================
# 7. Compile
# =====================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# =====================================
# 8. Callbacks
# =====================================

callbacks = [

    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(MODEL_DIR / "best_model.keras"),
        monitor="val_accuracy",
        save_best_only=True,
        mode="max",
        verbose=1
    ),

    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True,
        verbose=1
    ),

    tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.2,
        patience=2,
        min_lr=0.00001,
        verbose=1
    )
]

# =====================================
# 9. Model information
# =====================================

print("\n===== RECY NOVA MODEL =====")

print("Classes:", NUM_CLASSES)
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)

print(
    "Trainable parameters:",
    sum(
        tf.keras.backend.count_params(w)
        for w in model.trainable_weights
    )
)

# =====================================
# 10. Training
# =====================================

print("\n===== START TRAINING =====")

history = model.fit(
    train_ds,
    validation_data=validation_ds,
    epochs=EPOCHS,
    callbacks=callbacks
)

# =====================================
# 11. Save final model
# =====================================

model.save(MODEL_DIR / "final_model.keras")

print("\nFinal model saved successfully!")

# =====================================
# 12. Evaluate best model
# =====================================

print("\n===== TEST EVALUATION =====")

best_model = tf.keras.models.load_model(
    MODEL_DIR / "best_model.keras"
)

test_loss, test_accuracy = best_model.evaluate(test_ds)

print("Test loss:", test_loss)
print("Test accuracy:", test_accuracy)

print("\n===== TRAINING COMPLETED =====")
