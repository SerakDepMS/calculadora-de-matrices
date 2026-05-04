// =============================================
// CALCULADORA DE MATRICES - LÓGICA PRINCIPAL
// =============================================

// --- Estado Global ---
let matrices = [];
let matrixIdCounter = 0;
let lastResult = null; // Almacena el último resultado (matriz 2D o valor escalar)
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const MAX_DIMENSION = 10;
const MIN_DIMENSION = 1;

// --- Referencias al DOM ---
const matricesArea = document.getElementById('matricesArea');
const emptyState = document.getElementById('emptyState');
const toolbarInfo = document.getElementById('toolbarInfo');
const operationsPanel = document.getElementById('operationsPanel');
const resultPanel = document.getElementById('resultPanel');
const resultContent = document.getElementById('resultContent');
const resultFooter = document.getElementById('resultFooter');
const selectMatrixA = document.getElementById('selectMatrixA');
const selectMatrixB = document.getElementById('selectMatrixB');
const fieldMatrixB = document.getElementById('fieldMatrixB');
const fieldScalar = document.getElementById('fieldScalar');
const inputScalar = document.getElementById('inputScalar');
const opType = document.getElementById('opType');

// Modal
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalRows = document.getElementById('modalRows');
const modalCols = document.getElementById('modalCols');
const modalConfirm = document.getElementById('modalConfirm');
const modalCancel = document.getElementById('modalCancel');
const modalClose = document.getElementById('modalClose');

let modalCallback = null; // Función a ejecutar al confirmar el modal

// --- Funciones de Utilidad ---
function getMatrixName(index) {
    if (index < 26) return `Matriz ${ALPHABET[index]}`;
    return `Matriz ${ALPHABET[index % 26]}${Math.floor(index / 26) + 1}`;
}

function refreshMatrixNames() {
    matrices.forEach((m, i) => {
        m.name = getMatrixName(i);
    });
}

function generateId() {
    return matrixIdCounter++;
}

// --- Gestión de Matrices ---
function createMatrix(rows, cols) {
    const id = generateId();
    const name = getMatrixName(matrices.length);
    const data = Array.from({ length: rows }, () => Array(cols).fill(0));
    const matrix = { id, name, rows, cols, data };
    matrices.push(matrix);
    return matrix;
}

function deleteMatrix(id) {
    const index = matrices.findIndex(m => m.id === id);
    if (index !== -1) {
        matrices.splice(index, 1);
        refreshMatrixNames();
    }
}

function resizeMatrix(id, newRows, newCols) {
    const matrix = matrices.find(m => m.id === id);
    if (!matrix) return;
    const newData = Array.from({ length: newRows }, (_, i) =>
        Array.from({ length: newCols }, (_, j) =>
            (i < matrix.rows && j < matrix.cols) ? matrix.data[i][j] : 0
        )
    );
    matrix.rows = newRows;
    matrix.cols = newCols;
    matrix.data = newData;
}

function updateMatrixCell(id, row, col, value) {
    const matrix = matrices.find(m => m.id === id);
    if (!matrix) return;
    if (row < matrix.rows && col < matrix.cols) {
        matrix.data[row][col] = value;
    }
}

// --- Operaciones Matemáticas ---
function addMatrices(A, B) {
    if (A.rows !== B.rows || A.cols !== B.cols) {
        throw new Error(`Dimensiones incompatibles para suma: (${A.rows}×${A.cols}) y (${B.rows}×${B.cols}) deben ser iguales.`);
    }
    const data = Array.from({ length: A.rows }, (_, i) =>
        Array.from({ length: A.cols }, (_, j) => A.data[i][j] + B.data[i][j])
    );
    return { rows: A.rows, cols: A.cols, data };
}

function subtractMatrices(A, B) {
    if (A.rows !== B.rows || A.cols !== B.cols) {
        throw new Error(`Dimensiones incompatibles para resta: (${A.rows}×${A.cols}) y (${B.rows}×${B.cols}) deben ser iguales.`);
    }
    const data = Array.from({ length: A.rows }, (_, i) =>
        Array.from({ length: A.cols }, (_, j) => A.data[i][j] - B.data[i][j])
    );
    return { rows: A.rows, cols: A.cols, data };
}

function multiplyMatrices(A, B) {
    if (A.cols !== B.rows) {
        throw new Error(`Dimensiones incompatibles para multiplicación: columnas de A (${A.cols}) deben ser iguales a filas de B (${B.rows}).`);
    }
    const data = Array.from({ length: A.rows }, (_, i) =>
        Array.from({ length: B.cols }, (_, j) => {
            let sum = 0;
            for (let k = 0; k < A.cols; k++) {
                sum += A.data[i][k] * B.data[k][j];
            }
            return sum;
        })
    );
    return { rows: A.rows, cols: B.cols, data };
}

