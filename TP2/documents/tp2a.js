/* File: tp2a.js
 * 
 * Authors: Alexandre Pachot and Eliecer Rodriguez Silva
 * Date: April 22, 2020
 */




// Global variables. See also at the very bottom, at the end of the program.

// In order to have a more easily configurable program
var highlightColor = "lime";
var transparent = "rgba(191, 255, 0, 0)"; // any color (lime) + opacity = 0
var nbColumns = 5;
var nbLines = 5;
var deckId = nbColumns * nbLines;

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
  
  // Contents of the first line
  var innerTR = htmlTd('', '', button);
  innerTR += htmlTd('', '', '');
  innerTR += htmlTdOnclick(25, htmlImg('back'));
  innerTR += htmlTd('', '', '');
  
  // Contents of the array
  var innerTable = htmlTr(innerTR);
  
  return htmlTable(innerTable);
};




// Table on the right (table nbColumns x nbLines)
var htmlGame = function() {
  
  var innerTable = '';
  
  // The first nbLines lines
  for(var i = 0; i < nbLines; i++) {
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
  
  //Totals line
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
    element.style.backgroundColor = transparent;
    highlighted = '';
  } else {
    element.style.backgroundColor = highlightColor;
    highlighted = id;
  }
  
};




// We are on the deck, the left table
var deck = function() {
  var element = document.getElementById(deckId);
  
  // If the deck image is the backside image of a card
  if (element.innerHTML == htmlImg('back')) { 

    // We flip the card to get a new card
    var newCard = cards.pop();
    element.innerHTML = htmlImg(cardValue(newCard));
    gameCards[deckId] = newCard;
    console.log(gameCards);
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
    if (highlighted == deckId) {
      var image = 'back';
      gameCards[id] = gameCards[deckId];
      gameCards[deckId] = -1;
    } else {
      var image = 'empty';
      gameCards[id] = gameCards[highlighted];
      gameCards[highlighted] = -1;
    }
    console.log(gameCards);
    
    // We're changing the image of the card that was highlighted
    document.getElementById(highlighted).innerHTML = htmlImg(image);
    
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
          
          gameCards[id] = gameCards[deckId];
          gameCards[deckId] = -1;
          console.log(gameCards);
          
        } else { // Switching the two cards
            var temp = element.innerHTML;
            element.innerHTML = document.getElementById(highlighted).innerHTML;
            document.getElementById(highlighted).innerHTML = temp;
            
            var temp = gameCards[id];
            gameCards[id] = gameCards[highlighted];
            gameCards[highlighted] = temp;
            console.log(gameCards);
            
            // We remove the highlight from the old slot
            highlightSwitch(highlighted);
        }
      }
    }
  }
};




// Clic dispatcher
var clic = function(id) {
  if ( id === deckId) {
    deck();
  } else {
    game(id);
  }
};




// Calculation of points earned
var points = function(id) {
  
  var sum = 0;
  
  // Calculation of the points of each line
  for(var i = 0; i < nbLines; i++) {
  }
  
  // Calculation of the points of each column
  for(var j = 0; j < nbColumns; j++) {

  }
};




// Initialization of the page
var init = function() {
  //console.log("init");
  document.getElementById("b").innerHTML = htmlDeck() + htmlGame();
  //document.getElementById("25").style.backgroundColor = "lime";
  
  for(i=0; i<cards.length; i++) {
    //console.log(cardValue(cards[i]));
  }
};




// Cards to be drawn
var cards = mixedCard(51);
