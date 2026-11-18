
import random
import shutil
from pathlib import Path

SOURCE_DIR = Path("images/images")
OUTPUT_DIR = Path("dataset")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

random.seed(42)

for class_dir in SOURCE_DIR.iterdir():

    if not class_dir.is_dir():
        continue

    images = [
        file for file in class_dir.rglob("*")
        if file.is_file()
        and file.suffix.lower() in IMAGE_EXTENSIONS
    ]

    random.shuffle(images)

    total = len(images)

    train_count = int(total * 0.70)
    validation_count = int(total * 0.15)

    train_images = images[:train_count]
    validation_images = images[train_count:train_count + validation_count]
    test_images = images[train_count + validation_count:]

    for split, split_images in [
        ("train", train_images),
        ("validation", validation_images),
        ("test", test_images)
    ]:

        destination = OUTPUT_DIR / split / class_dir.name

        # Supprimer uniquement l'ancien dossier généré de cette classe
        if destination.exists():
            shutil.rmtree(destination)

        destination.mkdir(parents=True, exist_ok=True)

        for image in split_images:

            # Créer un nom unique à partir du chemin relatif
            relative_path = image.relative_to(class_dir)
            unique_name = "__".join(relative_path.parts)

            shutil.copy2(image, destination / unique_name)

    print(
        f"{class_dir.name}: "
        f"{len(train_images)} train, "
        f"{len(validation_images)} validation, "
        f"{len(test_images)} test"
    )

print("\nDataset preparation completed!")
