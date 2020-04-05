/* File: tp2a.js
 * 
 * Authors: Alexandre Pachot and Eliecer Rodriguez Silva
 * Date: April 22, 2020
 */



// Global variables. See also at the very bottom, at the end of the program.

// In order to have a more easily configurable program
var highlightColor = "lime";
var nbColumns = 5;
var nbRows = 5;
var deckId = nbColumns * nbRows;

// Indicate which element is highlighted
var highlighted = '';

// To know which card is where in order to calculate the points
var gameCards = Array(deckId + 1).fill(-1); 



// Return the html code of an array
var htmlTable = function(inner) {
  return '<table>\n\t<tbody>\n' + inner + '\t</tbody>\n</table>\n';
};



// Return the html code of a row
var htmlTr = function(inner) {
  return '\t\t<tr>\n' + inner + '\t\t</tr>\n';
};



// Return the html code of a cell
var htmlTd = function(id, js, inner) {
  var id = (id === '') ? '' : ' id="' + id + '"';
  var js = (js == '') ? '' : ' ' + js;
  return '\t\t\t<td' + id + js + '>' + inner + '</td>\n';
};



// Return the html code of an onclick cell
var htmlTdOnclick = function(id, inner) {
  return htmlTd(id, 'onclick="clic(' + id + ');"', inner);
};



// Return the html code of an image
var htmlImg = function(img) {
  return '<img src="cards/' + img + '.svg">'
};



// Table on the left (button + cards to be returned)
var htmlDeck = function() {
  
  // New game button
  var button = '<button onclick="init();" style="float: left;">';
  button += 'Nouvelle partie</button';
  
  // Contents of the first row
  var innerTR = htmlTd('', '', button);
  innerTR += htmlTd('', '', '');
  innerTR += htmlTdOnclick(25, htmlImg('back'));
  innerTR += htmlTd('', '', '');
  
  // Contents of the array
  var innerTable = htmlTr(innerTR);
  
  return htmlTable(innerTable);
};



// Table on the right (table nbColumns x nbRows)
var htmlGame = function() {
  
  var innerTable = '';
  
  // The first nbRows rows
  for(var i = 0; i < nbRows; i++) {
    var innerTR = '';
    
    // nbColumns columns of cards
    for(var j = 0; j < nbColumns; j++) {
      innerTR += htmlTdOnclick(nbColumns * i + j, htmlImg('empty'));
    }
    
    // Total column
    innerTR += htmlTd('R' + i, '', '');
    
    innerTable += htmlTr(innerTR);
  }
  
  var innerTR = '';
  
  //Totals row
  for(var j = 0; j < nbColumns; j++) {
    innerTR += htmlTd('C' + j, '', '');
  }
  
  // Big total
  innerTR += htmlTd('T', '', 0);
  
  innerTable += htmlTr(innerTR);
  
  return htmlTable(innerTable);
};



// Generate a random array of numbers from 0 to nbCards
var mixedCard = function(nbCards) {
  
  // Array from 0 to nbCards
  cards = Array(nbCards).fill(0).map( function(card, i) {
    return i;
  });
  
  // Mix the cards
  for(var i = nbCards - 1; i > 0; i--) {
    var temp = cards[i];
    var random = Math.floor(Math.random() * i);
    cards[i] = cards[random];
    cards[random] = temp;
  }
  
  return cards;
};



// Rank of the card
var cardRank = function (cardValue) {
  // The 0 is the ace, so the 1 is the 2.
  if (cardValue > 0 && cardValue < 10) {
    return cardValue + 1;
  }
  
  switch (cardValue) {
    case  0 : return 'A'; // Ace
    case 10 : return 'J'; // Jack
    case 11 : return 'Q'; // Queen
    case 12 : return 'K'; // King
  }
};



// Suit of the card
var cardSuit = function (cardValue) {
  switch (cardValue) {
    case 0 : return 'C'; // Clubs
    case 1 : return 'D'; // Diamonds
    case 2 : return 'H'; // Hearts
    case 3 : return 'S'; // Spades
  }
};



// Rank and suit of the card
var cardValue = function(cardNumber) {
  var rank = cardRank(cardNumber >> 2);
  var suit = cardSuit(cardNumber & 3);
  return rank + suit;
};



// Highlight a card or remove the hight from a card
var highlightSwitch = function(id) {
  var element = document.getElementById(id);
  
  if ( element.style.backgroundColor == highlightColor ) {
    element.style.backgroundColor = "transparent";
    highlighted = '';
  } else {
    element.style.backgroundColor = highlightColor;
    highlighted = id;
  }
  
};



// Check if all cards are from the same suit
var nbCard = function(hand) {
  var nbCard = 0;
  hand.map(function (card) {
    nbCard += (card == -1) ? 0 : 1;
  });
  return nbCard;
};



