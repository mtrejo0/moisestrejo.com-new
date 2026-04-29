"use client";

import { useState, useRef, useEffect } from "react";
import { Download, RefreshCw, Palette } from "lucide-react";

const RandomImageGenerator = () => {
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(3000);
  const [colorMode, setColorMode] = useState("single"); // "single" or "gradient"
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [gradientColor1, setGradientColor1] = useState("#ff6b6b");
  const [gradientColor2, setGradientColor2] = useState("#4ecdc4");
  const [gradientDirection, setGradientDirection] = useState("diagonal-tl-br"); // diagonal directions or horizontal/vertical
  const [placementMode, setPlacementMode] = useState("random"); // "random" or "grid"
  const [numEmojis, setNumEmojis] = useState(50);
  const [gridRows, setGridRows] = useState(10);
  const [gridColumns, setGridColumns] = useState(10);
  const [emojiList, setEmojiList] = useState("😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾");
  const [fontSize, setFontSize] = useState(200); // null means auto-calculate
  const [rotationRange, setRotationRange] = useState(0); // degrees of rotation (0-360)
  const [imageFormat, setImageFormat] = useState("jpeg");
  const [jpegQuality, setJpegQuality] = useState(0.85);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const canvasRef = useRef(null);

  // Generate image on mount
  useEffect(() => {
    generateImage();
  }, []);

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    return randomColor;
  };

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    // Fill background with solid color or gradient
    if (colorMode === "single") {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Create gradient based on direction
      let gradient;
      
      switch (gradientDirection) {
        case "diagonal-tl-br": // Top-left to bottom-right
          gradient = ctx.createLinearGradient(0, 0, width, height);
          break;
        case "diagonal-tr-bl": // Top-right to bottom-left
          gradient = ctx.createLinearGradient(width, 0, 0, height);
          break;
        case "diagonal-bl-tr": // Bottom-left to top-right
          gradient = ctx.createLinearGradient(0, height, width, 0);
          break;
        case "diagonal-br-tl": // Bottom-right to top-left
          gradient = ctx.createLinearGradient(width, height, 0, 0);
          break;
        case "horizontal-lr": // Left to right
          gradient = ctx.createLinearGradient(0, 0, width, 0);
          break;
        case "horizontal-rl": // Right to left
          gradient = ctx.createLinearGradient(width, 0, 0, 0);
          break;
        case "vertical-tb": // Top to bottom
          gradient = ctx.createLinearGradient(0, 0, 0, height);
          break;
        case "vertical-bt": // Bottom to top
          gradient = ctx.createLinearGradient(0, height, 0, 0);
          break;
        default:
          gradient = ctx.createLinearGradient(0, 0, width, height);
      }
      
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Parse emojis from the list
    const emojis = emojiList.trim().split(/\s+/).filter(e => e.length > 0);
    if (emojis.length === 0) return;

    // Use custom font size or calculate based on canvas dimensions
    const emojiFontSize = fontSize || Math.min(width, height) / 20;
    ctx.font = `${emojiFontSize}px Arial`;

    // Place emojis based on mode
    if (placementMode === "random") {
      // Random placement
      for (let i = 0; i < numEmojis; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const x = Math.random() * (width ) ;
        const y = Math.random() * (height ) ;
        const rotation = (Math.random() - 0.5) * rotationRange;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(emoji, 0, 0);
        ctx.restore();
      }
    } else {
      // Grid placement
      const cellWidth = width / gridColumns;
      const cellHeight = height / gridRows;

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridColumns; col++) {
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          const x = (col + 0.5) * cellWidth;
          const y = (row + 0.5) * cellHeight;
          const rotation = (Math.random() - 0.5) * rotationRange;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(emoji, 0, 0);
          ctx.restore();
        }
      }
    }

    // Estimate file size
    updateEstimatedSize();
  };

  const updateEstimatedSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get data URL to estimate size
    const mimeType = imageFormat === "jpeg" ? "image/jpeg" : "image/png";
    const quality = imageFormat === "jpeg" ? jpegQuality : undefined;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    
    // Estimate size (data URL is base64 encoded, so ~33% larger than actual file)
    const base64Length = dataUrl.length - dataUrl.indexOf(",") - 1;
    const estimatedBytes = (base64Length * 3) / 4;
    setEstimatedSize(estimatedBytes);
  };

  useEffect(() => {
    // Update size estimation when format or quality changes
    if (canvasRef.current) {
      updateEstimatedSize();
    }
  }, [imageFormat, jpegQuality]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (estimatedSize > 20000000) {
      const proceed = window.confirm(
        `Warning: The estimated file size is ${(estimatedSize / 1024 / 1024).toFixed(2)} MB, which exceeds the 20MB limit.\n\n` +
        `The download may fail. Consider:\n` +
        `- Using JPEG format\n` +
        `- Reducing JPEG quality\n` +
        `- Reducing image dimensions\n\n` +
        `Do you want to proceed anyway?`
      );
      if (!proceed) return;
    }

    const mimeType = imageFormat === "jpeg" ? "image/jpeg" : "image/png";
    const quality = imageFormat === "jpeg" ? jpegQuality : undefined;
    const extension = imageFormat === "jpeg" ? "jpg" : "png";
    
    const link = document.createElement("a");
    link.download = `random-album-cover-${width}x${height}.${extension}`;
    link.href = canvas.toDataURL(mimeType, quality);
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Random Album Cover</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Dimensions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value) || 1000)}
                min="100"
                max="10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 1000)}
                min="100"
                max="10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Color Mode Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="single"
                    checked={colorMode === "single"}
                    onChange={(e) => setColorMode(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Single Color</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="gradient"
                    checked={colorMode === "gradient"}
                    onChange={(e) => setColorMode(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Two Color Gradient</span>
                </label>
              </div>
            </div>

            {/* Single Color Mode */}
            {colorMode === "single" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Background Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setBackgroundColor(generateRandomColor())}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap"
                  >
                    Random
                  </button>
                </div>
              </div>
            )}

            {/* Gradient Mode */}
            {colorMode === "gradient" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color 1
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={gradientColor1}
                      onChange={(e) => setGradientColor1(e.target.value)}
                      placeholder="#ff6b6b"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setGradientColor1(generateRandomColor())}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap"
                    >
                      Random
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Color 2
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={gradientColor2}
                      onChange={(e) => setGradientColor2(e.target.value)}
                      placeholder="#4ecdc4"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => setGradientColor2(generateRandomColor())}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap"
                    >
                      Random
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gradient Direction
                  </label>
                  <select
                    value={gradientDirection}
                    onChange={(e) => setGradientDirection(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <optgroup label="Diagonal">
                      <option value="diagonal-tl-br">↘ Top-Left to Bottom-Right</option>
                      <option value="diagonal-tr-bl">↙ Top-Right to Bottom-Left</option>
                      <option value="diagonal-bl-tr">↗ Bottom-Left to Top-Right</option>
                      <option value="diagonal-br-tl">↖ Bottom-Right to Top-Left</option>
                    </optgroup>
                    <optgroup label="Horizontal">
                      <option value="horizontal-lr">→ Left to Right</option>
                      <option value="horizontal-rl">← Right to Left</option>
                    </optgroup>
                    <optgroup label="Vertical">
                      <option value="vertical-tb">↓ Top to Bottom</option>
                      <option value="vertical-bt">↑ Bottom to Top</option>
                    </optgroup>
                  </select>
                </div>
              </>
            )}

            {/* Placement Mode Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoji Placement Mode
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="random"
                    checked={placementMode === "random"}
                    onChange={(e) => setPlacementMode(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Random Placement</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="grid"
                    checked={placementMode === "grid"}
                    onChange={(e) => setPlacementMode(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">Grid Placement</span>
                </label>
              </div>
            </div>

            {/* Random Mode Controls */}
            {placementMode === "random" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Emojis: {numEmojis}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={numEmojis}
                  onChange={(e) => setNumEmojis(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>None (0)</span>
                  <span>Maximum (1000)</span>
                </div>
              </div>
            )}

            {/* Grid Mode Controls */}
            {placementMode === "grid" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grid Rows
                  </label>
                  <input
                    type="number"
                    value={gridRows}
                    onChange={(e) => setGridRows(parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grid Columns
                  </label>
                  <input
                    type="number"
                    value={gridColumns}
                    onChange={(e) => setGridColumns(parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Grid mode will place {gridRows * gridColumns} emojis evenly spaced in a {gridRows} × {gridColumns} grid
                  </p>
                </div>
              </>
            )}

            {/* Rotation Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rotation Range: {rotationRange}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={rotationRange}
                onChange={(e) => setRotationRange(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>No rotation (0°)</span>
                <span>Full rotation (360°)</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {rotationRange === 0 ? "Emojis will stay upright" : `Emojis can rotate ±${rotationRange / 2}° from upright`}
              </p>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoji Font Size: {fontSize || `Auto (${Math.round(Math.min(width, height) / 20)})`}px
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={fontSize || Math.round(Math.min(width, height) / 20)}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small (10px)</span>
                <span>Large (1000px)</span>
              </div>
              <button
                onClick={() => setFontSize(null)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Reset to Auto
              </button>
            </div>

            {/* Image Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Format
              </label>
              <select
                value={imageFormat}
                onChange={(e) => setImageFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="jpeg">JPEG (Smaller file size)</option>
                <option value="png">PNG (Larger file size)</option>
              </select>
            </div>

            {/* JPEG Quality */}
            {imageFormat === "jpeg" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  JPEG Quality: {Math.round(jpegQuality * 100)}%
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={jpegQuality}
                  onChange={(e) => setJpegQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}
          </div>

          {/* File Size Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Estimated file size:
              </span>
              <span className={`text-sm font-bold ${estimatedSize > 20000000 ? 'text-red-600' : estimatedSize > 10000000 ? 'text-orange-600' : 'text-green-600'}`}>
                {(estimatedSize / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            {estimatedSize > 20000000 && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ File size exceeds 20MB limit. Reduce dimensions or use JPEG with lower quality.
              </p>
            )}
            {estimatedSize > 10000000 && estimatedSize <= 20000000 && (
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ Large file size. Consider using JPEG format or reducing dimensions.
              </p>
            )}
          </div>

          {/* Emoji List */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emoji List (space-separated)
            </label>
            <textarea
              value={emojiList}
              onChange={(e) => setEmojiList(e.target.value)}
              placeholder="Enter emojis separated by spaces..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              {emojiList.trim().split(/\s+/).filter(e => e.length > 0).length} emojis available
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={generateImage}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <RefreshCw className="w-5 h-5" />
              Generate Album Cover
            </button>
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>

        {/* Canvas Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="border-2 border-gray-200 rounded-lg overflow-auto max-h-[600px] flex justify-center items-center bg-gray-100">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
              style={{ maxHeight: "600px" }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Dimensions: {width} × {height}px
          </p>
        </div>
      </div>
    </div>
  );
};

export default RandomImageGenerator;

