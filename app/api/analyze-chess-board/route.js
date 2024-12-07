import { NextResponse } from 'next/server';
import cv from '@techstark/opencv-js';
import sharp from 'sharp';
import * as fs from 'fs/promises';
import path from 'path';

const WHITE_SQUARE = '#ebecd0';
const BLACK_SQUARE = '#739552';
const WHITE_PIECE = '#f9f9f9';
const BLACK_PIECE = '#5b5957';

// Color similarity threshold (0-255)
const COLOR_THRESHOLD = 30;

export async function POST(request) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Save original resized image
    const outputDir = path.join(process.cwd(), 'public', 'debug');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Helper function to save OpenCV matrix as image
    async function saveMatAsImage(mat, filename) {
      const buffer = Buffer.from(mat.data);
      await sharp(buffer, {
        raw: {
          width: mat.cols,
          height: mat.rows,
          channels: mat.channels()
        }
      })
      .toFile(path.join(outputDir, filename));
    }


    // Convert uploaded file to buffer and process with sharp first
    const buffer = Buffer.from(await image.arrayBuffer());
    const { data, info } = await sharp(buffer)
      .resize(800, 800, { fit: 'contain' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Convert to OpenCV matrix
    const mat = cv.matFromImageData({
      data: new Uint8ClampedArray(data),
      width: info.width,
      height: info.height
    });

    // Create a virtual canvas since we're in Node.js environment
    const canvas = new cv.Mat();
    mat.copyTo(canvas);
    
    // Convert to grayscale
    const gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY);
    await saveMatAsImage(gray, 'gray.png');

    // Apply Gaussian blur to reduce noise
    const blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    await saveMatAsImage(blurred, 'blurred.png');

    const edges = new cv.Mat();
    cv.Canny(blurred, edges, 30, 90); 
    await saveMatAsImage(edges, 'edges.png');

    // After Canny edge detection:
    const lines = new cv.Mat();
    cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 100, 100, 10);

    // Separate horizontal and vertical lines
    const horizontalLines = [];
    const verticalLines = [];
    
    for (let i = 0; i < lines.rows; i++) {
      const [x1, y1, x2, y2] = [
        lines.data32S[i * 4],
        lines.data32S[i * 4 + 1],
        lines.data32S[i * 4 + 2],
        lines.data32S[i * 4 + 3]
      ];
      
      // Calculate line angle
      const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI);
      
      // Categorize lines (allowing 15-degree tolerance)
      if (angle < 5 || angle > 176) {
        horizontalLines.push([x1, y1, x2, y2]);
      } else if (Math.abs(angle - 90) < 15) {
        verticalLines.push([x1, y1, x2, y2]);
      }
    }

    // After collecting horizontalLines and verticalLines, add this filtering:
    function filterRegularLines(lines, isHorizontal) {
      // Sort lines by position
      const sortedLines = lines.sort((a, b) => isHorizontal ? a[1] - b[1] : a[0] - b[0]);
      
      // Calculate distances between adjacent lines
      const distances = [];
      for (let i = 0; i < sortedLines.length - 1; i++) {
        const dist = isHorizontal 
          ? Math.abs(sortedLines[i + 1][1] - sortedLines[i][1])
          : Math.abs(sortedLines[i + 1][0] - sortedLines[i][0]);
        distances.push(dist);
      }

      // Calculate median distance
      const sortedDist = [...distances].sort((a, b) => a - b);
      const medianDist = sortedDist[Math.floor(sortedDist.length / 2)];

      // Filter lines that are approximately medianDist apart (within 20% tolerance)
      const tolerance = 0.2;
      const filteredLines = [sortedLines[0]]; // Keep first line

      for (let i = 1; i < sortedLines.length; i++) {
        const prevLine = filteredLines[filteredLines.length - 1];
        const currentLine = sortedLines[i];
        const dist = isHorizontal 
          ? Math.abs(currentLine[1] - prevLine[1])
          : Math.abs(currentLine[0] - prevLine[0]);

        if (Math.abs(dist - medianDist) / medianDist <= tolerance) {
          filteredLines.push(currentLine);
        }
      }

      return filteredLines;
    }

    // Apply the filtering
    const filteredHorizontal = filterRegularLines(horizontalLines, true);
    const filteredVertical = filterRegularLines(verticalLines, false);

    console.log(horizontalLines, filteredHorizontal)
    console.log(verticalLines, filteredVertical)


    // Create a clean image with just the grid lines
    const gridImage = new cv.Mat.zeros(edges.rows, edges.cols, cv.CV_8UC3);

    
    
    // Draw the filtered lines
    for (const line of horizontalLines) {
      cv.line(gridImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }
    for (const line of verticalLines) {
      cv.line(gridImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }

    // Save the grid image
    await saveMatAsImage(gridImage, 'grid.png');

    // Create a copy of the original image to overlay grid lines
    const overlayImage = new cv.Mat();
    mat.copyTo(overlayImage);

    // Draw the filtered lines on the original image
    for (const line of horizontalLines) {
      cv.line(overlayImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }
    for (const line of verticalLines) {
      cv.line(overlayImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }



    // Sort lines by position to create a reliable grid
    const sortedHorizontal = horizontalLines.sort((a, b) => a[1] - b[1]);
    const sortedVertical = verticalLines.sort((a, b) => a[0] - b[0]);

    // Initialize 8x8 board representation (0 for empty, 1 for piece)
    const boardRepresentation = Array(8).fill().map(() => Array(8).fill(0));
    const pieceRepresentation = Array(8).fill().map(() => Array(8).fill(0));

    // Analyze each square
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        // Calculate square boundaries
        const x1 = sortedVertical[col][0];
        const x2 = sortedVertical[col + 1]?.[0] || mat.cols;
        const y1 = sortedHorizontal[row][1];
        const y2 = sortedHorizontal[row + 1]?.[1] || mat.rows;

        // Calculate corner and middle sample points
        const cornerX = Math.floor(x1 + 5);
        const cornerY = Math.floor(y1 + 5);
        const middleX = Math.floor((x1 + x2) / 2);
        const middleY = Math.floor((y1 + y2) / 2 + (y2 - y1) * 0.15);

        // Get pixel colors at both points
        const cornerPixel = mat.ucharPtr(cornerY, cornerX);
        const middlePixel = mat.ucharPtr(middleY, middleX);
        
        console.log(`Square [${row},${col}]:`,
          `Corner RGB: [${cornerPixel[0]}, ${cornerPixel[1]}, ${cornerPixel[2]}]`,
          `Middle RGB: [${middlePixel[0]}, ${middlePixel[1]}, ${middlePixel[2]}]`
        );

        const cornerColor = [cornerPixel[0], cornerPixel[1], cornerPixel[2]];
        const middleColor = [middlePixel[0], middlePixel[1], middlePixel[2]];

        const lightSquareColor = [235, 236, 208];
        const darkSquareColor = [115, 149, 82];

        const darkPieceColor = [91, 89, 87]
        const lightPieceColor = [249,249,249]

        // Check if pixel color matches light or dark square
        if (isColorSimilar(cornerColor, lightSquareColor, COLOR_THRESHOLD)) {
          boardRepresentation[row][col] = 1; // Light square
        } else if (isColorSimilar(cornerColor, darkSquareColor, COLOR_THRESHOLD)) {
          boardRepresentation[row][col] = 0; // Dark square
        }
        // Check if pixel color matches light or dark square
        if (isColorSimilar(middleColor, lightPieceColor, COLOR_THRESHOLD)) {
          pieceRepresentation[row][col] = 1; // Light square
        } else if (isColorSimilar(middleColor, darkPieceColor, COLOR_THRESHOLD)) {
          pieceRepresentation[row][col] = 2; // Dark square
        }
        else {
          pieceRepresentation[row][col] = 0;
        }

        // Draw middle point on overlay image for debugging
        cv.circle(overlayImage, new cv.Point(middleX, middleY), 2, [255, 0, 0, 255], -1);

      }

      // Save the overlay image
      await saveMatAsImage(overlayImage, 'overlay.png');

    }


    // Clean up
    overlayImage.delete();
    lines.delete();
    gridImage.delete();

    return NextResponse.json({ 
      debugImages: {
        gray: '/debug/gray.png',
        blurred: '/debug/blurred.png',
        edges: '/debug/edges.png',
        grid: '/debug/grid.png',
        overlay: '/debug/overlay.png'
      },
      gridInfo: {
        horizontalLines: horizontalLines.length,
        verticalLines: verticalLines.length
      },
      board: boardRepresentation.toString(),
      pieces: pieceRepresentation.toString()
    });

    
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}


// Helper function to compare colors
function isColorSimilar(color1, color2, threshold) {
  return Math.abs(color1[0] - color2[0]) < threshold &&
         Math.abs(color1[1] - color2[1]) < threshold &&
         Math.abs(color1[2] - color2[2]) < threshold;
}


