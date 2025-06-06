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
    // const outputDir = path.join(process.cwd(), 'public', 'debug');
    // await fs.mkdir(outputDir, { recursive: true });
    
    // Helper function to save OpenCV matrix as image
    // async function saveMatAsImage(mat, filename) {
    //   const buffer = Buffer.from(mat.data);
    //   await sharp(buffer, {
    //     raw: {
    //       width: mat.cols,
    //       height: mat.rows,
    //       channels: mat.channels()
    //     }
    //   })
    //   .toFile(path.join(outputDir, filename));
    // }

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
    // await saveMatAsImage(gray, 'gray.png');

    // Apply Gaussian blur to reduce noise
    const blurred = new cv.Mat();
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);
    // await saveMatAsImage(blurred, 'blurred.png');

    const edges = new cv.Mat();
    cv.Canny(blurred, edges, 30, 90); 
    // await saveMatAsImage(edges, 'edges.png');

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
      console.log(medianDist, 'medianDist')

      // Filter lines that are approximately medianDist apart (within 20% tolerance)
      const tolerance = 0.2;
      const filteredLines = [];

      // Find first valid line
      let firstValidLine = null;
      for (let i = 0; i < sortedLines.length - 1; i++) {
        const dist = isHorizontal
          ? Math.abs(sortedLines[i + 1][1] - sortedLines[i][1])
          : Math.abs(sortedLines[i + 1][0] - sortedLines[i][0]);
        
        if (Math.abs(dist - medianDist) / medianDist <= tolerance) {
          firstValidLine = sortedLines[i];
          break;
        }
      }

      if (firstValidLine) {
        filteredLines.push(firstValidLine);
      }

      // Continue filtering remaining lines
      for (let i = 0; i < sortedLines.length; i++) {
        if (filteredLines.length === 0) continue;
        
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
    for (const line of filteredHorizontal) {
      cv.line(gridImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }
    for (const line of filteredVertical) {
      cv.line(gridImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }

    // Save the grid image
    // await saveMatAsImage(gridImage, 'grid.png');

    // Create a copy of the original image to overlay grid lines
    const overlayImage = new cv.Mat();
    mat.copyTo(overlayImage);

    // Draw the filtered lines on the original image
    for (const line of filteredHorizontal) {
      cv.line(overlayImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }
    for (const line of filteredVertical) {
      cv.line(overlayImage, 
        new cv.Point(line[0], line[1]), 
        new cv.Point(line[2], line[3]), 
        [0, 255, 0, 255], 2);
    }



    // Sort lines by position to create a reliable grid
    const sortedHorizontal = filteredHorizontal.sort((a, b) => a[1] - b[1]);
    console.log("filteredVertical", filteredVertical)
    const sortedVertical = filteredVertical.sort((a, b) => a[0] - b[0]);

    console.log("sortedHorizontal", sortedHorizontal)
    console.log("sortedVertical", sortedVertical)
    console.log("ok")

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
      // await saveMatAsImage(overlayImage, 'overlay.png');

    }

    // Create a new image for piece visualization
    const pieceVisualization = new cv.Mat();
    mat.copyTo(pieceVisualization);

    // Define piece symbols and colors
    const pieceSymbols = {
      0: '', // Empty
      1: '♔', // White piece
      2: '♚'  // Black piece
    };

    // Draw the detected pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const x1 = sortedVertical[col][0];
        const x2 = sortedVertical[col + 1]?.[0] || mat.cols;
        const y1 = sortedHorizontal[row][1];
        const y2 = sortedHorizontal[row + 1]?.[1] || mat.rows;

        const centerX = Math.floor((x1 + x2) / 2);
        const centerY = Math.floor((y1 + y2) / 2);

        // Draw a circle to represent the piece
        const pieceType = pieceRepresentation[row][col];
        if (pieceType > 0) {
          const color = pieceType === 1 ? [255, 255, 255, 255] : [0, 0, 0, 255]; // White or black
          const radius = Math.floor((x2 - x1) * 0.3); // Size relative to square
          cv.circle(pieceVisualization, new cv.Point(centerX, centerY), radius, color, -1);
          // Add a border to make it more visible
          cv.circle(pieceVisualization, new cv.Point(centerX, centerY), radius, [0, 0, 0, 255], 2);
        }
      }
    }

    // Save the piece visualization
    // await saveMatAsImage(pieceVisualization, 'pieces.png');

    // Clean up
    pieceVisualization.delete();
    overlayImage.delete();
    lines.delete();
    gridImage.delete();

    // Create directory for piece clouds
    // const piecesCloudDir = path.join(process.cwd(), 'public', 'pieces_clouds');
    // await fs.mkdir(piecesCloudDir, { recursive: true });

    // Function to extract piece shape from a square
    async function extractPieceShape(row, col, pieceType) {
      if (!pieceType) return; // Skip empty squares

      const x1 = sortedVertical[col][0];
      const x2 = sortedVertical[col + 1]?.[0] || mat.cols;
      const y1 = sortedHorizontal[row][1];
      const y2 = sortedHorizontal[row + 1]?.[1] || mat.rows;

      // Calculate square dimensions
      const squareWidth = x2 - x1;
      const squareHeight = y2 - y1;

      // Create a new matrix with original square size
      const pieceMat = new cv.Mat(squareHeight, squareWidth, cv.CV_8UC3);
      
      // Fill with white background
      pieceMat.setTo([255, 255, 255, 255]);

      // Extract the full square from original image
      const roi = mat.roi(new cv.Rect(x1, y1, squareWidth, squareHeight));
      roi.copyTo(pieceMat);
      roi.delete();

      // Create a mask for the inner 90% of the square
      const mask = new cv.Mat(squareHeight, squareWidth, cv.CV_8UC1, new cv.Scalar(0));
      
      // Calculate the 5% border size (to mask out the outer 10%)
      const borderSize = Math.floor(squareWidth * 0.05);
      
      // Fill the center rectangle with white (255)
      const innerRect = new cv.Rect(
        borderSize,
        borderSize,
        squareWidth - (2 * borderSize),
        squareHeight - (2 * borderSize)
      );
      mask.roi(innerRect).setTo([255, 255, 255, 255]);

      // Apply the mask to keep only the inner part of the piece
      const maskedPiece = new cv.Mat();
      pieceMat.copyTo(maskedPiece, mask);
      
      // Fill the border area with white
      maskedPiece.roi(new cv.Rect(0, 0, squareWidth, borderSize)).setTo([255, 255, 255, 255]);
      maskedPiece.roi(new cv.Rect(0, squareHeight - borderSize, squareWidth, borderSize)).setTo([255, 255, 255, 255]);
      maskedPiece.roi(new cv.Rect(0, 0, borderSize, squareHeight)).setTo([255, 255, 255, 255]);
      maskedPiece.roi(new cv.Rect(squareWidth - borderSize, 0, borderSize, squareHeight)).setTo([255, 255, 255, 255]);

      // Convert to grayscale
      const grayPiece = new cv.Mat();
      cv.cvtColor(maskedPiece, grayPiece, cv.COLOR_RGB2GRAY);

      // Apply threshold to get binary image
      const binaryPiece = new cv.Mat();
      cv.threshold(grayPiece, binaryPiece, 127, 255, cv.THRESH_BINARY);

      // Find edges using Canny
      const pieceEdges = new cv.Mat();
      cv.Canny(binaryPiece, pieceEdges, 50, 150);

      // Determine piece color (1 for white, 2 for black)
      const middleX = Math.floor(squareWidth / 2);
      const middleY = Math.floor(squareHeight / 2);
      const middlePixel = maskedPiece.ucharPtr(middleY, middleX);
      const middleColor = [middlePixel[0], middlePixel[1], middlePixel[2]];
      const lightPieceColor = [249, 249, 249];
      const darkPieceColor = [91, 89, 87];
      
      const pieceColor = isColorSimilar(middleColor, lightPieceColor, COLOR_THRESHOLD) ? 'white' : 'black';

      // Only save black pieces
      if (pieceColor === 'black') {
        // Save the piece edges with square size in filename
        // const filename = `piece_${pieceType}_${squareWidth}x${squareHeight}.png`;
        // await saveMatAsImage(pieceEdges, path.join('pieces_clouds', filename));
      }

      // Clean up
      pieceMat.delete();
      mask.delete();
      maskedPiece.delete();
      grayPiece.delete();
      binaryPiece.delete();
      pieceEdges.delete();
    }

    // // Board configuration from your input
    // const boardConfig = [
    //   ['r', null, 'b', 'q', null, 'r', 'k', null],
    //   ['p', 'p', null, 'n', 'b', 'p', 'p', 'p'],
    //   [null, null, 'p', null, 'p', 'n', null, null],
    //   [null, null, null, 'p', null, null, 'b', null],
    //   [null, null, 'p', 'p', null, null, null, null],
    //   [null, null, null, null, 'p', 'n', null, null],
    //   ['p', 'p', null, null, 'b', 'p', 'p', 'p'],
    //   ['r', 'n', null, 'q', null, 'r', 'k', null]
    // ];

    // // Extract piece shapes for each piece on the board
    // for (let row = 0; row < 8; row++) {
    //   for (let col = 0; col < 8; col++) {
    //     const pieceType = boardConfig[row][col];
    //     if (pieceType) {
    //       await extractPieceShape(row, col, pieceType);
    //     }
    //   }
    // }

    // After the piece detection loop, add this new function:
    async function matchPieceEdges(row, col, templates) {
      if (pieceRepresentation[row][col] === 0) return null; // Empty square

      const x1 = sortedVertical[col][0];
      const x2 = sortedVertical[col + 1]?.[0] || mat.cols;
      const y1 = sortedHorizontal[row][1];
      const y2 = sortedHorizontal[row + 1]?.[1] || mat.rows;

      // Calculate square dimensions
      const squareWidth = x2 - x1;
      const squareHeight = y2 - y1;

      // Calculate 90% crop dimensions
      const cropWidth = Math.floor(squareWidth * 0.9);
      const cropHeight = Math.floor(squareHeight * 0.9);

      // Calculate crop coordinates (centered in the square)
      const cropX1 = x1 + Math.floor((squareWidth - cropWidth) / 2);
      const cropY1 = y1 + Math.floor((squareHeight - cropHeight) / 2);

      // Create a new matrix for just the piece area
      const pieceMat = new cv.Mat(cropHeight, cropWidth, cv.CV_8UC3);
      
      // Extract the region of interest
      const roi = mat.roi(new cv.Rect(cropX1, cropY1, cropWidth, cropHeight));
      roi.copyTo(pieceMat);
      roi.delete();

      // Convert to grayscale and get edges
      const grayPiece = new cv.Mat();
      cv.cvtColor(pieceMat, grayPiece, cv.COLOR_RGB2GRAY);
      const binaryPiece = new cv.Mat();
      cv.threshold(grayPiece, binaryPiece, 127, 255, cv.THRESH_BINARY);
      const pieceEdges = new cv.Mat();
      cv.Canny(binaryPiece, pieceEdges, 50, 150);
      
      let bestMatch = { piece: null, similarity: 0 };
      
      console.log(`Testing square at row ${row}, col ${col}:`);

      // Compare with each template
      for (const template of templates) {
        try {
          // Prepare for template matching
          const result = new cv.Mat();
          cv.matchTemplate(pieceEdges, template.edges, result, cv.TM_CCOEFF_NORMED);
          
          // Get maximum similarity
          const minMax = cv.minMaxLoc(result);
          const similarity = minMax.maxVal;
          
          console.log(`  Testing ${template.file}: ${(similarity * 100).toFixed(1)}% match`);
          
          if (similarity > bestMatch.similarity) {
            bestMatch = { piece: template.pieceType, similarity };
          }
          
          // Clean up
          result.delete();
        } catch (error) {
          console.error(`Error processing template ${template.file}:`, error);
          continue;
        }
      }

      console.log(`Best match for square (${row},${col}): ${bestMatch.piece} with ${(bestMatch.similarity * 100).toFixed(1)}% confidence`);

      // Clean up
      pieceMat.delete();
      grayPiece.delete();
      binaryPiece.delete();
      pieceEdges.delete();
      
      // Return piece type if similarity is high enough
      return bestMatch.similarity > 0.20 ? bestMatch.piece : null;
    }

    // Load all templates once
    const templatesDir = path.join(process.cwd(), 'public', 'debug/pieces_clouds');
    const templateFiles = await fs.readdir(templatesDir);
    const templates = [];

    console.log('loading....')
    for (const templateFile of templateFiles) {
      if (!templateFile.startsWith('piece_')) continue;
      
      const [_, pieceType, color, size] = templateFile.replace('.png', '').split('_');
      
      try {
        // Read template image using sharp and get raw pixel data
        const templatePath = path.join(templatesDir, templateFile);
        const { data, info } = await sharp(templatePath)
          .raw()
          .toBuffer({ resolveWithObject: true });

        // Create a new Mat with the correct dimensions
        const templateMat = new cv.Mat(info.height, info.width, cv.CV_8UC1);
        
        // Copy pixel data manually
        for (let y = 0; y < info.height; y++) {
          for (let x = 0; x < info.width; x++) {
            const idx = (y * info.width + x) * info.channels;
            const pixel = data[idx]; // Since it's grayscale, we only need one channel
            templateMat.ucharPtr(y, x)[0] = pixel;
          }
        }

        // Get edges
        const templateEdges = new cv.Mat();
        cv.Canny(templateMat, templateEdges, 50, 150);

        // Store template info
        templates.push({
          file: templateFile,
          pieceType,
          edges: templateEdges
        });

        // Clean up
        templateMat.delete();
      } catch (error) {
        console.error(`Error loading template ${templateFile}:`, error);
      }
    }

    // Create board state array
    const boardState = Array(8).fill().map(() => Array(8).fill(null));

    // Match pieces for each square
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (pieceRepresentation[row][col] > 0) {
          const pieceType = await matchPieceEdges(row, col, templates);
          boardState[row][col] = pieceType;
        }
      }
    }

    // Clean up templates
    for (const template of templates) {
      template.edges.delete();
    }

    // Convert board state to FEN notation
    function boardToFEN(board) {
      let fen = '';
      for (let row = 0; row < 8; row++) {
        let emptyCount = 0;
        for (let col = 0; col < 8; col++) {
          const piece = board[row][col];
          if (piece === null) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }
            fen += piece; // Just use the piece type directly since it's already lowercase
          }
        }
        if (emptyCount > 0) {
          fen += emptyCount;
        }
        if (row < 7) fen += '/';
      }
      return fen;
    }

    const fen = boardToFEN(boardState);

    // Create a new image for piece guesses visualization
    const pieceGuessVisualization = new cv.Mat();
    mat.copyTo(pieceGuessVisualization);

    // Draw the guessed pieces
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const x1 = sortedVertical[col][0];
        const x2 = sortedVertical[col + 1]?.[0] || mat.cols;
        const y1 = sortedHorizontal[row][1];
        const y2 = sortedHorizontal[row + 1]?.[1] || mat.rows;

        const centerX = Math.floor((x1 + x2) / 2);
        const centerY = Math.floor((y1 + y2) / 2);

        // Draw the guessed piece type
        const pieceType = boardState[row][col];
        if (pieceType) {
          // Draw red text for the piece type
          cv.putText(
            pieceGuessVisualization,
            pieceType.toUpperCase(),
            new cv.Point(centerX - 10, centerY + 10),
            cv.FONT_HERSHEY_SIMPLEX,
            1,
            [0, 0, 255, 255], // Red color
            2
          );
        }
      }
    }

    // Save the piece guess visualization
    // await saveMatAsImage(pieceGuessVisualization, 'piece_guesses.png');

    // Clean up
    pieceGuessVisualization.delete();

    // Create a formatted board state with piece types and colors
    const formattedBoardState = boardState.map((row, rowIndex) => 
      row.map((piece, colIndex) => {
        if (!piece) return 'empty';
        const color = pieceRepresentation[rowIndex][colIndex] === 1 ? 'white' : 'black';
        return `${color}_${piece}`;
      })
    );

    return NextResponse.json({ 
      // debugImages: {
      //   gray: '/debug/gray.png',
      //   blurred: '/debug/blurred.png',
      //   edges: '/debug/edges.png',
      //   grid: '/debug/grid.png',
      //   overlay: '/debug/overlay.png',
      //   pieces: '/debug/pieces.png',
      //   pieceGuesses: '/debug/piece_guesses.png'
      // },
      gridInfo: {
        horizontalLines: horizontalLines.length,
        verticalLines: verticalLines.length
      },
      board: boardRepresentation.toString(),
      pieces: pieceRepresentation.toString(),
      boardState: boardState,
      formattedBoardState: formattedBoardState,
      fen: fen,
      message: 'Board state analyzed using template matching'
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


