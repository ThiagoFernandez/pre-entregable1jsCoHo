let funds;
const maxGames = 2;
const games = [];

function calculateBudget() {
    funds = parseFloat(document.getElementById('funds').value);
    for (let i = 0; i < maxGames; i++) {
        let gamePrice = parseFloat(document.getElementById('game' + (i + 1) + '_price').value);
        let hasDiscount = document.getElementById('game' + (i + 1) + '_discount').checked;
        let discount = parseFloat(document.getElementById('game' + (i + 1) + '_discount_value').value);

        if (hasDiscount) {
            gamePrice -= (gamePrice * (discount / 100)); 
        }

        games[i] = {
            price: gamePrice,
            discount: hasDiscount
        };
    }

    let remainingFunds = funds;
    for (let i = 0; i < maxGames; i++) {
        remainingFunds -= games[i].price;
    }

    let resultElement = document.getElementById('result');
    resultElement.innerHTML = '<h2>Result:</h2>';
    resultElement.innerHTML += '<p>Available Funds: $' + funds.toFixed(2) + '</p>';
    for (let i = 0; i < maxGames; i++) {
        resultElement.innerHTML += '<p>Price of Game ' + (i + 1) + ': $' + games[i].price.toFixed(2) + '</p>';
        if (games[i].discount) {
            resultElement.innerHTML += '<p>This game has a discount!</p>';
        }
    }
    resultElement.innerHTML += '<p>Remaining Funds: $' + remainingFunds.toFixed(2) + '</p>';

    if (remainingFunds < 0) {
        alert("You don't have enough funds to purchase these games(broke ass lmao)");
    }

    // aca un poco de cuadros de dialogo._.
    /*
    if (remainingFunds < 0) {
        alert("You don't have enough funds to purchase these games!");
    } else {
        confirm("Would you like to proceed with the purchase?");
    }
    */
}


function clearResults() {
    document.getElementById('result').innerHTML = '';
}
