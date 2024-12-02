const grid = document.getElementById("grid");
const rows = 20; // Number of rows
const cols = 20; // Number of columns
let startNode = null;
let endNode = null;

// Create the grid
function createGrid() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      grid.appendChild(cell);

      // Add click event to set start, end, or walls
      cell.addEventListener("click", () => handleCellClick(cell));
    }
  }
}

// Handle cell clicks
function handleCellClick(cell) {
  if (!startNode) {
    cell.classList.add("start");
    startNode = cell;
  } else if (!endNode) {
    cell.classList.add("end");
    endNode = cell;
  } else {
    cell.classList.toggle("wall");
  }
}

// Reset the grid
function resetGrid() {
  grid.innerHTML = "";
  startNode = null;
  endNode = null;
  createGrid();
}

document.getElementById("reset").addEventListener("click", resetGrid);

createGrid();

function bfs() {
  if (!startNode || !endNode) {
    alert("Please select a start and end node!");
    return;
  }

  const queue = [];
  const visited = new Set();
  const startRow = parseInt(startNode.dataset.row);
  const startCol = parseInt(startNode.dataset.col);
  const endRow = parseInt(endNode.dataset.row);
  const endCol = parseInt(endNode.dataset.col);

  queue.push({ row: startRow, col: startCol, path: [] });

  while (queue.length > 0) {
    const { row, col, path } = queue.shift();
    const key = `${row}-${col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell !== startNode && cell !== endNode) {
      cell.classList.add("visited");
    }

    if (row === endRow && col === endCol) {
      drawPath(path);
      return;
    }

    const neighbors = getNeighbors(row, col);
    for (const neighbor of neighbors) {
      queue.push({ row: neighbor.row, col: neighbor.col, path: [...path, { row, col }] });
    }
  }

  alert("No path found!");
}

// Get neighbors
function getNeighbors(row, col) {
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 },  // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 },  // Right
  ];
  const neighbors = [];

  for (const dir of directions) {
    const newRow = row + dir.row;
    const newCol = col + dir.col;
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      const neighbor = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
      if (!neighbor.classList.contains("wall")) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }
  }

  return neighbors;
}

// Draw the shortest path
function drawPath(path) {
  for (const { row, col } of path) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell !== startNode && cell !== endNode) {
      cell.classList.add("path");
    }
  }
}

document.getElementById("visualize").addEventListener("click", bfs);
