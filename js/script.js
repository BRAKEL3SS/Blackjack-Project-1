/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck()


/*----- app's state (variables) -----*/
let gameDeck = shuffleDeck()
let turn = 1
/*----- cached element references -----*/
/*----- event listeners -----*/
$('.start').click(function() {
    const $gameButton = `<button class="hit">Hit</button><button class ="stay">Stay</button>`
    $(this).remove()
    $('h3').remove()
    $('.buttons').append($gameButton)
    init()
})
$('.restart').click(function() {
    location.reload()
})


/*----- functions -----*/
function init() {
    turn = 1
    createPlayers(2)
    playGame()
}
function playGame() {
    console.log('working')

    deal()
    deal()
    initialRender()
    $('.hit').click(hit)
    $('.stay').click(dealerTurn)
}
function buildMasterDeck() {
    const deck = [];
    suits.forEach(function(suit) {
      ranks.forEach(function(rank) {
        deck.push({
          face: `${suit}${rank}`,
          value: Number(rank) || (rank === 'A' ? 11 : 10)
        });
      });
    });
    return deck;
  } //This function will build our deck and assign values to the cards
function shuffleDeck() {
// Create a copy of the masterDeck
    const tempDeck = [...masterDeck];
    shuffledDeck = [];
    while (tempDeck.length) {
  // Get a random index for a card still in the tempDeck
        const rndIdx = Math.floor(Math.random() * tempDeck.length);
        // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
        shuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
    }
    return shuffledDeck;
} //this will give us a shufled deck to deal cards out of
function deal() { //deals cards to player and dealer
    players.forEach(function(player) {
        const card = gameDeck.pop()
        player.hands.push(card)
        player.points+= card.value
        checkAce()
    })
}
function createPlayers(num) { //creates players for game
    players = [];
    for(let i = 1; i <= num; i++)
    {
        let hand = [];
        let player = { name: 'Player ' + i, id: i, points: 0, hands: hand };
        players.push(player);
    }
}
function initialRender() { //shows initial cards on screen
    players.forEach(function(player, i) {
        const $showCards = `<div class="card card1 ${player.hands[0].face}"></div><div class="card card2 ${player.hands[1].face}"></div>`
        $(`.player${i}`).append($showCards)
    })
    $('.player0 .card1').remove()
    $('.player0').append(`<div class="card back"></div>`)
    

    showScore()

}
function showScore() { //renders score to screen
    const $score = `<h2 id="points">${players[1].points}</h2>`
    $('#points').remove()
    $('.handTotal').append($score)
}

function hit() { //hits card+1 to players[turn]
    const card = gameDeck.pop()
    players[turn].hands.push(card)
    players[turn].points+= card.value

    const $showCard = `<div class="card ${card.face}"></div>`
    $(`.player${turn}`).append($showCard)
    checkAce()
    showScore()
    checkScore()
}
function checkScore() { //checks if player busts
    if (players[1].points > 21) {
        const $bust = `<h1>Player busts, start over!</h1>`
        $('body').append($bust)
        endGame()
    }
}
function dealerTurn() { //logic for dealer after player turn ends
    turn -= 1
    $('.back').remove()
    $('.player0').append(`<div class="card card1 ${players[0].hands[0].face}"></div>`)
    while (players[0].points < 17) {
        hit()
    }
    if (players[0].points > 21) {
        const $bust = `<h1>dealer busts, player wins</h1>`
        $('body').append($bust)
    }
    else if (players[1].points > players[0].points) {
        const $win =`<h1>Player wins!</h1>`
        $('body').append($win)
    }
    else if (players[0].points > players[1].points) {
        const $DWin = `<h1>Dealer wins</h1>`
        $('body').append($DWin)
    }
    else {
        const $push = `<h1>Push! Replay!</h1>`
        $('body').append($push)
    }
    endGame()
}
function endGame() {
    $('.hit').remove()
    $('.stay').remove()
    const $restart = `<button class="restart">Restart</button>`
    $('.buttons').append($restart)
}
function checkAce() {
    players[turn].hands.forEach(function(card) {
        console.log(card.value, players[turn].points)
        if (card.value === 11 && players[turn].points > 21) {
            card.value = 1
            players[turn].points -= 10
        }

    })
}
function replay() {
    $('.restart').click(function() {
        location.reload(true)
    })
}
















//blackjack browser game for one player vs the dealer
//player presses start game button
//game will import the deck of cards
//game will creat 2 players for the game
//game will deal cards to dealer and player, one card at a time, until they both have 2 cards
//player will see both of their cards, one of dealer cards, and one card-back from dealer
//players current card total will be shown
//start button changes to hit/stay buttons
//player can hit or stay as long as card total is less than 22
//once player stays, dealer will auto-complete turn
//if dealer total < 17, dealer hits
//after 17 dealer either stays  or busts
//screen will read out if player wins or loses
//hit/stay buttons turn into restart button
//project will make use of jquery and bootstrap to simplify design and action