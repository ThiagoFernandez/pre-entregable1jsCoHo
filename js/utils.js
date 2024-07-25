// utils.js

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
export function validateDiscount(value) {
    const discount = parseFloat(value);
    return !isNaN(discount) && discount >= 0 && discount <= 100;
}

// Función para guardar resultados en localStorage
export function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Función para recuperar resultados de localStorage
export function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}
