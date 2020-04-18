/* File: tp2a.js
 *
 * Authors: Jeanne Laflamme and Alexandre Pachot
 * Date: April 22, 2020
 *
 * List of functions
 * htmlTable      : return the html code of a table
 * htmlTr         : return the html code of a table row
 * htmlTd         : return the html code of a table cell
 * htmlTdOnclick  : return the html code of an onclick table cell
 * htmlImg        : return the html code of an image
 * htmlDeck       : return the html code of the table containing the deck
 * htmlGame       : return the html code of the table containing the cards of
 *                  the game
 * mixedCard      : generate a random array of numbers from 0 to nbCards
 * cardRank       : return the rank of the card
 * cardSuit       : return the suit of the card
 * cardValue      : return the rank and suit of the card
 * highlightSwitch: highlight a card or remove the hight from a card
 * nbCard         : return the number of cards in the hand
 * flush          : check if all cards are from the same suit
 * hasAce         : check if there's an ace
 * rank           : check if the cards are in a sequential or same rank
 * royalStraight  : check if we have a royal straight
 * straight       : check if the cards are in a sequential rank, aces can be at
 *                  the extremities
 * xOfAKind       : check if there are x cards of the same rank
 * twoCards       : return combinations of two cards that follow each other
 * twoPair        : check if there is two pairs of cards
 * onePair        : check if there is a pair of cards
 * fullHouse      : check if there are four cards of the same rank
 * points         : calculate the points of the hand
 * sumUpdate      : update game sums
 * calculatePoints: calculate points earned
 * saveCards      : move a card from a slot to another slot, or switch them
 * deck           : deck click management
 * game           : game click management
 * theEnd         : the game's over
 * clic           : clic dispatcher
 * init           : initialization of the page
 */


// Global variables. See also at the very bottom, at the end of the program.

// In order to have a more easily configurable program. The number of columns
// and rows can be reduced, the program works.  When the number of columns or
// rows is increased, there are bugs. To correct this, the functions that
// calculate the number of points should be made more complex.
var highlightColor = "lime";
var nbColumns = 5;
var nbRows = 5;
var deckId = nbColumns * nbRows;

// Indicate which element is highlighted
var highlighted = '';

// To know which card is where in order to calculate the points
var gameCards = Array(deckId + 1).fill(52);


/* Return the html code of a table
 *
 * content (string): HTML content between the two tags
 *
 * output (string) : HTML code of the table
 */
var htmlTable = function(content) {
  return '<table>\n\t<tbody>\n' + content + '\t</tbody>\n</table>\n';
};

var testHtmlTable = function() {
  var f = "htmlTable();";

  var t = "empty content"
  console.assert( htmlTable('') ==
    "<table>\n" +
    "\t<tbody>\n" +
    "\t</tbody>\n" +
    "</table>\n", f, t);

  t = "space, tab and newline"
  console.assert( htmlTable(' \t\n') ==
    "<table>\n" +
    "\t<tbody>\n" +
    " \t\n" +
    "\t</tbody>\n" +
    "</table>\n", f, t);
  }
  
  t = "Hello, World!"

//console.log(htmlTable('   '));


// Return the html code of a table row
var htmlTr = function(inner) {
  return '\t\t<tr>\n' + inner + '\t\t</tr>\n';
};


// Return the html code of a table cell
var htmlTd = function(id, js, inner) {
  var id = (id === '') ? '' : ' id="' + id + '"';
  var js = (js == '') ? '' : ' ' + js;
  return '\t\t\t<td' + id + js + '>' + inner + '</td>\n';
};


// Return the html code of an onclick table cell
var htmlTdOnclick = function(id, inner) {
  return htmlTd(id, 'onclick="clic(' + id + ');"', inner);
};


// Return the html code of an image
var htmlImg = function(img) {
  return '<img src="cards/' + img + '.svg">'
};


// Return the html code of the table containing the deck
var htmlDeck = function() {

  // New game button
  var button = '<button onclick="init();" style="float: left;">';
  button += 'Nouvelle partie</button';

  // Contents of the first row
  var innerTR = htmlTd('', '', button);
  innerTR += htmlTd('', '', '');
  innerTR += htmlTdOnclick(deckId, htmlImg('back'));
  innerTR += htmlTd('', '', '');

  // Contents of the array
  var innerTable = htmlTr(innerTR);

  return htmlTable(innerTable);
};


