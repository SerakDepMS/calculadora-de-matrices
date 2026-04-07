let currentRows = 2;
let currentCols = 2;
let matrices = [];


const rowsInput = document.getElementById('rowsInput');
const colsInput = document.getElementById('colsInput');
const resizeBtn = document.getElementById('resizeBtn');
const addMatrixBtn = document.getElementById('addMatrixBtn');
const removeMatrixBtn = document.getElementById('removeMatrixBtn');
const resetAllBtn = document.getElementById('resetAllBtn');
const sumarBtn = document.getElementById('sumarBtn');
const matricesContainer = document.getElementById('matricesContainer');
const sumResultArea = document.getElementById('sumResultArea');


function createEmptyMatrix(rows, cols, initialValue = 0) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(initialValue);
    }
    matrix.push(row);
  }
  return matrix;
}


function parseNumberFromInput(str) {
  if (str === null || str === undefined || str.trim() === '') return 0;
  let clean = str.trim().replace(',', '.');
  let num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}


function syncMatricesFromDOM() {
  const cards = document.querySelectorAll('.matrix-card');
  for (let idx = 0; idx < cards.length; idx++) {
    const card = cards[idx];
    const inputs = card.querySelectorAll('input');
    for (let inp of inputs) {
      const row = parseInt(inp.getAttribute('data-row'));
      const col = parseInt(inp.getAttribute('data-col'));
      const numericValue = parseNumberFromInput(inp.value);
      if (matrices[idx] && matrices[idx][row] && matrices[idx][row][col] !== undefined) {
        matrices[idx][row][col] = numericValue;
      }
    }
  }
}


function computeAndDisplaySum() {
  if (matrices.length === 0 || currentRows === 0 || currentCols === 0) {
    sumResultArea.innerHTML = '<div class="info-message">No hay matrices definidas o dimensiones inválidas.</div>';
    return;
  }
  

  syncMatricesFromDOM();
  

  const sumMatrix = createEmptyMatrix(currentRows, currentCols, 0);
  

  for (let m = 0; m < matrices.length; m++) {
    const mat = matrices[m];
    for (let i = 0; i < currentRows; i++) {
      for (let j = 0; j < currentCols; j++) {
        let val = (typeof mat[i][j] === 'number' && !isNaN(mat[i][j])) ? mat[i][j] : 0;
        sumMatrix[i][j] += val;
      }
    }
  }
  

  let html = '<table class="result-table">';
  for (let i = 0; i < currentRows; i++) {
    html += '<tr>';
    for (let j = 0; j < currentCols; j++) {
      let value = sumMatrix[i][j];

      const displayValue = Number.isInteger(value) ? value : parseFloat(value.toFixed(6)).toString();
      html += `<td>${displayValue}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  sumResultArea.innerHTML = html;
}


function renderAllMatrices() {
  if (!matricesContainer) return;
  matricesContainer.innerHTML = '';
  
  if (matrices.length === 0) {
    matricesContainer.innerHTML = '<div class="info-message">No hay matrices. Usa "Añadir matriz" para comenzar.</div>';
    return;
  }
  
  for (let idx = 0; idx < matrices.length; idx++) {
    const matrix = matrices[idx];
    const card = document.createElement('div');
    card.className = 'matrix-card';
    card.setAttribute('data-matrix-idx', idx);
    
    const title = document.createElement('div');
    title.className = 'matrix-title';
    title.innerText = `Matriz ${idx + 1}`;
    
    const table = document.createElement('table');
    table.className = 'matrix-table';
    
    for (let i = 0; i < currentRows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < currentCols; j++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.inputMode = 'decimal';
        input.value = matrix[i][j];
        input.setAttribute('data-matrix-idx', idx);
        input.setAttribute('data-row', i);
        input.setAttribute('data-col', j);
        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    
    card.appendChild(title);
    card.appendChild(table);
    matricesContainer.appendChild(card);
  }
}


function resetAllMatricesToZero() {
  const count = matrices.length;
  const newMatrices = [];
  for (let m = 0; m < count; m++) {
    newMatrices.push(createEmptyMatrix(currentRows, currentCols, 0));
  }
  matrices = newMatrices;
  renderAllMatrices();

  sumResultArea.innerHTML = '<div class="info-message">resultado</div>';
}


function setDimensions(newRows, newCols) {
  if (newRows < 1 || newCols < 1) {
    alert('Filas y columnas deben ser al menos 1.');
    return false;
  }
  if (newRows > 8 || newCols > 8) {
    if (!confirm('Dimensiones grandes (>8) pueden afectar la visualización. ¿Continuar?')) return false;
  }
  currentRows = newRows;
  currentCols = newCols;
  

  const numMatrices = matrices.length;
  const updatedMatrices = [];
  for (let i = 0; i < numMatrices; i++) {
    updatedMatrices.push(createEmptyMatrix(currentRows, currentCols, 0));
  }
  matrices = updatedMatrices;
  renderAllMatrices();
  sumResultArea.innerHTML = '<div class="info-message">resultado</div>';
  return true;
}


function addMatrix() {
  const newMatrix = createEmptyMatrix(currentRows, currentCols, 0);
  matrices.push(newMatrix);
  renderAllMatrices();
  sumResultArea.innerHTML = '<div class="info-message">resultado</div>';
}


function removeLastMatrix() {
  if (matrices.length <= 1) {
    alert('Debe haber al menos una matriz para sumar. No se puede eliminar la única.');
    return;
  }
  matrices.pop();
  renderAllMatrices();
  sumResultArea.innerHTML = '<div class="info-message">resultado</div>';
}


function zeroAllMatrices() {
  for (let m = 0; m < matrices.length; m++) {
    for (let i = 0; i < currentRows; i++) {
      for (let j = 0; j < currentCols; j++) {
        matrices[m][i][j] = 0;
      }
    }
  }
  renderAllMatrices();
  sumResultArea.innerHTML = '<div class="info-message">resultado</div>';
}


function init() {
  currentRows = 2;
  currentCols = 2;
  rowsInput.value = 2;
  colsInput.value = 2;
  matrices = [
    createEmptyMatrix(2, 2, 0),
    createEmptyMatrix(2, 2, 0)
  ];
  renderAllMatrices();
  sumResultArea.innerHTML = '<div class="info-message">resultado</div>';
}

// Asignar eventos
function bindEvents() {
  resizeBtn.addEventListener('click', () => {
    let newRows = parseInt(rowsInput.value);
    let newCols = parseInt(colsInput.value);
    if (isNaN(newRows)) newRows = currentRows;
    if (isNaN(newCols)) newCols = currentCols;
    newRows = Math.min(8, Math.max(1, newRows));
    newCols = Math.min(8, Math.max(1, newCols));
    rowsInput.value = newRows;
    colsInput.value = newCols;
    setDimensions(newRows, newCols);
  });
  
  addMatrixBtn.addEventListener('click', () => {
    addMatrix();
  });
  
  removeMatrixBtn.addEventListener('click', () => {
    removeLastMatrix();
  });
  
  resetAllBtn.addEventListener('click', () => {
    zeroAllMatrices();
  });
  
  sumarBtn.addEventListener('click', () => {
    computeAndDisplaySum();
  });
  

  rowsInput.addEventListener('change', () => {
    let v = parseInt(rowsInput.value);
    if (isNaN(v) || v < 1) rowsInput.value = currentRows;
  });
  colsInput.addEventListener('change', () => {
    let v = parseInt(colsInput.value);
    if (isNaN(v) || v < 1) colsInput.value = currentCols;
  });
}


init();
bindEvents();