function scalarMultiply(A, k) {
    const data = Array.from({ length: A.rows }, (_, i) =>
        Array.from({ length: A.cols }, (_, j) => A.data[i][j] * k)
    );
    return { rows: A.rows, cols: A.cols, data };
}

function transpose(A) {
    const data = Array.from({ length: A.cols }, (_, i) =>
        Array.from({ length: A.rows }, (_, j) => A.data[j][i])
    );
    return { rows: A.cols, cols: A.rows, data };
}

function determinant(matrixData) {
    const n = matrixData.length;
    if (n === 0) return 1;
    if (n !== matrixData[0].length) {
        throw new Error('El determinante solo está definido para matrices cuadradas.');
    }
    // Copia profunda para no mutar la original
    const M = matrixData.map(row => [...row]);
    let det = 1;
    const eps = 1e-12;

    for (let col = 0; col < n; col++) {
        // Pivoteo parcial
        let maxRow = col;
        let maxVal = Math.abs(M[col][col]);
        for (let row = col + 1; row < n; row++) {
            const val = Math.abs(M[row][col]);
            if (val > maxVal) {
                maxVal = val;
                maxRow = row;
            }
        }
        if (maxVal < eps) {
            return 0; // Matriz singular
        }
        if (maxRow !== col) {
            [M[col], M[maxRow]] = [M[maxRow], M[col]];
            det = -det;
        }
        const pivot = M[col][col];
        det *= pivot;
        // Eliminar filas inferiores
        for (let row = col + 1; row < n; row++) {
            const factor = M[row][col] / pivot;
            if (Math.abs(factor) < eps) continue;
            for (let k = col; k < n; k++) {
                M[row][k] -= factor * M[col][k];
            }
        }
    }
    // Redondear a precisión razonable
    return Math.round(det * 1e10) / 1e10;
}

