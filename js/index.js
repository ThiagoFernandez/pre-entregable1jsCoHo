let funds;
const games = [];
let remainingFunds;

document.getElementById('calculate-budget').addEventListener('click', calculateBudget);
document.getElementById('clear-results').addEventListener('click', clearResults);
document.getElementById('add-game').addEventListener('click', addGame);
document.getElementById('save-calculation').addEventListener('click', saveCalculation);

function addGame() {
    const gameCount = games.length + 1;
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

function calculateBudget() {
    funds = parseFloat(document.getElementById('funds').value);
    games.length = 0; // Limpiar datos previos de juegos

    const gameInputs = document.querySelectorAll('#games-container .form-group');
    gameInputs.forEach((gameInput, index) => {
        const gamePriceInput = gameInput.querySelector(`#game${index + 1}_price`);
        const gameDiscountCheckbox = gameInput.querySelector(`#game${index + 1}_discount`);
        const gameDiscountValueInput = gameInput.querySelector(`#game${index + 1}_discount_value`);

        if (!gamePriceInput || !gameDiscountCheckbox || !gameDiscountValueInput) {
            alert(`Please fill in all details for Game ${index + 1}`);
            return;
        }

        let gamePrice = parseFloat(gamePriceInput.value);
        const hasDiscount = gameDiscountCheckbox.checked;
        const discount = parseFloat(gameDiscountValueInput.value);

        if (isNaN(gamePrice) || gamePrice <= 0) {
            alert('Please enter a valid price for Game ' + (index + 1));
            return;
        }

        if (hasDiscount && (isNaN(discount) || discount < 0 || discount > 100)) {
            alert('Please enter a valid discount (between 0 and 100) for Game ' + (index + 1));
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

    // Mostrar modal para ingresar nombre del cálculo
    $('#nameModal').modal('show');
}

function saveCalculation() {
    const calculationName = document.getElementById('calculation-name').value.trim();
    if (calculationName === '') {
        alert('Please enter a name for your calculation.');
        return;
    }

    let previousResults = JSON.parse(localStorage.getItem('previousResults')) || [];
    previousResults.push({
        name: calculationName,
        funds: funds,
        games: games,
        remainingFunds: remainingFunds
    });
    localStorage.setItem('previousResults', JSON.stringify(previousResults));

    // Limpiar modal y cerrarlo
    document.getElementById('calculation-name').value = '';
    $('#nameModal').modal('hide');

    // Mostrar resultados actualizados
    displayResult(remainingFunds);
    displayPreviousResults();
}

function displayResult(remainingFunds) {
    let resultElement = document.getElementById('result');
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
        alert("You don't have enough funds to purchase these games!");
    }
}

function clearResults() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('previous-results').innerHTML = '';
    localStorage.removeItem('previousResults');
}

function displayPreviousResults() {
    let previousResultsElement = document.getElementById('previous-results');
    previousResultsElement.innerHTML = '';

    let previousResults = JSON.parse(localStorage.getItem('previousResults')) || [];
    previousResults.forEach((result, index) => {
        const resultContainer = document.createElement('div');
        resultContainer.className = 'previous-result';
        resultContainer.innerHTML = `
            <h3>${result.name}</h3>
            <p>Available Funds: $${result.funds.toFixed(2)}</p>
            ${result.games.map((game, i) => `
                <p>Price of Game ${i + 1}: $${game.price.toFixed(2)}</p>
                ${game.discount ? '<p>This game has a discount!</p>' : ''}
            `).join('')}
            <p>Remaining Funds: $${result.remainingFunds.toFixed(2)}</p>
            <button class="btn btn-danger btn-sm" onclick="deleteCalculation(${index})">Delete</button>
            <hr>
        `;
        previousResultsElement.appendChild(resultContainer);
    });
}

// Definición de la función deleteCalculation
function deleteCalculation(index) {
    let previousResults = JSON.parse(localStorage.getItem('previousResults')) || [];
    
    // Remove the calculation at the specified index
    previousResults.splice(index, 1);
    
    // Update localStorage
    localStorage.setItem('previousResults', JSON.stringify(previousResults));
    
    // Refresh the display of previous results
    displayPreviousResults();
}

document.addEventListener('DOMContentLoaded', displayPreviousResults);
