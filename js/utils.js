// Función para mostrar errores
export function showError(message) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = `<p class="text-danger">${message}</p>`;
}

// Función para validar números positivos
export function validatePositiveNumber(value) {
    const number = parseFloat(value);
    return !isNaN(number) && number > 0;
}

// Función para validar descuento
export function validateDiscount(discount) {
    return !isNaN(discount) && discount >= 0 && discount <= 100;
}

// Función para guardar en el localStorage
export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Función para obtener del localStorage
export function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Función para mostrar el resultado del cálculo
export function displayResult(funds, games, remainingFunds, currency) {
    const resultElement = document.getElementById('result');
    resultElement.innerHTML = '<h2>Result:</h2>';
    resultElement.innerHTML += `<p>Available Funds: ${currency} ${funds.toFixed(2)}</p>`;

    if (remainingFunds < 0) {
        showError("You don't have enough funds to purchase these games!");
        return; // Salir de la función si no hay suficientes fondos
    }

    for (let i = 0; i < games.length; i++) {
        resultElement.innerHTML += `<p>Price of Game ${i + 1}: ${currency} ${games[i].price.toFixed(2)}</p>`;
        if (games[i].discount) {
            resultElement.innerHTML += '<p>This game has a discount!</p>';
        }
    }

    resultElement.innerHTML += `<p>Remaining Funds: ${currency} ${remainingFunds.toFixed(2)}</p>`;
}
