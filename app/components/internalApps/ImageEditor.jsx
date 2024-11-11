"use client";

import { useState, useRef } from "react";

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    blur: 0,
    hueRotate: 0,
    invert: 0,
    sepia: 0,
    opacity: 100,
  });

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFilterChange = (filter, value) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: value,
    }));
  };

  const getFilterStyle = () => {
    return {
      filter: `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturate}%)
        grayscale(${filters.grayscale}%)
        blur(${filters.blur}px)
        hue-rotate(${filters.hueRotate}deg)
        invert(${filters.invert}%)
        sepia(${filters.sepia}%)
        opacity(${filters.opacity}%)
      `,
    };
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    const canvas = document.createElement("canvas");
    const img = document.querySelector("#edited-image");

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d");
    ctx.filter = getFilterStyle().filter;
    ctx.drawImage(img, 0, 0);

    link.download = "edited-image.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg bg-white min-h-[400px]">
      <h2 className="text-2xl font-bold mb-4">Image Editor</h2>
      <p className="text-gray-600 mb-4">
        Upload an image and use the sliders below to adjust brightness,
        contrast, saturation and more!
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="mb-4"
      />

      {image && (
        <div className="w-full">
          <div className="mb-4 flex justify-center">
            <img
              id="edited-image"
              src={image}
              alt="Uploaded image"
              style={getFilterStyle()}
              className="max-w-full max-h-[400px] object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label>Brightness</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.brightness}
                onChange={(e) =>
                  handleFilterChange("brightness", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col">
              <label>Contrast</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.contrast}
                onChange={(e) => handleFilterChange("contrast", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Saturation</label>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.saturate}
                onChange={(e) => handleFilterChange("saturate", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Grayscale</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.grayscale}
                onChange={(e) =>
                  handleFilterChange("grayscale", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col">
              <label>Blur</label>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.blur}
                onChange={(e) => handleFilterChange("blur", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Hue Rotate</label>
              <input
                type="range"
                min="0"
                max="360"
                value={filters.hueRotate}
                onChange={(e) =>
                  handleFilterChange("hueRotate", e.target.value)
                }
              />
            </div>

            <div className="flex flex-col">
              <label>Invert</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.invert}
                onChange={(e) => handleFilterChange("invert", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Sepia</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.sepia}
                onChange={(e) => handleFilterChange("sepia", e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label>Opacity</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.opacity}
                onChange={(e) => handleFilterChange("opacity", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageEditor;
