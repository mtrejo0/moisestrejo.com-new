"use client";

import { useState } from "react";

const ROWS = 6;
const COLS = 7;
const EMPTY = null;
const RED = "red";
const YELLOW = "yellow";
const SEARCH_MS = 350;
const WIN_SCORE = 1_000_000;

const COLUMN_ORDER = [3, 2, 4, 1, 5, 0, 6];

const createEmptyBoard = () =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));

const cloneBoard = (board) => board.map((row) => [...row]);

const getLowestEmptyRow = (board, col) => {
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][col] === EMPTY) return row;
  }
  return -1;
};

const getValidColumns = (board) => {
  const cols = [];
  for (const col of COLUMN_ORDER) {
    if (board[0][col] === EMPTY) cols.push(col);
  }
  return cols;
};

const dropPiece = (board, col, color) => {
  const row = getLowestEmptyRow(board, col);
  if (row === -1) return null;
  const next = cloneBoard(board);
  next[row][col] = color;
  return { board: next, row, col };
};

const checkWinFrom = (board, row, col, color) => {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    let count = 1;
    for (const sign of [1, -1]) {
      let r = row + dr * sign;
      let c = col + dc * sign;
      while (
        r >= 0 &&
        r < ROWS &&
        c >= 0 &&
        c < COLS &&
        board[r][c] === color
      ) {
        count += 1;
        r += dr * sign;
        c += dc * sign;
      }
    }
    if (count >= 4) return true;
  }
  return false;
};

const isBoardFull = (board) => board[0].every((cell) => cell !== EMPTY);

const countWindow = (window, color) => {
  const opponent = color === RED ? YELLOW : RED;
  let mine = 0;
  let theirs = 0;
  let empty = 0;
  for (const cell of window) {
    if (cell === color) mine += 1;
    else if (cell === opponent) theirs += 1;
    else empty += 1;
  }
  if (theirs > 0 && mine > 0) return 0;
  if (mine === 3 && empty === 1) return 50;
  if (mine === 2 && empty === 2) return 10;
  if (mine === 1 && empty === 3) return 1;
  if (theirs === 3 && empty === 1) return -40;
  if (theirs === 2 && empty === 2) return -8;
  return 0;
};

const evaluateBoard = (board, color) => {
  let score = 0;
  const centerCol = 3;
  for (let row = 0; row < ROWS; row += 1) {
    if (board[row][centerCol] === color) score += 3;
  }

  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS - 3; col += 1) {
      score += countWindow(
        [
          board[row][col],
          board[row][col + 1],
          board[row][col + 2],
          board[row][col + 3],
        ],
        color,
      );
    }
  }

  for (let col = 0; col < COLS; col += 1) {
    for (let row = 0; row < ROWS - 3; row += 1) {
      score += countWindow(
        [
          board[row][col],
          board[row + 1][col],
          board[row + 2][col],
          board[row + 3][col],
        ],
        color,
      );
    }
  }

  for (let row = 0; row < ROWS - 3; row += 1) {
    for (let col = 0; col < COLS - 3; col += 1) {
      score += countWindow(
        [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3],
        ],
        color,
      );
    }
  }

  for (let row = 3; row < ROWS; row += 1) {
    for (let col = 0; col < COLS - 3; col += 1) {
      score += countWindow(
        [
          board[row][col],
          board[row - 1][col + 1],
          board[row - 2][col + 2],
          board[row - 3][col + 3],
        ],
        color,
      );
    }
  }

  return score;
};

