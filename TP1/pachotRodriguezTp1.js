/* File : labyrinthes.js
 *
 * Author : Alexandre Pachot and Eliecer Rodriguez Silva
 * Date : March 11, 2020
 *
 * Library to generate mazes.
 */



/* Take a non-zero natural number n as parameter and return an array containing
 * the values from 0 to n-1.
 *
 * n (number) : integer > 0
 *
 * output : array containing the values from 0 to n-1
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

// Unit test
var testIota = function(){
    assert("" + iota(5) == "" + [0, 1, 2, 3, 4]);
    assert("" + iota(1) == "" + [0]);
    assert("" + iota(0) == "" + []);
};