// Return the html code of the table containing the cards of the game
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


// This function takes an integer n >= 1 and returns a random integer m
// such that 0 <= m < n

var random = function(n) {

    return Math.floor(Math.random()*n);
    
};

// This function returns an array containing the numbers from 0 to 51 in
// a random order

var shuffle = function() {

    var deck = Array(52).fill(0).map(function(x,i) { return i; });

    for(var i = 51; i > 0; i--) {

	var j = random(i); // index of the next card to be switched
	
	var t = deck[j];
	deck[j] = deck[i];
	deck[i] = t;
	
    }

    return deck;
    
};


// This function takes an integer between 0 and 51  which represents a card
// and returns the rank of the card

var cardRank = function (cardNum) {

  switch (cardNum >> 2) {
    case  0 : return 'A'; // Ace
    case 10 : return 'J'; // Jack
    case 11 : return 'Q'; // Queen
    case 12 : return 'K'; // King
    default: return (cardNum >> 2) + 1;
  }
  
};


// This function takes an integer between 0 and 51  which represents a card
// and returns the first letter of the card's suit

var cardSuit = function (cardNum) {
    
  switch (cardNum & 3) {
    case 0 : return 'C'; // Clubs
    case 1 : return 'D'; // Diamonds
    case 2 : return 'H'; // Hearts
    case 3 : return 'S'; // Spades
  }
  
};


// This function takes an integer between 0 and 51  which represents a card
// and returns the rank of the card followed by the first letter of its suit

var cardValue = function(cardNum) {
    
  var rank = cardRank(cardNum);
  var suit = cardSuit(cardNum);
  
  return rank + suit;
  
};

// Unit tests

