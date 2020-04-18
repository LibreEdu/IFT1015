
// Check if all cards are from the same suit
var flush = function(hand) {
  for (var i = 1; i < hand.length; i++) {
    if ( ((hand[i-1] & 3) != (hand[i] & 3)) || hand[i] == 52 ) {
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
// same (sequential = 0) rank. Cards must be sorted
var rank = function(cards, sequential) {
  if(cards[cards.length - 1] == 52) return false;
    
  for (var i = 1; i < cards.length; i++) {
    if ( (cards[i-1] >> 2) + sequential != cards[i] >> 2 ) {
      return false;
    } 
  }
  return true;
};


// Check if we have a royal straight. Hand must be sorted.
var royalStraight = function(hand) {
  
    if (hand[0]>>2 != 0 || hand[1]>>2 != 9) return false;

    return rank(hand.slice(1,5),1);
};




// Check if there are x cards of the same rank. Cards must be sorted. The
// parameter must not be called hand, otherwise it refers to the full hand.
var xOfAKind = function(x, hand) {
  for (var i = 0; i <= hand.length - x; i++) {
    var partHand = hand.slice(i,i+x); 
  	if(rank(partHand, 0 ) && partHand[0] != 52) return true;
  }
  return false;
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
  var firstTwo = rank(pair[0],0) && rank(pair[2],0);
  var lastTwo  = rank(pair[1],0) && rank(pair[3],0);
  var twoEnds  = rank(pair[0],0) && rank(pair[3],0);
  return firstTwo || lastTwo || twoEnds;
};



// Check if there are four cards of the same rank. Cards must be sorted.
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

    
      if ( flush(hand) && royalStraight(hand) ) {  // Royal Straight Flush
        return 100;
      }
      if ( flush(hand) && rank(hand,1) ) {         // Straight Flush
        return 75;
      }
      if ( xOfAKind(4, hand) ) {                   // Four of a kind
        return 50;
      }
      if ( fullHouse(hand) ) {                     // Full House
        return 25;
      }
      if ( flush(hand) ) {                         // Flush
        return 20;
      }
      if ( rank(hand,1) || royalStraight(hand) ) { // Straight
        return 15;
      }
      if ( xOfAKind(3, hand) ) {                   // Three of a kind
        return 10;
      }
      if ( twoPair(hand) ) {                       // Two pair
        return 5;
      }
      if ( xOfAKind(2,hand) ) {                    // One pair
        return 2;
      } else return 0;

};




var testPoints = function() {

    assert(points([36,0,40,48,44]) == 100);
    assert(points([9,13,17,21,25]) == 75);
    assert(points([36,37,38,7,39]) == 50);
    assert(points([5,16,6,17,18]) == 25);
    assert(points([8,16,32,12]) == 20);
    assert(points([4,10,13,16,23]) == 15);
    assert(points([13,14,15,52,43]) == 10);
    assert(points([8,9,16,17,23]) == 5);
    assert(points([0,4,16,12,52]) == 0);
    assert(points([52,12,52,52,52]) == 0);
    assert(points([52,52,52,52,52]) == 0);

};

//testPoints();