// Check if all cards are from the same suit
var flush = function(hand) {
  for (var i = 1; i < hand.length; i++) {
    if ( (hand[i-1] & 3) != (hand[i] & 3) ) {
      return false;
    }
  }
  return true;
};



// Check to see if there's an ace. Hand must be sorted.
var hasAce = function(hand) {
  return (hand[0] >> 2 == 0) ? true : false;
};



// Check if the cards are in a sequential (sequential = 1) or
// same (sequential = 0) rank. Hand must be sorted.
var rank = function(hand, sequential) {
  var isSequential = true;
  for (var i = 1; i < hand.length; i++) {
    if ( (hand[i-1] >> 2) + sequential == hand[i] >> 2 ) {
      // The two cards follow each other
      isSequential = isSequential && true;
    } else {
      // The two cards do not follow each other
      isSequential = isSequential && false;
    }
  }
  return isSequential;
};



// Check if we have a royal straight. Hand must be sorted.
var royalStraight = function(hand) {
  if (hasAce(hand)) {
    // We take the ace (the first card), we put it at the end, in order to test
    // if there is a sequence. A copy of the table is made in order not to
    // change the table by reference.
    var aceEnd = hand.slice(1).concat( hand[0] + 52);
    return rank(aceEnd, 1);
  } else {
    return false;
  }
};



// Check if the cards are in a sequential rank, ace at the extremities. Cards
// must be sorted.
var straight = function(hand) {
  var sequential = rank(hand, 1);
  if (sequential == true) {
    // The cards are in sequence
    return true;
  } else {
    return royalStraight(hand);
  }
};



// Check if there are x cards of the same rank. Cards must be sorted. The 
// parameter must not be called hand, otherwise it refers to the full hand.
var xOfAKind = function(x, partHand) {
  var is = false;
  for (var i = 0; i <= partHand.length - x; i++) {
    is = is || rank( partHand.slice(i,i+x), 0 );
  }
  return is;
};



// 
var twoCards = function(hand) {
  var twoCards = Array(4);
  for(i = 0; i < 4; i++) {
    twoCards[i] = hand.slice(i, i+2);
  }
  return twoCards;
};



// 
var twoPair = function(hand) {
  var pair = twoCards(hand);
  var firstTwo = xOfAKind(2, pair[0]) && xOfAKind(2, pair[2]);
  var lastTwo = xOfAKind(2, pair[1]) && xOfAKind(2, pair[3]);
  var twoEnds =  xOfAKind(2, pair[0]) && xOfAKind(2, pair[3]);
  return firstTwo || lastTwo || twoEnds;
};



// 
var onePair = function(hand) {
  var pair = twoCards(hand);
  for(i = 0; i < pair.length; i++) {
    if ( pair[i][0] != -1 && pair[i][1] != -1 && xOfAKind(2, pair[i]) ) {
      return true;
    } 
  }
  return false;
};



// Check if there are four cards of the same rank. Cards must be sorted.
var fullHouse = function(hand) {
  var threeAndTwo = rank( hand.slice(0,3), 0 ) && rank( hand.slice(3), 0 );
  var twoAndThree = rank( hand.slice(0,2), 0 ) && rank( hand.slice(2), 0 );
  return threeAndTwo || twoAndThree;
};



// Calculates the points of a simple array
var points = function(hand) {
  var hand = hand.sort( function (x, y) {
    return x - y;
  });
  switch(nbCard(hand)) {
    case 5 :
      if ( flush(hand) && royalStraight(hand) ) { // Royal Straight Flush
        return 100;
      }
      if ( flush(hand) && straight(hand) ) {      // Straight Flush
        return 75;
      }
      if ( fullHouse(hand) ) {                    // Full House
        return 25;
      }
      if ( flush(hand) ) {                        // Flush
        return 20;
      }
      if ( straight(hand) ) {                     // Straight
        return 15;
      }
    case 4 :
      if ( xOfAKind(4, hand) ) {                  // Four of a kind
        return 50;
      }
      if ( twoPair(hand) ) {                      // Two pair
        return 5;
      }
    case 3 :
      if ( xOfAKind(3, hand) ) {                  // Three of a kind
        return 10;
      }
    case 2 :
      if ( onePair(hand) ) {                      // One pair
        return 2;
      }
    default :
      return 0;
  }
};



// Update game sums
var sumUpdate = function(id, row, sum) {
  switch (id) {
    case 'T':
      document.getElementById(id).innerHTML = sum;
      break;
    default:
      document.getElementById(id + row).innerHTML = (sum == 0) ? '' : sum;
  }
};