const minimax = (
  board,
  depth,
  alpha,
  beta,
  maximizing,
  aiColor,
  deadline,
) => {
  if (Date.now() > deadline) {
    return { score: evaluateBoard(board, aiColor), timedOut: true };
  }

  const opponent = aiColor === RED ? YELLOW : RED;
  const valid = getValidColumns(board);

  if (depth === 0 || valid.length === 0) {
    return { score: evaluateBoard(board, aiColor), timedOut: false };
  }

  if (maximizing) {
    let best = { score: -Infinity, column: valid[0], timedOut: false };
    for (const col of valid) {
      const placed = dropPiece(board, col, aiColor);
      if (!placed) continue;
      if (checkWinFrom(placed.board, placed.row, placed.col, aiColor)) {
        return { score: WIN_SCORE + depth, column: col, timedOut: false };
      }
      const result = minimax(
        placed.board,
        depth - 1,
        alpha,
        beta,
        false,
        aiColor,
        deadline,
      );
      if (result.timedOut) return { ...best, timedOut: true };
      if (result.score > best.score) {
        best = { score: result.score, column: col, timedOut: false };
      }
      alpha = Math.max(alpha, best.score);
      if (alpha >= beta) break;
    }
    return best;
  }

  let best = { score: Infinity, column: valid[0], timedOut: false };
  for (const col of valid) {
    const placed = dropPiece(board, col, opponent);
    if (!placed) continue;
    if (checkWinFrom(placed.board, placed.row, placed.col, opponent)) {
      return { score: -WIN_SCORE - depth, column: col, timedOut: false };
    }
    const result = minimax(
      placed.board,
      depth - 1,
      alpha,
      beta,
      true,
      aiColor,
      deadline,
    );
    if (result.timedOut) return { ...best, timedOut: true };
    if (result.score < best.score) {
      best = { score: result.score, column: col, timedOut: false };
    }
    beta = Math.min(beta, best.score);
    if (alpha >= beta) break;
  }
  return best;
};

const findBestMove = (board, aiColor) => {
  const valid = getValidColumns(board);
  if (valid.length === 0) return null;

  for (const col of valid) {
    const placed = dropPiece(board, col, aiColor);
    if (
      placed &&
      checkWinFrom(placed.board, placed.row, placed.col, aiColor)
    ) {
      return col;
    }
  }

  const opponent = aiColor === RED ? YELLOW : RED;
  for (const col of valid) {
    const placed = dropPiece(board, col, opponent);
    if (
      placed &&
      checkWinFrom(placed.board, placed.row, placed.col, opponent)
    ) {
      return col;
    }
  }

  const deadline = Date.now() + SEARCH_MS;
  let bestCol = valid[0];

  for (let depth = 1; depth <= 12; depth += 1) {
    const result = minimax(
      board,
      depth,
      -Infinity,
      Infinity,
      true,
      aiColor,
      deadline,
    );
    if (result.timedOut) break;
    if (result.column !== undefined && result.column !== null) {
      bestCol = result.column;
    }
    if (Math.abs(result.score) >= WIN_SCORE) break;
  }

  return bestCol;
};

const discClass = (color) =>
  color === RED
    ? "bg-red-500 shadow-inner"
    : color === YELLOW
      ? "bg-yellow-400 shadow-inner"
      : "bg-sky-100";