var testCardValue = function() {
    
    assert(cardValue(0) == "AC");
    assert(cardValue(51) == "KS");
    assert(cardValue(45) == "QD");
    assert(cardValue(42) == "JH");
    assert(cardValue(16) == "5C");
    assert(cardValue(25) == "7D");
    assert(cardValue(38) == "10H");
    assert(cardValue(7) == "2S");
    
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


// This function takes an array of 5 numbers between 0 and 52 (hand) where
// the numbers between 0 and 51 represent cards and 52 represents a missing
// card and returns the number of cards in the hand

var nbCard = function(hand) {
    
  var nbCard = 0;
  
  hand.map(function (card) { nbCard += (card == 52) ? 0 : 1; });
  
  return nbCard;
};


// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card. It returns true if the hand contains an ace and false otherwise

var hasAce = function(hand) {
    
  return (hand[0] >> 2 == 0) ? true : false;
  
};

// This function takes an array of 5 numbers between 0 and 52 (hand) where
// the numbers between 0 and 51 represent cards and 52 represents an empty
// card. It returns true if all cards are from the same suit and false
// otherwise

var flush = function(hand) {
    
  for (var i = 1; i < hand.length; i++) {
      
    if ( ((hand[i-1] & 3) != (hand[i] & 3)) || hand[i] == 52 ) {
        
      return false;
      
    }
  }
  
  return true;
};


// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card and a binary value (seq).  If seq = 0, it returns true if and
// only if all the cards in the hand have the same rank. If seq = 1, it
// returns true if and only if the cards are in a sequential order.

var rank = function(cards, seq) {
    
  if(cards[cards.length - 1] == 52) return false;
    
  for (var i = 1; i < cards.length; i++) {
      
    if ( (cards[i-1] >> 2) + seq != cards[i] >> 2 ) {
        
      return false;
      
    } 
  }
  
  return true;
};


// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card. It returns true if the hand is a royal straight false otherwise

var royalStraight = function(hand) {
  
    if (hand[0]>>2 != 0 || hand[1]>>2 != 9) return false;

    return rank(hand.slice(1,5),1);
};


// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card and an integer x >= 1. returns true if and
// only if the hand contains x cards of the same rank

var xOfAKind = function(hand,x) {
    
  for (var i = 0; i <= hand.length - x; i++) {
      
    var partHand = hand.slice(i,i+x); 
    
  	if(rank(partHand, 0 ) && partHand[0] != 52) return true;
    
  }
  
  return false;
};


// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card. It returns an array of arrays of length 2 containing the cards 
// that follow each other: cards 0 and 1, cards 1 and 2...

var twoCards = function(hand) {
    
  var twoCards = Array(4);
  
  for(var i = 0; i < 4; i++) {
      
    twoCards[i] = hand.slice(i, i+2);
    
  }
  
  return twoCards;
};


// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card. It returns true if the hand contains two pairs of cards with
// the same rank and false otherwise

var twoPair = function(hand) {
    
  var pair = twoCards(hand);
  
  var firstTwo = rank(pair[0],0) && rank(pair[2],0);
  var lastTwo  = rank(pair[1],0) && rank(pair[3],0);
  var twoEnds  = rank(pair[0],0) && rank(pair[3],0);
  
  return firstTwo || lastTwo || twoEnds;
};



// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card. It returns true if the hand is a fullHouse and false otherwise

var fullHouse = function(hand) {
    
  var threeAndTwo = rank( hand.slice(0,3), 0 ) && rank( hand.slice(3), 0 );
  var twoAndThree = rank( hand.slice(0,2), 0 ) && rank( hand.slice(2), 0 );
  
  return threeAndTwo || twoAndThree;
};


// This function takes a sorted array of 5 numbers between 0 and 52 (hand)
// where the numbers between 0 and 51 represent cards and 52 represents an
// empty card. It returns the number of points of the hand

var points = function(hand) {
    
  // Sort hand in numerical order
  
  var hand = hand.sort( function (x, y) { return x - y; }); 

  switch(nbCard(hand)) {
    case 5 :
      if ( flush(hand) && royalStraight(hand) ) {   // Royal Straight Flush
        return 100;
      }
      if ( flush(hand) && rank(hand,1) ) {          // Straight Flush
        return 75;
      }
      if ( fullHouse(hand) ) {                      // Full House
        return 25;
      }
      if ( flush(hand) ) {                          // Flush
        return 20;
      }
      if ( rank(hand,1) || royalStraight(hand) ) {  // Straight
        return 15;
      }
    case 4 :
      if ( xOfAKind(hand,4) ) {                     // Four of a kind
        return 50;
      }
      if ( twoPair(hand) ) {                        // Two pair
        return 5;
      }
    case 3 :
      if ( xOfAKind(hand,3) ) {                     // Three of a kind
        return 10;
      }
    case 2 :
      if ( xOfAKind(hand,2) ) {                     // One pair
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


// Calculate points earned
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


// Move a card from oldSlot to newSlot (switchCard = false), or switch them
// (switchCard = true)
var saveCards = function(newSlot, oldSlot, switchCard) {
  if (switchCard) {
    var temp = gameCards[newSlot];
    gameCards[newSlot] = gameCards[oldSlot];
    gameCards[oldSlot] = temp;
  } else {
    gameCards[newSlot] = gameCards[oldSlot];
    gameCards[oldSlot] = 52;
  }
  calculatePoints();
}


// Deck click management
var deck = function() {
  var element = document.getElementById(deckId);

  // If the deck image is the backside image of a card
  if (element.innerHTML == htmlImg('back')) {

    // We flip the card to get a new card
    var newCard = deckCards.pop();
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


// Game click management
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


/* The game's over
https://stackoverflow.com/questions/40724697/javascript-do-something-before-alert
https://stackoverflow.com/questions/33955650/what-is-settimeout-doing-when-set-to-0-milliseconds
*/
var theEnd = function() {
  var element = document.getElementById(deckId);
  if ( deckCards.length == 52 - deckId && element.innerHTML == htmlImg('back')) {
    var sum = document.getElementById('T').innerHTML;
    setTimeout(function() {
      alert('Votre pointage final est ' + sum);
      location.reload();
    },0);
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
};


// Unit tests
var unitTests = function() {
  testHtmlTable();
}


unitTests();


// Cards to be drawn
var deckCards = shuffle();

/* Test
deckCards = Array(27).fill(52).concat([31,0,40,33,2,35,37,41,49,45,32,36,44,48,
  0,38,42,46,50,34,39,43,47,51,3]);
//*/