// Calculation of points earned
var calculatePoints = function() {
  
  var sum = 0;
  
  // Calculation of the points of each row
  for(var i = 0; i < nbRows; i++) {
    var rowSum = points(gameCards.slice(nbColumns * i, nbColumns * (i+1) ));
    sumUpdate('R', i, rowSum);
    sum += rowSum;
  }
  
  // Calculation of the points of each column
  for(var i = 0; i < nbColumns; i++) {
    var column = Array(nbRows);
    for(var j = 0; j < nbRows; j++) {
      column[j] = gameCards[nbColumns * j + i]
    }
    var columnSum = points(column);
    sumUpdate('C', i, columnSum);
    sum += columnSum;
  }
  
  sumUpdate('T', '', sum);
};



// Moves a card from oldSlot to newSlot (switchCard = false), or switche them
// (switchCard = true)
var saveCards = function(newSlot, oldSlot, switchCard) {
  if (switchCard) {
    var temp = gameCards[newSlot];
    gameCards[newSlot] = gameCards[oldSlot];
    gameCards[oldSlot] = temp;
  } else {
    gameCards[newSlot] = gameCards[oldSlot];
    gameCards[oldSlot] = -1;
  }
  calculatePoints();
}



// We are on the deck, the left table
var deck = function() {
  var element = document.getElementById(deckId);
  
  // If the deck image is the backside image of a card
  if (element.innerHTML == htmlImg('back')) { 

    // We flip the card to get a new card
    var newCard = cards.pop();
    element.innerHTML = htmlImg(cardValue(newCard));
    gameCards[deckId] = newCard;
  }
  
  // If a card from the right is highlighted, the highlight is removed
  if (highlighted !== "" && highlighted < deckId) {
    highlightSwitch(highlighted);
  }
  
  // We switch the highlight of the deck
  highlightSwitch(deckId);
};



// We are on the game, the right table
var game = function(id) {
  var element = document.getElementById(id);
  
  // If there's no card
  if (element.innerHTML == htmlImg('empty')) {

    // And that no card is highlighted
    if (highlighted === "") {
      
      // There's nothing to be done
      return;
    }
    
    // The image of the card is replaced by the image of the card that is
    // highlighted
    element.innerHTML = document.getElementById(highlighted).innerHTML;
    
    // We just moved a card into an empty slot. The card that was highlighted,
    // if it's from the deck, the card underneath is the back of a card.
    // Otherwise, it's an empty slot in the game.
    image = ( highlighted == deckId ) ? 'back' : 'empty';
    
    // We're changing the image of the card that was highlighted
    document.getElementById(highlighted).innerHTML = htmlImg(image);
    
    // We move the card from highlighted to id
    saveCards(id, highlighted, false);
    
    // And we remove the highlight
    highlightSwitch(highlighted);
    
  } else { // There's a card
    
    // Did we clicked on a highlighted card?
    if (element.style.backgroundColor == highlightColor) {
      
      // If that's the case, we remove the highlight from the slot
      highlightSwitch(id);
      
    } else {
      // The slot isn't highlighted
      
      // Is there a slot, elsewhere, that's highlighted?
      if (highlighted === "") {
        
        // No slot is highlighted, we hightlight the slot
        highlightSwitch(id);
        
      } else { // We just clicked on a slot that isn't highlighted and another
        // slot is highlighted. We're switching the two cards.
        
        // If the hightlight was on the deck, we don't switch
        if (highlighted === deckId) {
          
          // We remove the highlight from the deck
          highlightSwitch(deckId);
          
          // We highlight where we are
          highlightSwitch(id);
          
        } else { // Switching the two cards
            var temp = element.innerHTML;
            element.innerHTML = document.getElementById(highlighted).innerHTML;
            document.getElementById(highlighted).innerHTML = temp;
            
            // We switch the two cards
            saveCards(id, highlighted, true);
            
            // We remove the highlight from the old slot
            highlightSwitch(highlighted);
        }
      }
    }
  }
};



/*
https://stackoverflow.com/questions/40724697/javascript-do-something-before-alert
*/
var theEnd = function() {
  var sum = document.getElementById('T').innerHTML;
  if ( cards.length == 52 - deckId) {
    setTimeout(function() {
      alert('Votre pointage final est ' + sum);
      location.reload();
    },100);
  }
};



// Clic dispatcher
var clic = function(id) {
  if ( id === deckId) {
    deck();
  } else {
    game(id);
    theEnd();
  }
};



// Initialization of the page
var init = function() {
  document.getElementById("b").innerHTML = htmlDeck() + htmlGame();
  //for(var i = 0; i < cards.length; i++) console.log(cardValue(cards[i]))
  //console.log(points([0, 1, 2,32]));
};



// Cards to be drawn
var cards = mixedCard(52);

/* Test
cards = Array(27).fill(-1).concat([31,0,40,33,2,35,37,41,49,45,32,36,44,48,0,38,
  42,46,50,34,39,43,47,51,3]);
//*/