const ConnectFour = () => {
  const [phase, setPhase] = useState("setup");
  const [board, setBoard] = useState(createEmptyBoard);
  const [current, setCurrent] = useState(RED);
  const [winner, setWinner] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState(null);

  const resetToSetup = () => {
    setPhase("setup");
    setBoard(createEmptyBoard());
    setCurrent(RED);
    setWinner(null);
    setThinking(false);
    setLastMove(null);
  };

  const chooseStarter = (color) => {
    setBoard(createEmptyBoard());
    setCurrent(color);
    setWinner(null);
    setLastMove(null);
    setThinking(false);
    setPhase("playing");
  };

  const commitMove = (col, color, currentBoard) => {
    const placed = dropPiece(currentBoard, col, color);
    if (!placed) return;

    const won = checkWinFrom(placed.board, placed.row, placed.col, color);
    setBoard(placed.board);
    setLastMove({ row: placed.row, col: placed.col });

    if (won) {
      setWinner(color);
      setPhase("over");
      return;
    }
    if (isBoardFull(placed.board)) {
      setWinner("draw");
      setPhase("over");
      return;
    }
    setCurrent(color === RED ? YELLOW : RED);
  };

  const applyMove = (col) => {
    if (phase !== "playing" || thinking) return;
    commitMove(col, current, board);
  };

  const playOptimalMove = () => {
    if (phase !== "playing" || thinking) return;
    const boardSnapshot = board;
    const color = current;
    setThinking(true);

    setTimeout(() => {
      const col = findBestMove(boardSnapshot, color);
      setThinking(false);
      if (col === null || col === undefined) return;
      commitMove(col, color, boardSnapshot);
    }, 30);
  };

  const statusText = () => {
    if (phase === "setup") return "Choose who starts";
    if (thinking) return "Finding the most optimal move…";
    if (phase === "over") {
      if (winner === "draw") return "Draw — board is full";
      return `${winner === RED ? "Red" : "Yellow"} wins!`;
    }
    return `${current === RED ? "Red" : "Yellow"}'s turn`;
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-2 text-3xl font-bold text-slate-800">Connect Four</h1>
      <p className="mb-6 text-slate-600">
        Hot-seat Connect Four. Drop discs by column, or let the solver play the
        most optimal move for the current player.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <p
          className={`text-lg font-semibold ${
            phase === "playing" && current === RED
              ? "text-red-600"
              : phase === "playing" && current === YELLOW
                ? "text-yellow-600"
                : "text-slate-800"
          }`}
        >
          {statusText()}
        </p>
        {(phase === "playing" || phase === "over") && (
          <button
            type="button"
            onClick={resetToSetup}
            className="rounded bg-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            New Game
          </button>
        )}
      </div>

      {phase === "setup" && (
        <div className="mb-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => chooseStarter(RED)}
            className="rounded bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
          >
            Red starts
          </button>
          <button
            type="button"
            onClick={() => chooseStarter(YELLOW)}
            className="rounded bg-yellow-400 px-5 py-3 font-semibold text-slate-900 hover:bg-yellow-500"
          >
            Yellow starts
          </button>
        </div>
      )}

      {phase !== "setup" && (
        <>
          <div className="mb-4">
            <button
              type="button"
              onClick={playOptimalMove}
              disabled={phase !== "playing" || thinking}
              className="rounded bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {thinking ? "Thinking…" : "Most optimal move"}
            </button>
          </div>

          <div
            className="inline-block rounded-lg bg-blue-700 p-3 shadow-md"
            role="grid"
            aria-label="Connect Four board"
          >
            <div className="mb-2 grid grid-cols-7 gap-2">
              {Array.from({ length: COLS }, (_, col) => {
                const canDrop =
                  phase === "playing" &&
                  !thinking &&
                  getLowestEmptyRow(board, col) !== -1;
                return (
                  <button
                    key={`drop-${col}`}
                    type="button"
                    disabled={!canDrop}
                    onClick={() => applyMove(col)}
                    className="rounded bg-blue-500/80 py-1 text-xs font-semibold text-white hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={`Drop in column ${col + 1}`}
                  >
                    ↓
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isLast =
                    lastMove &&
                    lastMove.row === rowIndex &&
                    lastMove.col === colIndex;
                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      type="button"
                      disabled={
                        phase !== "playing" ||
                        thinking ||
                        getLowestEmptyRow(board, colIndex) === -1
                      }
                      onClick={() => applyMove(colIndex)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12 ${discClass(
                        cell,
                      )} ${isLast ? "ring-2 ring-white ring-offset-2 ring-offset-blue-700" : ""}`}
                      aria-label={
                        cell
                          ? `${cell} disc at row ${rowIndex + 1}, column ${colIndex + 1}`
                          : `Empty cell, drop in column ${colIndex + 1}`
                      }
                    />
                  );
                }),
              )}
            </div>
          </div>
        </>
      )}

      <section className="mt-10 border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-600">
        <h2 className="mb-2 text-base font-semibold text-slate-800">
          TL;DR — how this was built
        </h2>
        <p className="mb-3">
          This is a client-side React internal app: a 6×7 board in component
          state, gravity drops into the lowest empty cell of a column, and
          win checks for four-in-a-row in every direction (plus draw when the
          board fills). Two players share one device; either can also ask the
          solver to move for the current color.
        </p>
        <p>
          <span className="font-medium text-slate-700">Most optimal move</span>{" "}
          uses minimax with alpha-beta pruning. It searches the game tree,
          ordering columns center-out for faster pruning. Instant wins and
          blocks are checked first. Deeper search uses iterative deepening
          with a short time budget (~350ms): each extra ply improves the
          pick until time runs out. Non-terminal leaves are scored with a
          heuristic that favors center control and open twos/threes (and
          penalizes the opponent’s threats)—so early positions stay snappy
          while mid/late games approach near-perfect play.
        </p>
      </section>
    </div>
  );
};

export default ConnectFour;
