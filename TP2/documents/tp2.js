/* File: tp2a.js
 *
 * Authors: Jeanne Laflamme and Alexandre Pachot
 * Date: April 22, 2020
 *
 * List of functions
 * htmlTable      : return the HTML code of a table
 * htmlTr         : return the HTML code of a tr
 * htmlTd         : return the HTML code of a td
 * htmlTdOnclick  : return the HTML code of a td with onclick javascript
 * htmlImg        : return the HTML code of an image
 * htmlDeck       : return the HTML code of the table containing the deck
 * htmlGame       : return the HTML code of the table containing the cards of
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
 * fullHouse      : Check if there are three cards of one rank and two cards of
 *                  another rank.
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
var highlightColor = 'lime';
var nbColumns = 5;
var nbRows = 5;
var deckId = nbColumns * nbRows;

// Indicate which element is highlighted
var highlighted = '';

// To know which card is where in order to calculate the points
var gameCards = Array(deckId + 1).fill(-1);


/* Return the HTML code of a table
 *
 * content (string): HTML content between the two table tags
 *
 * output (string) : HTML code of the table
 */
var htmlTable = function(content) {
  return '<table>\n\t<tbody>\n' + content + '\t</tbody>\n</table>\n';
};

// htmlTable unit tests
var testHtmlTable = function() {
  var f = 'htmlTable() with';

  var t = 'empty content'
  console.assert( htmlTable('') ==
    '<table>\n' +
    '\t<tbody>\n' +
    '\t</tbody>\n' +
    '</table>\n', f, t);

  t = 'space, tab and newline'
  console.assert( htmlTable(' \t\n') ==
    '<table>\n' +
    '\t<tbody>\n' +
    ' \t\n' +
    '\t</tbody>\n' +
    '</table>\n', f, t);

  t = 'w3schools example'
  var tableContent = '    <tr>\n';
  tableContent += '      <td>January</td>\n';
  tableContent += '      <td>$100</td>\n';
  tableContent += '    </tr>\n';
  tableContent += '    <tr>\n';
  tableContent += '      <td>February</td>\n';
  tableContent += '      <td>$80</td>\n';
  tableContent += '    </tr>\n';
  console.assert( htmlTable(tableContent) ==
    '<table>\n' +
    '\t<tbody>\n' +
    '    <tr>\n' +
    '      <td>January</td>\n' +
    '      <td>$100</td>\n' +
    '    </tr>\n' +
    '    <tr>\n' +
    '      <td>February</td>\n' +
    '      <td>$80</td>\n' +
    '    </tr>\n' +
    '\t</tbody>\n' +
    '</table>\n', f, t);

  t = 'a number';
  console.assert( htmlTable(0) ==
    '<table>\n' +
    '\t<tbody>\n' +
    '0' +
    '\t</tbody>\n' +
    '</table>\n', f, t);

  t = 'a boolean';
  console.assert( htmlTable(false) ==
    '<table>\n' +
    '\t<tbody>\n' +
    'false' +
    '\t</tbody>\n' +
    '</table>\n', f, t);
}


/* Return the html code of a tr
 *
 * inner (string): inner HTML of the tr tag
 *
 * output (string) : tr tag + inner HTML
 */
var htmlTr = function(inner) {
  return '\t\t<tr>\n' + inner + '\t\t</tr>\n';
};

// htmlTr unit tests
var testHtmTr = function() {
  var f = 'htmlTr() with';

  var t = 'empty content'
  console.assert( htmlTr('') ==
    '\t\t<tr>\n' +
    '\t\t</tr>\n', f, t);

  t = 'space, tab and newline'
  console.assert( htmlTr(' \t\n') ==
    '\t\t<tr>\n' +
    ' \t\n' +
    '\t\t</tr>\n', f, t);

  t = 'w3schools example'
  var tableContent = '  <th>Month</th>\n';
  tableContent += '  <th>Savings</th>\n';
  console.assert( htmlTr(tableContent) ==
    '\t\t<tr>\n' +
    '  <th>Month</th>\n' +
    '  <th>Savings</th>\n' +
    '\t\t</tr>\n', f, t);

  t = 'a number';
  console.assert( htmlTr(0) ==
    '\t\t<tr>\n' +
    '0' +
    '\t\t</tr>\n', f, t);

  t = 'a boolean';
  console.assert( htmlTr(false) ==
    '\t\t<tr>\n' +
    'false' +
    '\t\t</tr>\n', f, t);
}

/* Return the HTML code of a td tag
 *
 * id (string): id of the td tag
 * js (string): javascript code of the td tag
 * inner (string): inner HTML of the td tag
 *
 * output (string) : td tag + inner HTML
 */
var htmlTd = function(id, js, inner) {
  var id = (id === '') ? '' : ' id="' + id + '"';
  var js = (js === '') ? '' : ' ' + js;
  return '\t\t\t<td' + id + js + '>' + inner + '</td>\n';
};

