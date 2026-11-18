
function ImageUploader({ image, setImage }) {
  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="image-uploader">
      <label htmlFor="scan-image">Choisir une photo de vos déchets</label>

      <input
        id="scan-image"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />

      {image && (
        <div>
          <p>{image.name}</p>
          <img
            src={URL.createObjectURL(image)}
            alt="Aperçu de l'image sélectionnée"
            className="scan-preview"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
