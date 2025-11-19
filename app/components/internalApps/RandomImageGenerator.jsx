"use client";

import { useState, useRef, useEffect } from "react";
import { Download, RefreshCw, Palette } from "lucide-react";

const RandomImageGenerator = () => {
  const [width, setWidth] = useState(3000);
  const [height, setHeight] = useState(3000);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [numEmojis, setNumEmojis] = useState(50);
  const [emojiList, setEmojiList] = useState("😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 👺 🤡 💩 👻 💀 ☠️ 👽 👾 🤖 🎃 😺 😸 😹 😻 😼 😽 🙀 😿 😾");
  const [imageFormat, setImageFormat] = useState("jpeg");
  const [jpegQuality, setJpegQuality] = useState(0.85);
  const [estimatedSize, setEstimatedSize] = useState(0);
  const canvasRef = useRef(null);

  // Generate image on mount
  useEffect(() => {
    generateImage();
  }, []);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Parse emojis from the list
    const emojis = emojiList.trim().split(/\s+/).filter(e => e.length > 0);
    if (emojis.length === 0) return;

    // Calculate font size based on canvas dimensions
    const fontSize = Math.min(width, height) / 20;
    ctx.font = `${fontSize}px Arial`;

    // Place random emojis
    for (let i = 0; i < numEmojis; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const x = Math.random() * (width);
      const y = Math.random() * (height);
      const rotation = Math.random() * 360; // Random rotation in degrees

      ctx.save();
      ctx.translate(x , y );
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji, 0, 0);
      ctx.restore();
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

            {/* Background Color */}
            <div>
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
              </div>
            </div>

            {/* Number of Emojis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Emojis
              </label>
              <input
                type="number"
                value={numEmojis}
                onChange={(e) => setNumEmojis(parseInt(e.target.value) || 0)}
                min="0"
                max="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

