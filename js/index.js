let funds;
const maxGames = 2;
const games = [];

function calculateBudget() {
    funds = parseFloat(document.getElementById('funds').value);
    for (let i = 0; i < maxGames; i++) {
        games[i] = parseFloat(document.getElementById('game' + (i + 1)).value);
    }

    let remainingFunds = funds;
    for (let i = 0; i < maxGames; i++) {
        remainingFunds -= games[i];
    }

    let resultElement = document.getElementById('result');
    resultElement.innerHTML = '<h2>Result:</h2>';
    resultElement.innerHTML += '<p>Available Funds: $' + funds.toFixed(2) + '</p>';
    for (let i = 0; i < maxGames; i++) {
        resultElement.innerHTML += '<p>Price of Game ' + (i + 1) + ': $' + games[i].toFixed(2) + '</p>';
    }
    resultElement.innerHTML += '<p>Remaining Funds: $' + remainingFunds.toFixed(2) + '</p>';

    // aca esta el con los cuadros de dialogo por si no sirve usar onclick()
    /*
    if (remainingFunds < 0) {
        alert("You don't have enough funds to purchase these games!");
    } else {
        confirm("Would you like to proceed with the purchase?");
    }
    */
}
