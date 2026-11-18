
import json
import tensorflow as tf

from pathlib import Path


# ==========================================
# 1. CONFIGURATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

DATASET_DIR = BASE_DIR / "dataset"
MODEL_DIR = BASE_DIR / "models"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 10
SEED = 42

INITIAL_MODEL_PATH = MODEL_DIR / "best_model.keras"
OUTPUT_MODEL_PATH = MODEL_DIR / "finetuned_best_model.keras"
CLASS_NAMES_PATH = MODEL_DIR / "class_names.json"
FINAL_MODEL_PATH = MODEL_DIR / "finetuned_final_model.keras"

AUTOTUNE = tf.data.AUTOTUNE


# ==========================================
# 2. VERIFY FILES
# ==========================================

print("\n========== RECY NOVA FINE-TUNING ==========\n")

for path in [
    INITIAL_MODEL_PATH,
    CLASS_NAMES_PATH,
    DATASET_DIR / "train",
    DATASET_DIR / "validation"
]:
    if not path.exists():
        raise FileNotFoundError(f"File or folder not found: {path}")


# ==========================================
# 3. LOAD CLASS NAMES
# ==========================================

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as file:
    class_names = json.load(file)

NUM_CLASSES = len(class_names)

print("Number of classes:", NUM_CLASSES)


# ==========================================
# 4. LOAD DATASETS
# ==========================================

print("\nLoading datasets...")

train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR / "train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    class_names=class_names,
    shuffle=True,
    seed=SEED
)

validation_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR / "validation",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    class_names=class_names,
    shuffle=False
)

preprocess_input = (
    tf.keras.applications.mobilenet_v2.preprocess_input
)

train_ds = train_ds.map(
    lambda images, labels: (
        preprocess_input(images),
        labels
    ),
    num_parallel_calls=AUTOTUNE
).prefetch(AUTOTUNE)

validation_ds = validation_ds.map(
    lambda images, labels: (
        preprocess_input(images),
        labels
    ),
    num_parallel_calls=AUTOTUNE
).prefetch(AUTOTUNE)

print("Datasets loaded successfully.")


# ==========================================
# 5. LOAD PREVIOUS MODEL
# ==========================================

print("\nLoading previous best model...")

model = tf.keras.models.load_model(
    INITIAL_MODEL_PATH
)

print("Previous model loaded successfully.")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)

if model.output_shape[-1] != NUM_CLASSES:
    raise ValueError("Model output does not match the number of classes.")


# ==========================================
# 6. FIND MOBILENETV2 BASE MODEL
# ==========================================

base_model = None

for layer in model.layers:
    if isinstance(layer, tf.keras.Model) and "mobilenet" in layer.name.lower():
        base_model = layer
        break

if base_model is None:
    raise ValueError("MobileNetV2 base model not found.")

print("\nBase model:", base_model.name)


# ==========================================
# 7. UNFREEZE LAST LAYERS
# ==========================================

base_model.trainable = True

# Freeze all layers except the last 30
for layer in base_model.layers[:-30]:
    layer.trainable = False

# Keep BatchNormalization layers frozen
for layer in base_model.layers:
    if isinstance(layer, tf.keras.layers.BatchNormalization):
        layer.trainable = False

print("\nFine-tuning configuration:")
print("Total base layers:", len(base_model.layers))

print(
    "Trainable base layers:",
    sum(1 for layer in base_model.layers if layer.trainable)
)

print(
    "Trainable parameters:",
    sum(
        tf.keras.backend.count_params(weight)
        for weight in model.trainable_weights
    )
)


# ==========================================
# 8. RECOMPILE MODEL
# ==========================================

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.00001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

print("\nModel recompiled successfully.")


# ==========================================
# 9. CALLBACKS
# ==========================================

callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(OUTPUT_MODEL_PATH),
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
        min_lr=0.000001,
        verbose=1
    )
]


# ==========================================
# 10. FINE-TUNING
# ==========================================

print("\n========== START FINE-TUNING ==========\n")

history = model.fit(
    train_ds,
    validation_data=validation_ds,
    epochs=EPOCHS,
    callbacks=callbacks
)


# ==========================================
# 11. SAVE FINAL MODEL
# ==========================================

model.save(FINAL_MODEL_PATH)

print("\nFine-tuned final model saved:")
print(FINAL_MODEL_PATH)


# ==========================================
# 12. EVALUATE BEST FINE-TUNED MODEL
# ==========================================

print("\n========== EVALUATE FINE-TUNED MODEL ==========\n")

best_model = tf.keras.models.load_model(
    OUTPUT_MODEL_PATH
)

val_loss, val_accuracy = best_model.evaluate(
    validation_ds,
    verbose=1
)

print("\n========== FINE-TUNING RESULTS ==========")
print(f"Validation Loss: {val_loss:.4f}")
print(f"Validation Accuracy: {val_accuracy * 100:.2f}%")

print("\nFine-tuning completed successfully!")
