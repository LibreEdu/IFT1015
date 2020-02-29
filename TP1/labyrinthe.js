/* File : labyrinthes.js
 *
 * Author : Alexandre Pachot and Eliecer Rodriguez Silva
 * Date : March 11, 2020
 *
 * Library to generate mazes.
 * 
 * ioata(n) : return an array containing numbers from 0 to n-1.
 * contient(tab, x) : indicate if x is contained in tab.
 */


 

/* Return an array containing numbers from 0 to n-1.
 *
 * n (number) : integer > 0
 *
 * output (array) : array containing the values from 0 to n-1
 *
 * iota(5) => [0,1,2,3,4]
 */
var iota = function(n) {

    var output = Array(n);
    var i = 0;
    
    while (i < n) {
        output[i] = i++;
    }

    return output;
};

// Unit test of the iota function
var testIota = function(){
    assert( "" + iota(5) == "" + [0, 1, 2, 3, 4] );
    assert( "" + iota(1) == "" + [0]             );
    assert( "" + iota(0) == "" + []              );
};

testIota();




/* Indicate if a number is contained in a array.
 *
 * tab (array) : array of numbers
 * x (number) : number
 *
 * output (boolean) : true if the array contains the number, false if not.
 *
 * contient([9,2,5], 2) = true
 * contient([9,2,5], 4) = false
 */
var contient = function(tab, x) {

    var i = 0;
    while (i < tab.length) {
        if ( tab[i++] == x ) {
            return true;
        }
    }
    return false;
};

// Unit test of the contient function
var testContient = function(){
    assert( contient([9,2,5], 2) == true );
    assert( contient([9,2,5], 4) == false);
    assert( contient([9,2,5], 9) == true );
    assert( contient([9,2,5], 5) == true );
};

testContient();
