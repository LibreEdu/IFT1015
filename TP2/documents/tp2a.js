/* File: tp2a.js
 * 
 * Authors: Alexandre Pachot and Eliecer Rodriguez Silva
 * Date: April 22, 2020
 */




var highlightColor = "lime";
var transparent = "rgba(191, 255, 0, 0)"; // lime color + opacity = 0
var focus; // Indicate which element has the focus
var nbColumns = 5;
var nbLines = 5;
var deckId = nbColumns * nbLines;
var gameCards = Array(deckId + 1);



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




// Table on the right (table 5x5)
var htmlGame = function() {
  
  var innerTable = '';
  
  // The first five lines
  for(var i = 0; i < nbLines; i++) {
    var innerTR = '';
    
    // Five columns of cards
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




// Highlight a card
var highlight = function(id) {
  var element = document.getElementById(id);
  if ( element.style.backgroundColor == highlightColor ) {
    element.style.backgroundColor = transparent;
    focus = '';
  } else {
    element.style.backgroundColor = highlightColor;
    focus = id;
  }
};




// Click on the deck evenement
var deck = function() {
  var element = document.getElementById(deckId);
  if (element.innerHTML == htmlImg('back')) { 
    // We turn over a new card
    var newCard = cards.pop();
    element.innerHTML = htmlImg(cardValue(newCard));
    gameCards[deckId] = newCard;
    //console.log(gameCards);
  }
  
  highlight(deckId);
};




// Click on the deck evenement
var game = function(id) {
  var element = document.getElementById(id);
  
  if (element.innerHTML == htmlImg('empty')) {
    // Click on an empty cell

    if (focus === "") {
      // No cell has the focus, there's nothing to do.
      return;
    }
    
    // One cell has the focus, we get his image 
    element.innerHTML = document.getElementById(focus).innerHTML;
    
    // Operation to do, depending on the origin of the focus
    if (focus == deckId) {
      var image = 'back';
      //gameCards[id]= gameCards[deckId];
    } else {
      var image = 'empty';
      //gameCards[id]= gameCards[deckId];
    }
    //console.log(gameCards);
    
    // Change the focus image
    document.getElementById(focus).innerHTML = htmlImg(image);
    highlight(focus);
    
  } else {
    // We click on a cell that is not empty
    
    if (element.style.backgroundColor == highlightColor) {
      // The cell's hightlighted, we remove the hightlight
      highlight(id);
    } else {
      // The cell's not hightlighted
      
      if (focus === "") {
        // No cell has focus, we hightlight the cell
        highlight(id);
      } else {
        // Switch 
        var temp = element.innerHTML;
        element.innerHTML = document.getElementById(focus).innerHTML;
        document.getElementById(focus).innerHTML = temp;
        highlight(focus);
      }
    }
  }
};




// Clic dispatcher
var clic = function(id) {
  if ( id == deckId) {
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
