/* File: tp2a.js
 * 
 * Authors: Alexandre Pachot and Eliecer Rodriguez Silva
 * Date: April 22, 2020
 */




// Return the html code of an array
var htmlTable = function(inner) {
  return '<table>\n\t<tbody>\n' + inner + '\t</tbody>\n</table>\n';
}




// Return the html code of a row
var htmlTr = function(inner) {
  return '\t\t<tr>\n' + inner + '\t\t</tr>\n';
}




// Return the html code of a cell
var htmlTd = function(id, js, inner) {
  var id = (id === '') ? '' : ' id="' + id + '"';
  var js = (js == '') ? '' : ' ' + js;
  return '\t\t\t<td' + id + js + '>' + inner + '</td>\n';
}




// Return the html code of an onclick cell
var htmlTdOnclick = function(id, inner) {
  return htmlTd(id, 'onclick="clic(' + id + ');"', inner);
}




// Return the html code of an image
var htmlImg = function(img) {
  return '<img src="cards/' + img + '.svg">'
}




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
}




// Table on the right (table 5x5)
var htmlGame = function() {
  
  var innerTable = '';
  
  // The first five lines
  for(var i = 0; i < 5; i++) {
    var innerTR = '';
    
    // Five columns of cards
    for(var j = 0; j < 5; j++) {
      innerTR += htmlTdOnclick(5*i + j, htmlImg('empty'));
    }
    
    // Total column
    innerTR += htmlTd('R'+i, '', '');
    
    innerTable += htmlTr(innerTR);
  }
  
  var innerTR = '';
  
  //Totals line
  for(var j = 0; j < 5; j++) {
    innerTR += htmlTd('C'+j, '', '');
  }
  
  // Big total
  innerTR += htmlTd('T', '', 0);
  
  innerTable += htmlTr(innerTR);
  
  return htmlTable(innerTable);
}




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
}




// 0..13 => A 1..10 J Q K
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
}




// 0..13 => A 1..10 J Q K
var cardSuit = function (cardValue) {
  switch (cardValue) {
    case 0 : return 'C'; // Clubs
    case 1 : return 'D'; // Diamonds
    case 2 : return 'H'; // Hearts
    case 3 : return 'S'; // Spades
  }
}


// 0..51 => AC AD AH AS 1C... 
var cardValue = function(cardNumber) {
  var rank = cardRank(cardNumber >> 2);
  var suit = cardSuit(cardNumber & 3);
  return rank + suit;
}




var init = function () {
  document.getElementById("b").innerHTML = htmlDeck() + htmlGame();
  
  var cards = mixedCard(51);
  
  for(i=0; i<52; i++) {
    console.log(cardValue(cards[i]));
  }
};