// htmlTd unit tests
var testHtmTd = function() {
  var f = 'htmlTd() with';

  var t = 'empty content'
  console.assert( htmlTd('', '', '') ==
    '\t\t\t<td></td>\n', f, t);

  t = 'space, tab and newline'
  console.assert( htmlTd(' \t\n', ' \t\n', ' \t\n') ==
    '\t\t\t<td id=" \t\n"  \t\n> \t\n</td>\n', f, t);

  t = 'id, js and inner'
  console.assert( htmlTd(0, 'onclick="clic(0);"', '<img src="cards/empty.svg">')
    == '\t\t\t<td id="0" onclick="clic(0);"><img src="cards/empty.svg">' +
      '</td>\n', f, t);

  t = 'numbers';
  console.assert( htmlTd(0, 1, 2) ==
    '\t\t\t<td id="0" 1>2</td>\n', f, t);

  t = 'booleans';
  console.assert( htmlTd(false, false, false) ==
    '\t\t\t<td id="false" false>false</td>\n', f, t);
}


/* Return the HTML code of a td with onclick javascript
 *
 * id (string): id of the td tag
 * inner (string): inner HTML of the td tag
 *
 * output (string) : the td tag with onclick javascript + inner HTML
 */
var htmlTdOnclick = function(id, inner) {
  return htmlTd(id, 'onclick="clic(' + id + ');"', inner);
};

// htmlTdOnclick unit tests
var testHtmlTdOnclick  = function() {
  var f = 'htmlTdOnclick() with';

  var t = 'empty content'
  console.assert( htmlTdOnclick('', '') ==
    '\t\t\t<td onclick="clic();"></td>\n', f, t);

  t = 'space, tab and newline'
  console.assert( htmlTdOnclick(' \t\n', ' \t\n') ==
    '\t\t\t<td id=" \t\n" onclick="clic( \t\n);"> \t\n</td>\n', f, t);

  t = 'id and inner'
  console.assert( htmlTdOnclick(0, '<img src="cards/empty.svg">')
    == '\t\t\t<td id="0" onclick="clic(0);"><img src="cards/empty.svg">' +
      '</td>\n', f, t);

  t = 'numbers';
    console.assert( htmlTdOnclick(0, 1) ==
    '\t\t\t<td id="0" onclick="clic(0);">1</td>\n', f, t);

  t = 'booleans';
  console.assert( htmlTdOnclick(false, false) ==
    '\t\t\t<td id="false" onclick="clic(false);">false</td>\n', f, t);
}


/* Return the HTML code of an image
 *
 * img (string): image name, without extension
 *
 * output (string) : HTML code of the image
 */
var htmlImg = function(img) {
  return '<img src="cards/' + img + '.svg">'
};

// htmlImg unit tests
var testHtmlImg  = function() {
  var f = 'htmlImg() with';

  var t = 'empty content'
  console.assert( htmlImg('') ==
    '<img src="cards/.svg">', f, t);

  t = 'space, tab and newline'
  console.assert( htmlImg(' \t\n') ==
  '<img src="cards/ \t\n.svg">', f, t);

  t = 'an image name'
  console.assert( htmlImg('empty')
    == '<img src="cards/empty.svg">', f, t);

  t = 'number';
  console.assert( htmlImg(0) ==
    '<img src="cards/0.svg">', f, t);

  t = 'boolean';
  console.assert( htmlImg(false) ==
    '<img src="cards/false.svg">', f, t);
}


/* Return the HTML code of the table containing the deck
 *
 * output (string) : HTML code of the table containing the deck
 */
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

// htmlDeck unit tests
var testHtmlDeck  = function() {
  var f = 'htmlDeck() with';

  var t = 'no parameters'
  console.assert( htmlDeck() ==
    '<table>\n' +
    '\t<tbody>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td><button onclick="init();" style="float: left;">' +
      'Nouvelle partie</button</td>\n' +
    '\t\t\t<td></td>\n' +
    '\t\t\t<td id="25" onclick="clic(25);">' +
      '<img src="cards/back.svg"></td>\n' +
    '\t\t\t<td></td>\n' +
    '\t\t</tr>\n' +
    '\t</tbody>\n' +
    '</table>\n', f, t);
}

/* Return the HTML code of the table containing the cards of the game
 *
 * output (string) : HTML code of the table containing the cards of the game
 */
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


