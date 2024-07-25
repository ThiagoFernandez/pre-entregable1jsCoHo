import { showError, validatePositiveNumber, validateDiscount, saveToLocalStorage, getFromLocalStorage } from './utils.js';

// Definición global de las variables
let funds;
let games = []; // Inicializa games como un array vacío
let remainingFunds;

// Event Listeners
document.getElementById('calculate-budget').addEventListener('click', calculateBudget);
document.getElementById('clear-results').addEventListener('click', clearResults);
document.getElementById('add-game').addEventListener('click', addGame);
document.getElementById('save-calculation').addEventListener('click', saveCalculation);

// Función para agregar un nuevo juego
function addGame() {
    const gameCount = document.querySelectorAll('#games-container .form-group').length + 1;
    const gameContainer = document.createElement('div');
    gameContainer.className = 'form-group';
    gameContainer.innerHTML = `
        <label for="game${gameCount}_price">Price of Game ${gameCount}:</label>
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
        if (!validatePositiveNumber(funds)) {
            showError('Please enter a valid amount of funds.');
            return;
        }
        
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

        for (let i = 0; i < games.length; i++) {
            remainingFunds -= games[i].price;
        }

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

        let previousResults = getFromLocalStorage('previousResults');
        previousResults.push({
            name: calculationName,
            funds: funds,
            games: games,
            remainingFunds: remainingFunds
        });
        saveToLocalStorage('previousResults', previousResults);

        document.getElementById('calculation-name').value = '';
        $('#nameModal').modal('hide');

        displayResult(remainingFunds);
        displayPreviousResults();
    } catch (error) {
        console.error('Error saving calculation:', error);
        showError('An error occurred while saving the calculation.');
    }
}

// Función para mostrar el resultado del cálculo
function displayResult(remainingFunds) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '<h2>Result:</h2>';
    resultElement.innerHTML += '<p>Available Funds: $' + funds.toFixed(2) + '</p>';

    for (let i = 0; i < games.length; i++) {
        resultElement.innerHTML += '<p>Price of Game ' + (i + 1) + ': $' + games[i].price.toFixed(2) + '</p>';
        if (games[i].discount) {
            resultElement.innerHTML += '<p>This game has a discount!</p>';
        }
    }

    resultElement.innerHTML += '<p>Remaining Funds: $' + remainingFunds.toFixed(2) + '</p>';

    if (remainingFunds < 0) {
        showError("You don't have enough funds to purchase these games!");
    }
}

// Función para limpiar los resultados
function clearResults() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('previous-results').innerHTML = '';
    document.getElementById('games-container').innerHTML = '';
    document.getElementById('funds').value = '';
}

// Función para mostrar resultados anteriores
function displayPreviousResults() {
    try {
        const previousResults = getFromLocalStorage('previousResults');
        let previousResultsElement = document.getElementById('previous-results');
        previousResultsElement.innerHTML = '<h2>Previous Results:</h2>';
        if (previousResults.length === 0) {
            previousResultsElement.innerHTML += '<p>No previous results found.</p>';
        } else {
            previousResults.forEach(result => {
                previousResultsElement.innerHTML += '<div class="result-item"><h4>' + (result.name || 'Unnamed Calculation') + '</h4>';
                previousResultsElement.innerHTML += '<p>Available Funds: $' + (result.funds ? result.funds.toFixed(2) : 'N/A') + '</p>';
                if (result.games && Array.isArray(result.games)) {
                    result.games.forEach((game, index) => {
                        previousResultsElement.innerHTML += '<p>Price of Game ' + (index + 1) + ': $' + (game.price ? game.price.toFixed(2) : 'N/A') + '</p>';
                        if (game.discount) {
                            previousResultsElement.innerHTML += '<p>This game has a discount!</p>';
                        }
                    });
                }
                previousResultsElement.innerHTML += '<p>Remaining Funds: $' + (result.remainingFunds ? result.remainingFunds.toFixed(2) : 'N/A') + '</p></div>';
            });
        }
    } catch (error) {
        console.error('Error displaying previous results:', error);
        showError('An error occurred while displaying previous results.');
    }
}
