/*
 * Create a list that holds all of your cards
 */

let cardsList = ['fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-cube', 'fa fa-anchor', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-diamond', 'fa fa-bomb', 'fa fa-leaf', 'fa fa-bomb', 'fa fa-bolt', 'fa fa-bicycle', 'fa fa-paper-plane-o', 'fa fa-cube'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Shuffle the list of cards
 */
cardsList = shuffle(cardsList);

/*
 * Create HTML by looping through each card and add the HTML to the page
 */
cardsList.forEach(element => {
	document.querySelector('.deck').insertAdjacentHTML('afterbegin', '<li class="card"><i class="' + element + '"></i></li>');
})

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)

 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
 * Create the following variables for setting up the event listener
 */
const cards = document.querySelectorAll('.card');
let openedCards = [];
let clickDisabled = false;

/*
 * Create the following variables for setting up the counters of move, score and time
 */
let move = 0;
let score = 100;
let seconds = 0;
const stars = document.querySelector('.stars');

/*
 * Set up the restart button
 * Once users click on the "fa fa-repeat" icon, the page will refresh and the game will restart
 */
const restarter = document.querySelector('.restart').firstElementChild;
const restarterAtt = restarter.setAttribute('onclick', 'restartFunction()');
function restartFunction() {
	location.reload();
};

/*
 * Set up the event listener on each card
 * Once users click on one of the cards, i.e. the event of 'click' happends, the card will be displayed
 */

cards.forEach(function(card) {
	card.addEventListener('click', function() {
		/*
		 * clickDisabled is used for blocking the bug that double click on the same card would result in matching outcome
		 * Also, if the cards are displayed or matched, i.e. they are under the classes of 'open', 'show', 'match', the event listener will ignore the clicks on those classes without executing the functions below
		 */
		if (clickDisabled || card.classList.contains('open') || card.classList.contains('show') || card.classList.contains('match')){
			return;
		}
		/*
		 * Since the game only allows players to flip two cards at a time, cards can be displayed when the number of opened cards is below two:
		 * If the number of opened cards is lower than two, than the card that's clicked will be displayed and the array of openedCards will store it for the moment
		 * Once a card is displayed, the number of moves will be increased
		 */
		if (openedCards.length < 2) {
			card.classList.add('open', 'show');
			openedCards.push(card);
			move += 1;
			moveCounter = document.querySelector('.moves');
			moveCounter.textContent = move;
			if (move == 1) {
				setInterval(function() {
					seconds ++;
					document.getElementById("seconds").innerText = seconds % 60;
					document.getElementById("minutes").innerText = parseInt(seconds / 60);
					}, 1000);
			}
			/* 
			 * Once the first card is clicked and displayed, the timer will start counting
			 */
			if (move == 32 | move == 64 | move == 96 | move == 128) {
				let oneStar = stars.firstElementChild;
				stars.removeChild(oneStar);
				score -= 20;
			}
			/*
			 * Once the number of moves reaches a number of points, scores and stars will be deducted
			 */
		}
		
		if (openedCards.length == 2) {
			if(openedCards[0].firstElementChild.classList.value == openedCards[1].firstElementChild.classList.value) {
				let firstClass = openedCards[0].firstElementChild.classList[0];
				let secondClass = openedCards[0].firstElementChild.classList[1];
				document.querySelectorAll('.' + firstClass + '.' + secondClass).forEach(function(element) {
						element.parentElement.classList.add('match');
					})
				openedCards = [];
			} else {
				let firstCardFirstClass = openedCards[0].firstElementChild.classList[0];
				let firstCardSecondClass = openedCards[0].firstElementChild.classList[1];
				let secondCardFirstClass = openedCards[1].firstElementChild.classList[0];
				let secondCardSecondClass = openedCards[1].firstElementChild.classList[1];
				openedCards = [];
				clickDisabled = true;
				setTimeout(function() {
					document.querySelectorAll('.' + firstCardFirstClass + '.' + firstCardSecondClass).forEach(function(element) {
						element.parentElement.classList.remove('open', 'show');
					})
					document.querySelectorAll('.' + secondCardFirstClass + '.' + secondCardSecondClass).forEach(function(element) {
						element.parentElement.classList.remove('open', 'show');
					})
					clickDisabled = false;
				}, 1000);
			};	
		};
		/*
		 * Once two cards are displayed, they will be checked whether they are matched
		 * If they match, i.e. the value of their classes are the same, then the 'match' class is added, and thus showing that they are matched
		 * If they don't match, i.e. the values of their classes are different, then the two cards will be flipped face down by removing their classes of 'open' and 'show'
		 * Regardless of whether they match or not, the array of openedCards will be empty, openedCards.length < 2, so that it allows players to flip cards again
		 * clickDisabled is turn on for the purpose of blocking more than two clicks when players click fast
		 * setTimeout is set up, so that it allows players to see that the cards are not matched, and the cards will be flipped face down after 1 second
		 */

		if (document.querySelectorAll('.match').length == 16) {
			setTimeout(function() {
				if (window.confirm('You won the game!\nYou used ' + document.getElementById('minutes').innerText + ' minute(s) ' + document.getElementById('seconds').innerText + ' second(s).\nYour score is ' + score + ' and your star rating is ' + document.querySelector('.stars').childElementCount + '. Congratulations!\nDo you want to play again?')) {
					location.reload();
				};
			}, 1000);
		};
		/*
		 * Once all cards are matched, i.e. the number of cards that contain the class of 'match' is equal to 16, a pop-up window will be displayed after a second, and it tells players that they've won the game and how many scores and stars they get, and it invites players to play again if they click on 'OK' button on the pop-up window
		 * Once the 'OK' button is clicked, the game page will be reloaded, and scores, stars, moves and time will be recounted
		 */
	});
});
