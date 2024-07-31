// Función para mostrar errores
export function showError(message) {
    const resultElement = document.getElementById('error-message');
    if (resultElement) {
        resultElement.innerHTML = `<p class="text-danger">${message}</p>`;
        resultElement.style.display = 'block';
    } else {
        console.error(message); // Si no existe el elemento, muestra el error en la consola
    }
}

// Función para validar números positivos
export function validatePositiveNumber(value) {
    const number = parseFloat(value);
    return !isNaN(number) && number > 0;
}

// Función para validar descuento
export function validateDiscount(discount) {
    const number = parseFloat(discount);
    return !isNaN(number) && number >= 0 && number <= 100;
}

// Función para guardar en el localStorage
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Función para obtener del localStorage
export function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting from localStorage:', error);
        return [];
    }
}

// Función para mostrar el resultado del cálculo
export function displayResult(funds, games, remainingFunds, currency) {
    const resultElement = document.getElementById('result');
    if (!resultElement) return;

    resultElement.innerHTML = '<h2>Result:</h2>';
    resultElement.innerHTML += `<p>Available Funds: ${currency || 'N/A'} ${funds.toFixed(2)}</p>`;

    if (remainingFunds < 0) {
        showError("You don't have enough funds to purchase these games!");
        return; // Salir de la función si no hay suficientes fondos
    }

    games.forEach((game, index) => {
        resultElement.innerHTML += `<p>Price of Game ${index + 1}: ${currency || 'N/A'} ${game.price.toFixed(2)}</p>`;
        if (game.discount) {
            resultElement.innerHTML += '<p>This game has a discount!</p>';
        }
    });

    resultElement.innerHTML += `<p>Remaining Funds: ${currency || 'N/A'} ${remainingFunds.toFixed(2)}</p>`;
}