function inverse(A) {
    const n = A.rows;
    if (n !== A.cols) {
        throw new Error('La inversa solo está definida para matrices cuadradas.');
    }
    // Crear matriz aumentada [A|I]
    const aug = A.data.map((row, i) => {
        const extended = [...row];
        for (let j = 0; j < n; j++) {
            extended.push(i === j ? 1 : 0);
        }
        return extended;
    });
    const eps = 1e-12;

    for (let col = 0; col < n; col++) {
        // Pivoteo parcial
        let maxRow = col;
        let maxVal = Math.abs(aug[col][col]);
        for (let row = col + 1; row < n; row++) {
            const val = Math.abs(aug[row][col]);
            if (val > maxVal) {
                maxVal = val;
                maxRow = row;
            }
        }
        if (maxVal < eps) {
            throw new Error('La matriz es singular (determinante ≈ 0). No tiene inversa.');
        }
        if (maxRow !== col) {
            [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
        }
        const pivot = aug[col][col];
        // Normalizar fila pivote
        for (let j = 0; j < 2 * n; j++) {
            aug[col][j] /= pivot;
        }
        // Eliminar otras filas
        for (let row = 0; row < n; row++) {
            if (row === col) continue;
            const factor = aug[row][col];
            if (Math.abs(factor) < eps) continue;
            for (let j = 0; j < 2 * n; j++) {
                aug[row][j] -= factor * aug[col][j];
            }
        }
    }
    // Extraer la inversa de la parte derecha
    const invData = aug.map(row => row.slice(n));
    // Redondear
    const rounded = invData.map(row =>
        row.map(val => Math.round(val * 1e10) / 1e10)
    );
    return { rows: n, cols: n, data: rounded };
}

// --- Ajuste automático del ancho de las celdas de entrada ---
function autoResizeInput(e) {
    const input = e ? e.target : this;
    const minWidth = 56;
    const valueLength = input.value.length;
    const fontSize = parseFloat(getComputedStyle(input).fontSize);
    const charWidth = fontSize * 0.6; // Aproximación para fuente monoespaciada
    const padding = 8; // padding lateral total extra
    const newWidth = Math.max(minWidth, valueLength * charWidth + padding);
    input.style.width = newWidth + 'px';
}

// --- Renderizado de Matrices ---
function renderMatrixCard(matrix) {
    const card = document.createElement('div');
    card.className = 'matrix-card';
    card.setAttribute('data-matrix-id', matrix.id);

    // Header
    const header = document.createElement('div');
    header.className = 'matrix-card-header';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'matrix-card-name';
    nameDiv.innerHTML = `${matrix.name} <span class="matrix-badge">${matrix.rows}×${matrix.cols}</span>`;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'matrix-card-actions';

    const resizeBtn = document.createElement('button');
    resizeBtn.className = 'btn-resize';
    resizeBtn.innerHTML = '↵ Redimensionar';
    resizeBtn.title = 'Cambiar dimensiones de esta matriz';
    resizeBtn.addEventListener('click', () => openResizeModal(matrix.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete-matrix';
    deleteBtn.innerHTML = '🗑 Eliminar';
    deleteBtn.title = 'Eliminar esta matriz';
    deleteBtn.addEventListener('click', () => {
        if (confirm(`¿Eliminar "${matrix.name}"? Esta acción no se puede deshacer.`)) {
            deleteMatrix(matrix.id);
            renderAllMatrices();
            updateOperationSelectors();
            clearResult();
        }
    });

    actionsDiv.appendChild(resizeBtn);
    actionsDiv.appendChild(deleteBtn);
    header.appendChild(nameDiv);
    header.appendChild(actionsDiv);

    // Body
    const body = document.createElement('div');
    body.className = 'matrix-card-body';

    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${matrix.cols}, auto)`;

    for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.className = 'matrix-cell-input';
            input.value = matrix.data[i][j];
            input.setAttribute('data-matrix-id', matrix.id);
            input.setAttribute('data-row', i);
            input.setAttribute('data-col', j);

            // Manejar actualización de la matriz y redimensionamiento automático
            input.addEventListener('input', (e) => {
                handleCellInput(e);
                autoResizeInput(e);
            });
            input.addEventListener('blur', (e) => {
                handleCellBlur(e);
                autoResizeInput(e);
            });

            // Ajustar ancho inicial
            autoResizeInput.call(input);

            grid.appendChild(input);
        }
    }

    body.appendChild(grid);
    card.appendChild(header);
    card.appendChild(body);

    return card;
}

function renderAllMatrices() {
    // Limpiar área de matrices
    matricesArea.innerHTML = '';

    if (matrices.length === 0) {
        // Mostrar estado vacío
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.id = 'emptyState';
        emptyDiv.innerHTML = `
            <p>No hay matrices aún</p>
            <span>Haz clic en <strong>"Agregar Matriz"</strong> para crear una nueva matriz con las dimensiones que necesites.</span>
        `;
        matricesArea.appendChild(emptyDiv);
        toolbarInfo.textContent = 'No hay matrices creadas';
    } else {
        matrices.forEach(matrix => {
            matricesArea.appendChild(renderMatrixCard(matrix));
        });
        toolbarInfo.textContent = `${matrices.length} matriz(ces) disponible(s)`;
    }
}

// --- Manejadores de Input de Celdas ---
function handleCellInput(e) {
    const input = e.target;
    const matrixId = parseInt(input.getAttribute('data-matrix-id'));
    const row = parseInt(input.getAttribute('data-row'));
    const col = parseInt(input.getAttribute('data-col'));
    const value = parseFloat(input.value);
    if (!isNaN(value)) {
        updateMatrixCell(matrixId, row, col, value);
    }
}

function handleCellBlur(e) {
    const input = e.target;
    if (input.value.trim() === '' || isNaN(parseFloat(input.value))) {
        input.value = '0';
        const matrixId = parseInt(input.getAttribute('data-matrix-id'));
        const row = parseInt(input.getAttribute('data-row'));
        const col = parseInt(input.getAttribute('data-col'));
        updateMatrixCell(matrixId, row, col, 0);
    }
}

// --- Modal ---
function openModal(title, rows, cols, callback) {
    modalTitle.textContent = title;
    modalRows.value = rows;
    modalCols.value = cols;
    modalCallback = callback;
    modalOverlay.classList.add('active');
    modalRows.focus();
}

function closeModal() {
    modalOverlay.classList.remove('active');
    modalCallback = null;
}

function openAddMatrixModal() {
    openModal('Nueva Matriz', 2, 2, (rows, cols) => {
        createMatrix(rows, cols);
        renderAllMatrices();
        updateOperationSelectors();
    });
}

function openResizeModal(matrixId) {
    const matrix = matrices.find(m => m.id === matrixId);
    if (!matrix) return;
    openModal(`Redimensionar: ${matrix.name}`, matrix.rows, matrix.cols, (rows, cols) => {
        resizeMatrix(matrixId, rows, cols);
        renderAllMatrices();
        updateOperationSelectors();
        clearResult();
    });
}

modalConfirm.addEventListener('click', () => {
    if (!modalCallback) return;
    let rows = parseInt(modalRows.value);
    let cols = parseInt(modalCols.value);
    if (isNaN(rows) || isNaN(cols) || rows < MIN_DIMENSION || cols < MIN_DIMENSION ||
        rows > MAX_DIMENSION || cols > MAX_DIMENSION) {
        alert(`Las dimensiones deben estar entre ${MIN_DIMENSION} y ${MAX_DIMENSION}.`);
        return;
    }
    modalCallback(rows, cols);
    closeModal();
});

modalCancel.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Cerrar modal con Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// --- Selectores de Operación ---
function populateMatrixSelectors() {
    const selectA = selectMatrixA;
    const selectB = selectMatrixB;
    const currentA = selectA.value;
    const currentB = selectB.value;

    selectA.innerHTML = '<option value="">-- Seleccionar --</option>';
    selectB.innerHTML = '<option value="">-- Seleccionar --</option>';

    matrices.forEach(m => {
        const optionA = document.createElement('option');
        optionA.value = m.id;
        optionA.textContent = `${m.name} (${m.rows}×${m.cols})`;
        selectA.appendChild(optionA);

        const optionB = document.createElement('option');
        optionB.value = m.id;
        optionB.textContent = `${m.name} (${m.rows}×${m.cols})`;
        selectB.appendChild(optionB);
    });

    // Restaurar selección previa si aún existe
    if (currentA && matrices.some(m => m.id === parseInt(currentA))) {
        selectA.value = currentA;
    } else if (matrices.length > 0) {
        selectA.value = matrices[0].id;
    }
    if (currentB && matrices.some(m => m.id === parseInt(currentB))) {
        selectB.value = currentB;
    } else if (matrices.length > 1) {
        selectB.value = matrices.length >= 2 ? matrices[1].id : matrices[0].id;
    } else if (matrices.length === 1) {
        selectB.value = matrices[0].id;
    }
}

function updateOperationSelectors() {
    populateMatrixSelectors();
    updateOperationUI();
}

function updateOperationUI() {
    const operation = opType.value;
    const binaryOps = ['add', 'subtract', 'multiply'];
    const scalarOps = ['scalar'];
    const unaryOps = ['transpose', 'determinant', 'inverse'];

    if (binaryOps.includes(operation)) {
        fieldMatrixB.style.display = 'flex';
        fieldScalar.style.display = 'none';
        selectMatrixA.closest('.op-field').style.display = 'flex';
    } else if (scalarOps.includes(operation)) {
        fieldMatrixB.style.display = 'none';
        fieldScalar.style.display = 'flex';
        selectMatrixA.closest('.op-field').style.display = 'flex';
    } else if (unaryOps.includes(operation)) {
        fieldMatrixB.style.display = 'none';
        fieldScalar.style.display = 'none';
        selectMatrixA.closest('.op-field').style.display = 'flex';
    }
}

opType.addEventListener('change', updateOperationUI);

// --- Mostrar Resultado ---
function clearResult() {
    resultPanel.style.display = 'none';
    resultContent.innerHTML = '';
    resultFooter.innerHTML = '';
    lastResult = null;
    document.getElementById('btnSaveResult').style.display = 'none';
}

function showResultMatrix(resultMatrix, operationName) {
    resultPanel.style.display = 'block';
    resultContent.innerHTML = '';
    resultFooter.textContent = `Operación: ${operationName} | Dimensiones: ${resultMatrix.rows}×${resultMatrix.cols}`;

    const grid = document.createElement('div');
    grid.className = 'result-matrix-grid';
    grid.style.gridTemplateColumns = `repeat(${resultMatrix.cols}, auto)`;

    for (let i = 0; i < resultMatrix.rows; i++) {
        for (let j = 0; j < resultMatrix.cols; j++) {
            const cell = document.createElement('div');
            cell.className = 'result-cell';
            cell.textContent = resultMatrix.data[i][j];
            grid.appendChild(cell);
        }
    }

    resultContent.appendChild(grid);
    lastResult = { type: 'matrix', value: resultMatrix };
    document.getElementById('btnSaveResult').style.display = 'inline-flex';
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showResultScalar(value, operationName) {
    resultPanel.style.display = 'block';
    resultContent.innerHTML = '';
    resultFooter.textContent = `Operación: ${operationName}`;

    const scalarDiv = document.createElement('div');
    scalarDiv.className = 'result-scalar';
    scalarDiv.textContent = value;
    resultContent.appendChild(scalarDiv);

    lastResult = { type: 'scalar', value: value };
    document.getElementById('btnSaveResult').style.display = 'none';
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showResultError(message) {
    resultPanel.style.display = 'block';
    resultContent.innerHTML = '';
    resultFooter.textContent = '';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'result-error';
    errorDiv.textContent = '⚠ ' + message;
    resultContent.appendChild(errorDiv);

    lastResult = null;
    document.getElementById('btnSaveResult').style.display = 'none';
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// --- Ejecutar Operación ---
function executeOperation() {
    const operation = opType.value;
    const matrixAId = parseInt(selectMatrixA.value);
    const matrixA = matrices.find(m => m.id === matrixAId);

    if (!matrixA && operation !== 'scalar') {
        // Para operaciones unarias y binarias se necesita al menos matriz A
    }
    if (!matrixA) {
        showResultError('Selecciona al menos una matriz válida (Matriz A).');
        return;
    }

    try {
        switch (operation) {
            case 'add': {
                const matrixBId = parseInt(selectMatrixB.value);
                const matrixB = matrices.find(m => m.id === matrixBId);
                if (!matrixB) throw new Error('Selecciona una Matriz B válida.');
                const result = addMatrices(matrixA, matrixB);
                showResultMatrix(result, `Suma: ${matrixA.name} + ${matrixB.name}`);
                break;
            }
            case 'subtract': {
                const matrixBId = parseInt(selectMatrixB.value);
                const matrixB = matrices.find(m => m.id === matrixBId);
                if (!matrixB) throw new Error('Selecciona una Matriz B válida.');
                const result = subtractMatrices(matrixA, matrixB);
                showResultMatrix(result, `Resta: ${matrixA.name} − ${matrixB.name}`);
                break;
            }
            case 'multiply': {
                const matrixBId = parseInt(selectMatrixB.value);
                const matrixB = matrices.find(m => m.id === matrixBId);
                if (!matrixB) throw new Error('Selecciona una Matriz B válida.');
                const result = multiplyMatrices(matrixA, matrixB);
                showResultMatrix(result, `Multiplicación: ${matrixA.name} × ${matrixB.name}`);
                break;
            }
            case 'scalar': {
                const k = parseFloat(inputScalar.value);
                if (isNaN(k)) throw new Error('Ingresa un valor numérico válido para el escalar (k).');
                const result = scalarMultiply(matrixA, k);
                showResultMatrix(result, `Escalar: ${k} × ${matrixA.name}`);
                break;
            }
            case 'transpose': {
                const result = transpose(matrixA);
                showResultMatrix(result, `Transpuesta: ${matrixA.name}ᵀ`);
                break;
            }
            case 'determinant': {
                if (matrixA.rows !== matrixA.cols) {
                    throw new Error(`La matriz ${matrixA.name} no es cuadrada (${matrixA.rows}×${matrixA.cols}). El determinante requiere matriz cuadrada.`);
                }
                const det = determinant(matrixA.data);
                showResultScalar(det, `Determinante: |${matrixA.name}|`);
                break;
            }
            case 'inverse': {
                const result = inverse(matrixA);
                showResultMatrix(result, `Inversa: ${matrixA.name}⁻¹`);
                break;
            }
            default:
                throw new Error('Operación no reconocida.');
        }
    } catch (error) {
        showResultError(error.message);
    }
}


function saveResultAsMatrix() {
    if (!lastResult || lastResult.type !== 'matrix') return;
    const { rows, cols, data } = lastResult.value;
    const newMatrix = createMatrix(rows, cols);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            newMatrix.data[i][j] = data[i][j];
        }
    }
    renderAllMatrices();
    updateOperationSelectors();

    const lastCard = matricesArea.querySelector('.matrix-card:last-child');
    if (lastCard) {
        lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        lastCard.style.boxShadow = '0 0 0 4px var(--primary-ring)';
        setTimeout(() => {
            lastCard.style.boxShadow = '';
        }, 1500);
    }
}


document.getElementById('btnAddMatrix').addEventListener('click', openAddMatrixModal);
document.getElementById('btnCalculate').addEventListener('click', executeOperation);
document.getElementById('btnSaveResult').addEventListener('click', saveResultAsMatrix);
document.getElementById('btnCloseResult').addEventListener('click', clearResult);


function init() {
    renderAllMatrices();
    updateOperationSelectors();
    updateOperationUI();
    clearResult();

    resultPanel.style.display = 'none';
    document.getElementById('btnSaveResult').style.display = 'none';
}


init();