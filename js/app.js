// Define values
let openCards = [],
  matchCounter = 0,
  moveCounter = 0,
  tryCounter = 0,
  starRating = 3;

// Get deck class
let deck = document.getElementsByClassName(`deck`);

// Get moves class and set to 0
let moves = document.getElementsByClassName(`moves`);
moves[0].innerHTML = 0;

// Get restart icon
const restart = document.getElementsByClassName(`fa-repeat`);

// Define symbols and create deck
const symbols = [`anchor`, `bicycle`, `bolt`, `bomb`, `cube`, `diamond`, `leaf`, `paper-plane-o`];
const cards = [...symbols, ...symbols];

// Returns a shuffled list of items
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Call buildCongrats() function
buildCongrats();

// Add eventlistener on reset button
restart[0].addEventListener(`click`, reset);

// Call reset function on first load
reset();

// Reset game
function reset() {
  openCards = [];
  matchCounter = 0;
  tryCounter = 0;
  resetCounter();
  resetStars();
  clearDeck(deck);
  let shuffledDeck = shuffle(cards);
  createDeckHTML(shuffledDeck);
  hideCongrats();
}

// Clear deck
function clearDeck(deck) {
  deck[0].remove();
}

// Create deck
function createDeckHTML(deck) {
  const ul = document.createElement(`ul`);
  ul.className = `deck`;
  const container = document.getElementsByClassName(`container`);
  container[0].appendChild(ul);
  for (let i = 0; i < deck.length; i++) {
    const li = document.createElement(`li`);
    li.className = `card`;
    const inner = document.createElement(`i`);
    inner.className = `fa fa-${deck[i]}`;
    ul.appendChild(li);
    li.appendChild(inner);
    li.addEventListener(`click`, processClick);
  }
}

// Process click
function processClick() {
  // Check if user already clicked
  if ((openCards.length < 2) && (!isSameCard(this)) && (!isAlreadyMatched(this))) {
    // Count number of clicks that do not result in a match
    tryCounter++;

    displayCard(this);
    addopenList(this);
    incrementCounter();

    // If two cards are open
    if (openCards.length === 2) {
      // if two open cards match
      if (openCards[0] === openCards[1]) {
        // Reset failed match
        tryCounter = 0;
        lockMatch();
        removeopenList();
        // If all cards matched, display congrats
        if (matchCounter === 16) {
          setTimeout(function () {
            return displayCongrats();
          }, 1000);
        }
      } else { // If two open cards do not match
        setTimeout(function () {
          return hideCards();
        }, 1000);
        // Remove cards from open cards
        setTimeout(function () {
          return removeopenList();
        }, 1000);

        // Lower stars
        if ((moveCounter >= 8) && (tryCounter >= 4) && (starRating > 1)) {
          lowerStars();
        }
      }
    }
  }
}

// Show card
function displayCard(item) {
  item.className = `card open show`;
}

// Hide open cards
function hideCards() {
  let openClass = document.getElementsByClassName(`open`);
  while (openClass.length) {
    openClass[0].className = `card`;
  }
}

// Return true if item is open, else false
function isSameCard(item) {
  const isSame = (item.className === `card open show`) ? true : false;
  return isSame;
}

// Return true if item is matched, else false
function isAlreadyMatched(item) {
  const isAM = (item.className === `card match`) ? true : false;
  return isAM;
}

// Add item to symbols
function addopenList(item) {
  let inner = item.childNodes;
  for (let i = 0; i < inner.length; i++) {
    let symbol = inner[i].className;
    // remove 'fa fa-'
    symbol = symbol.slice(6);
    openCards.push(symbol);
  }
}

// Increase move count by 1
function incrementCounter() {
  moveCounter++;
  moves[0].innerHTML = moveCounter;
}

// Reset moves to 0
function resetCounter() {
  moves[0].innerHTML = moveCounter = 0;
}

// Keep matched cards open
function lockMatch() {
  let faSymbol = `fa-${openCards[0]}`;
  let collection = document.getElementsByClassName(`${faSymbol}`);

  for (let i = 0; i < collection.length; i++) {
    collection[i].parentElement.className = `card match`;
  }
  matchCounter += 2;
}

// Remove items in symbols list
function removeopenList() {
  openCards.pop();
  openCards.pop();
}

// Create and hide congrats div
function buildCongrats() {
  const page = document.getElementsByClassName(`container`);
  const popup = document.createElement(`div`);
  popup.className = `congratsPopup dimmed`;
  popup.innerHTML = ``;
  page[0].appendChild(popup);
}

// Display congrats message
function displayCongrats() {
  const popup = document.getElementsByClassName(`congratsPopup`);
  popup[0].className = `congratsPopup`;
  popup[0].innerHTML =
    `<h2 class="congratsHeading" > Congratulations! </h2>
        <h3 class="congratsTagline" > You've won the game! </h3>
        <p class="congratsMove" > ${moveCounter} moves </p>
        <p class="congratsStar" > ${starRating} stars </p>
        <p class="congratsPlay" > Play Again </p>`;
  const play = document.getElementsByClassName(`congratsPlay`);
  play[0].addEventListener(`click`, reset);
}

// Hide and reset congrats popup
function hideCongrats() {
  const popup = document.getElementsByClassName(`congratsPopup`);
  popup[0].className = `congratsPopup dimmed`;
  popup[0].innerHTML = ``;
}

// Lower star rating by one
function lowerStars() {
  starRating--;
  tryCounter = 0;
  const stars = document.getElementsByClassName(`fa-star`);
  stars[starRating].className = `fa fa-star dimmed`;
}

// Reset rating to 3
function resetStars() {
  starRating = 3;
  const stars = document.getElementsByClassName(`fa-star`);
  for (let i = 0; i < 3; i++) {
    stars[i].className = `fa fa-star`;
  }
}