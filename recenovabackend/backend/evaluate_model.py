
import json
import csv
import numpy as np
import tensorflow as tf

from pathlib import Path
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input


# ==========================================
# 1. CONFIGURATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "best_model.keras"
TEST_DIR = BASE_DIR / "dataset" / "test"
CLASSES_PATH = BASE_DIR / "models" / "class_names.json"

OUTPUT_DIR = BASE_DIR / "models" / "evaluation"

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16


# ==========================================
# 2. VERIFY FILES
# ==========================================

print("\n========== RECY NOVA MODEL EVALUATION ==========\n")

if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

if not TEST_DIR.exists():
    raise FileNotFoundError(f"Test dataset not found: {TEST_DIR}")

if not CLASSES_PATH.exists():
    raise FileNotFoundError(f"Class names file not found: {CLASSES_PATH}")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ==========================================
# 3. LOAD CLASS NAMES
# ==========================================

with open(CLASSES_PATH, "r", encoding="utf-8") as file:
    class_names = json.load(file)

print(f"Number of classes: {len(class_names)}")

for index, name in enumerate(class_names):
    print(f"{index}: {name}")


# ==========================================
# 4. LOAD TEST DATASET
# ==========================================

print("\nLoading test dataset...")

test_dataset = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    label_mode="int",
    class_names=class_names,
    shuffle=False
)

# Apply MobileNetV2 preprocessing
test_dataset = test_dataset.map(
    lambda images, labels: (preprocess_input(images), labels)
)

print("Test dataset loaded successfully.")


# ==========================================
# 5. LOAD TRAINED MODEL
# ==========================================

print("\nLoading trained model...")

model = tf.keras.models.load_model(MODEL_PATH)

print("Model loaded successfully.")

print("\nModel output shape:", model.output_shape)

if model.output_shape[-1] != len(class_names):
    raise ValueError(
        "Mismatch between model output classes and class_names.json"
    )


# ==========================================
# 6. EVALUATE MODEL
# ==========================================

print("\nEvaluating model...")

test_loss, test_accuracy = model.evaluate(
    test_dataset,
    verbose=1
)

print("\n========== MODEL PERFORMANCE ==========")

print(f"Test Loss     : {test_loss:.4f}")
print(f"Test Accuracy : {test_accuracy * 100:.2f}%")


# ==========================================
# 7. GET TRUE LABELS
# ==========================================

print("\nGenerating predictions...")

y_true = np.concatenate([
    labels.numpy()
    for images, labels in test_dataset
])

# ==========================================
# 8. GET PREDICTIONS
# ==========================================

predictions = model.predict(test_dataset, verbose=1)

y_pred = np.argmax(predictions, axis=1)

y_confidence = np.max(predictions, axis=1)

accuracy = accuracy_score(y_true, y_pred)

print(f"\nCalculated Accuracy: {accuracy * 100:.2f}%")


# ==========================================
# 9. CLASSIFICATION REPORT
# ==========================================

report = classification_report(
    y_true,
    y_pred,
    labels=list(range(len(class_names))),
    target_names=class_names,
    output_dict=True,
    zero_division=0
)

print("\n========== CLASSIFICATION REPORT ==========\n")

print(
    classification_report(
        y_true,
        y_pred,
        labels=list(range(len(class_names))),
        target_names=class_names,
        zero_division=0
    )
)


# ==========================================
# 10. SAVE CLASSIFICATION REPORT
# ==========================================

report_csv = OUTPUT_DIR / "classification_report.csv"

with open(report_csv, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    writer.writerow([
        "Class",
        "Precision",
        "Recall",
        "F1-score",
        "Support"
    ])

    for class_name in class_names:
        metrics = report[class_name]

        writer.writerow([
            class_name,
            metrics["precision"],
            metrics["recall"],
            metrics["f1-score"],
            metrics["support"]
        ])

    for average in ["macro avg", "weighted avg"]:
        metrics = report[average]

        writer.writerow([
            average,
            metrics["precision"],
            metrics["recall"],
            metrics["f1-score"],
            metrics["support"]
        ])

print(f"\nClassification report saved: {report_csv}")


# ==========================================
# 11. CONFUSION MATRIX
# ==========================================

cm = confusion_matrix(
    y_true,
    y_pred,
    labels=list(range(len(class_names)))
)

print("\n========== CONFUSION MATRIX ==========\n")
print(cm)

cm_csv = OUTPUT_DIR / "confusion_matrix.csv"

with open(cm_csv, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    writer.writerow(["Actual / Predicted"] + class_names)

    for class_name, row in zip(class_names, cm):
        writer.writerow([class_name] + row.tolist())

print(f"\nConfusion matrix saved: {cm_csv}")


# ==========================================
# 12. SAVE PREDICTIONS
# ==========================================

predictions_csv = OUTPUT_DIR / "predictions.csv"

with open(predictions_csv, "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    writer.writerow([
        "Actual Class",
        "Predicted Class",
        "Confidence",
        "Correct"
    ])

    for true_label, predicted_label, confidence in zip(
        y_true, y_pred, y_confidence
    ):
        writer.writerow([
            class_names[true_label],
            class_names[predicted_label],
            round(float(confidence), 4),
            true_label == predicted_label
        ])

print(f"Predictions saved: {predictions_csv}")


# ==========================================
# 13. FINAL SUMMARY
# ==========================================

print("\n========== FINAL SUMMARY ==========")

print(f"Total test images : {len(y_true)}")
print(f"Number of classes : {len(class_names)}")
print(f"Correct predictions: {int(np.sum(y_true == y_pred))}")
print(f"Incorrect predictions: {int(np.sum(y_true != y_pred))}")
print(f"Accuracy: {accuracy * 100:.2f}%")

print("\nEvaluation completed successfully!")

print(f"\nResults directory: {OUTPUT_DIR}")