// htmlDeck unit tests
var testHtmlGame  = function() {
  var f = 'htmlGame() with';

  var t = 'no parameters'
  console.assert( htmlGame() ==
    '<table>\n' +
    '\t<tbody>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td id="0" onclick="clic(0);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="1" onclick="clic(1);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="2" onclick="clic(2);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="3" onclick="clic(3);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="4" onclick="clic(4);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="R0"></td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td id="5" onclick="clic(5);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="6" onclick="clic(6);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="7" onclick="clic(7);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="8" onclick="clic(8);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="9" onclick="clic(9);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="R1"></td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td id="10" onclick="clic(10);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="11" onclick="clic(11);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="12" onclick="clic(12);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="13" onclick="clic(13);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="14" onclick="clic(14);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="R2"></td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td id="15" onclick="clic(15);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="16" onclick="clic(16);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="17" onclick="clic(17);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="18" onclick="clic(18);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="19" onclick="clic(19);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="R3"></td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td id="20" onclick="clic(20);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="21" onclick="clic(21);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="22" onclick="clic(22);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="23" onclick="clic(23);">' +
      '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="24" onclick="clic(24);">' +
     '<img src="cards/empty.svg"></td>\n' +
    '\t\t\t<td id="R4"></td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td id="C0"></td>\n' +
    '\t\t\t<td id="C1"></td>\n' +
    '\t\t\t<td id="C2"></td>\n' +
    '\t\t\t<td id="C3"></td>\n' +
    '\t\t\t<td id="C4"></td>\n' +
    '\t\t\t<td id="T">0</td>\n' +
    '\t\t</tr>\n' +
    '\t</tbody>\n' +
    '</table>\n', f, t);
}


// Generate a random array of numbers from 0 to nbCards
var mixedCard = function(nbCards) {

  // Array from 0 to nbCards
  var cards = Array(nbCards).fill(0).map( function(card, i) {
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


// Return the rank of the card
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


// Return the suit of the card
var cardSuit = function (cardValue) {
  switch (cardValue) {
    case 0 : return 'C'; // Clubs
    case 1 : return 'D'; // Diamonds
    case 2 : return 'H'; // Hearts
    case 3 : return 'S'; // Spades
  }
};


// Return the rank and suit of the card
var cardValue = function(cardNumber) {
  var rank = cardRank(cardNumber >> 2);
  var suit = cardSuit(cardNumber & 3);
  return rank + suit;
};


// Highlight a card or remove the hight from a card
var highlightSwitch = function(id) {
  var element = document.getElementById(id);

  if ( element.style.backgroundColor == highlightColor ) {
    element.style.backgroundColor = 'transparent';
    highlighted = '';
  } else {
    element.style.backgroundColor = highlightColor;
    highlighted = id;
  }

};


// Return the number of cards in the hand
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


// Check if there's an ace. Hand must be sorted
var hasAce = function(hand) {
  return (hand[0] >> 2 == 0) ? true : false;
};


// Check if the cards are in a sequential (sequential = 1) or
// same (sequential = 0) rank. Hand must be sorted
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


// Check if the cards are in a sequential rank, aces can be at the extremities.
// Cards must be sorted.
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


// Return combinations of two cards that follow each other: cards 0 and 1,
// cards 1 and 2...
var twoCards = function(hand) {
  var twoCards = Array(4);
  for(var i = 0; i < 4; i++) {
    twoCards[i] = hand.slice(i, i+2);
  }
  return twoCards;
};


// Check if there is two pairs of cards in the hand. Cards must be sorted.
var twoPair = function(hand) {
  var pair = twoCards(hand);
  var firstTwo = xOfAKind(2, pair[0]) && xOfAKind(2, pair[2]);
  var lastTwo  = xOfAKind(2, pair[1]) && xOfAKind(2, pair[3]);
  var twoEnds  = xOfAKind(2, pair[0]) && xOfAKind(2, pair[3]);
  return firstTwo || lastTwo || twoEnds;
};


// Check if there is a pair of cards in the hand. Cards must be sorted.
var onePair = function(hand) {
  var pair = twoCards(hand);
  for(var i = 0; i < pair.length; i++) {
    // Flipped cards (-1) are not considered, otherwise [-1, -1] is considered
    // to be as a peer.
    if ( pair[i][0] != -1 && pair[i][1] != -1 && xOfAKind(2, pair[i]) ) {
      return true;
    }
  }
  return false;
};


// Check if there are three cards of one rank and two cards of another rank.
// Cards must be sorted.
var fullHouse = function(hand) {
  var threeAndTwo = rank( hand.slice(0,3), 0 ) && rank( hand.slice(3), 0 );
  var twoAndThree = rank( hand.slice(0,2), 0 ) && rank( hand.slice(2), 0 );
  return threeAndTwo || twoAndThree;
};


// Calculate the points of the hand
var points = function(hand) {
  // By default, the sort() function sorts in ASCII order. To sort in numerical
  // order, you must define the sort function
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
    gameCards[oldSlot] = -1;
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
  if (highlighted !== '' && highlighted < deckId) {
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
    if (highlighted === '') {

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
      if (highlighted === '') {

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
      init();
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
  document.getElementById('b').innerHTML = htmlDeck() + htmlGame();
};


// Global unit tests
var unitTests = function() {
  testHtmlTable();
  testHtmTr();
  testHtmTd();
  testHtmlTdOnclick();
  testHtmlImg();
  testHtmlDeck();
  testHtmlGame();
}


unitTests();


// Cards to be drawn
var deckCards = mixedCard(52);

/* Test
deckCards = Array(27).fill(-1).concat([31,0,40,33,2,35,37,41,49,45,32,36,44,48,
  0,38,42,46,50,34,39,43,47,51,3]);
//*/
