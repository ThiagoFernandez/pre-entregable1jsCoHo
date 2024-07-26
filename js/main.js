import { showError, validatePositiveNumber, validateDiscount, saveToLocalStorage, getFromLocalStorage, displayResult } from './utils.js';

// Definición global de las variables
let funds;
let games = []; // Inicializa games como un array vacío
let remainingFunds;
let platform; // Nueva variable para la plataforma
let currency; // Nueva variable para la moneda
let paymentMethod; // Nueva variable para el método de pago

// Event Listeners
document.addEventListener('DOMContentLoaded', initPage);
document.getElementById('calculate-budget').addEventListener('click', calculateBudget);
document.getElementById('clear-results').addEventListener('click', clearResults);
document.getElementById('clear-history').addEventListener('click', clearHistory);
document.getElementById('add-game').addEventListener('click', addGame);
document.getElementById('save-calculation').addEventListener('click', saveCalculation);
document.getElementById('confirm-settings').addEventListener('click', confirmSettings);
document.getElementById('platform').addEventListener('change', updatePlatform);
document.getElementById('currency').addEventListener('change', updateCurrency);
document.getElementById('payment-method').addEventListener('change', updatePaymentMethod);

// Inicializa la página con las selecciones
function initPage() {
    showPlatformModal();
    displayPreviousResults(); // Muestra resultados anteriores al cargar la página
}

// Muestra el modal para seleccionar la plataforma
function showPlatformModal() {
    $('#platformModal').modal('show');
}

// Actualiza la plataforma seleccionada
function updatePlatform() {
    platform = document.getElementById('platform').value;
}

// Actualiza la moneda seleccionada
function updateCurrency() {
    currency = document.getElementById('currency').value;
}

// Actualiza el método de pago seleccionado
function updatePaymentMethod() {
    paymentMethod = document.getElementById('payment-method').value;
}

// Confirma la selección y aplica los cambios
function confirmSettings() {
    if (!platform || !currency || !paymentMethod) {
        showError('Please select a platform, currency, and payment method.');
        return;
    }
    document.body.className = platform; // Cambia la clase del body para aplicar el fondo
    $('#platformModal').modal('hide'); // Oculta el modal de plataforma
}

// Función para agregar un nuevo juego
function addGame() {
    const gameCount = document.querySelectorAll('#games-container .form-group').length + 1;
    const gameContainer = document.createElement('div');
    gameContainer.className = 'form-group';
    gameContainer.innerHTML = `
        <label for="game${gameCount}_price">Price of Game ${gameCount} (${currency}):</label>
        <input type="number" id="game${gameCount}_price" class="form-control" placeholder="Price of Game ${gameCount}">
        <div class="form-check">
            <input type="checkbox" id="game${gameCount}_discount" class="form-check-input">
            <label for="game${gameCount}_discount" class="form-check-label">Has discount (%)</label>
        </div>
        <input type="number" id="game${gameCount}_discount_value" class="form-control" min="0" max="100" step="1" placeholder="Discount">
    `;
    document.getElementById('games-container').appendChild(gameContainer);
}

// Función para calcular el presupuesto
function calculateBudget() {
    try {
        funds = parseFloat(document.getElementById('funds').value);
        games = []; // Reinicia el array de juegos

        const gameInputs = document.querySelectorAll('#games-container .form-group');
        gameInputs.forEach((gameInput, index) => {
            const gamePriceInput = gameInput.querySelector(`#game${index + 1}_price`);
            const gameDiscountCheckbox = gameInput.querySelector(`#game${index + 1}_discount`);
            const gameDiscountValueInput = gameInput.querySelector(`#game${index + 1}_discount_value`);

            if (!gamePriceInput || !gameDiscountCheckbox || !gameDiscountValueInput) {
                showError(`Please fill in all details for Game ${index + 1}`);
                return;
            }

            let gamePrice = parseFloat(gamePriceInput.value);
            const hasDiscount = gameDiscountCheckbox.checked;
            const discount = parseFloat(gameDiscountValueInput.value);

            if (!validatePositiveNumber(gamePrice)) {
                showError('Please enter a valid price for Game ' + (index + 1));
                return;
            }

            if (hasDiscount && !validateDiscount(discount)) {
                showError('Please enter a valid discount (between 0 and 100) for Game ' + (index + 1));
                return;
            }

            if (hasDiscount) {
                gamePrice -= (gamePrice * (discount / 100));
            }

            games.push({
                price: gamePrice,
                discount: hasDiscount
            });
        });

        remainingFunds = funds;

        games.forEach(game => {
            remainingFunds -= game.price;
        });

        $('#nameModal').modal('show');
    } catch (error) {
        console.error('Error calculating budget:', error);
        showError('An error occurred while calculating the budget.');
    }
}

// Función para guardar el cálculo
function saveCalculation() {
    try {
        const calculationName = document.getElementById('calculation-name').value.trim();
        if (calculationName === '') {
            showError('Please enter a name for your calculation.');
            return;
        }

        let previousResults = getFromLocalStorage('previousResults') || [];
        previousResults.push({
            name: calculationName,
            funds: funds,
            games: games,
            remainingFunds: remainingFunds,
            platform: platform,
            currency: currency,
            paymentMethod: paymentMethod
        });
        saveToLocalStorage('previousResults', previousResults);

        document.getElementById('calculation-name').value = '';
        $('#nameModal').modal('hide');

        displayResult(funds, games, remainingFunds, currency);
        displayPreviousResults();
    } catch (error) {
        console.error('Error saving calculation:', error);
        showError('An error occurred while saving the calculation.');
    }
}

// Función para limpiar los resultados
function clearResults() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('previous-results').innerHTML = '';
    document.getElementById('games-container').innerHTML = '';
    document.getElementById('funds').value = '';
}

// Función para borrar el historial de cálculos guardados
function clearHistory() {
    if (confirm('Are you sure you want to clear all previous results?')) {
        localStorage.removeItem('previousResults');
        displayPreviousResults();
    }
}

// Función para mostrar resultados anteriores
function displayPreviousResults() {
    try {
        const previousResults = getFromLocalStorage('previousResults') || [];
        let previousResultsElement = document.getElementById('previous-results');
        previousResultsElement.innerHTML = '<h2>Previous Results:</h2>';
        if (previousResults.length === 0) {
            previousResultsElement.innerHTML += '<p>No previous results found.</p>';
        } else {
            previousResults.forEach(result => {
                previousResultsElement.innerHTML += '<div class="result-item"><h4>' + (result.name || 'Unnamed Calculation') + '</h4>';
                previousResultsElement.innerHTML += `<p>Available Funds: ${result.currency || 'N/A'} ${result.funds ? result.funds.toFixed(2) : 'N/A'}</p>`;
                if (result.games && Array.isArray(result.games)) {
                    result.games.forEach((game, index) => {
                        previousResultsElement.innerHTML += `<p>Price of Game ${index + 1}: ${result.currency || 'N/A'} ${game.price ? game.price.toFixed(2) : 'N/A'}</p>`;
                        if (game.discount) {
                            previousResultsElement.innerHTML += '<p>This game has a discount!</p>';
                        }
                    });
                }
                previousResultsElement.innerHTML += `<p>Remaining Funds: ${result.currency || 'N/A'} ${result.remainingFunds ? result.remainingFunds.toFixed(2) : 'N/A'}</p></div>`;
            });
        }
    } catch (error) {
        console.error('Error displaying previous results:', error);
        showError('An error occurred while displaying previous results.');
    }
}
