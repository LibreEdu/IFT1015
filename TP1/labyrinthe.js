/* File: labyrinthe.js
 *
 * Authors: Alexandre Pachot and Eliecer Rodriguez Silva
 * Date: March 11, 2020
 *
 * Library to generate mazes.
 *
 * List of functions:
 * ioata(n)              : return an array containing numbers from 0 to n-1
 * contient(tab, x)      : indicate if tab contains x
 * ajouter(tab, x)       : if x is not in tab, add it
 * retirer(tab, x)       : if x is in tab, remove it
 * voisins(x, y, nx, ny) : cells close to (x, y) in a (nx, ny) grid
 * laby(ny, ny, pas)     : draw a nx * ny maze with pas pixel cells
 */




/* Return an array containing numbers from 0 to n-1.
 *
 * n (number): integer > 0
 *
 * output (array): array containing the values from 0 to n-1
 *
 * iota(5) = [0, 1, 2, 3, 4]
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




/* Indicate if an array contains a number.
 *
 * tab (array)     : array of numbers
 * x   (number)    : number
 *
 * output (boolean): true if the array contains the number, false if not
 *
 * contient([9, 2, 5], 2) = true
 * contient([9, 2, 5], 4) = false
 */
var contient = function(tab, x) {

    var i = 0;
    while (i < tab.length) {
        if (tab[i++] == x) {
            return true;
        }
    }
    return false;
};

// Unit test of the contient function
var testContient = function(){
    assert( contient([9, 2, 5], 2) == true  );
    assert( contient([9, 2, 5], 4) == false );
    assert( contient([9, 2, 5], 9) == true  );
    assert( contient([9, 2, 5], 5) == true  );
};

testContient();




/* If the number is not in the array, add it.
 *
 * tab (array)   : array of numbers
 * x   (number)  : number
 *
 * output (array): the new array
 *
 * ajouter([9, 2, 5], 2) = [9, 2, 5]
 * ajouter([9, 2, 5], 4) = [9, 2, 5, 4]
 */
var ajouter = function(tab, x) {
    if (!contient(tab, x)) { // The array does not contain x
        tab.push(x);         // It is added
    }
    return tab;
};

// Unit test of the ajouter function
var testAjouter = function(){
    assert( "" + ajouter([9, 2, 5], 2) == "" + [9, 2, 5]    );
    assert( "" + ajouter([9, 2, 5], 4) == "" + [9, 2, 5, 4] );
    assert( "" + ajouter([], 9)        == "" + [9]          );
};

testAjouter();




/* If the number is in the array, remove it.
 *
 * tab (array)   : array of numbers
 * x   (number)  : number
 *
 * output (array): the new array
 *
 * retirer([9, 2, 5], 2) = [9, 5]
 * retirer([9, 2, 5], 4) = [9, 2, 5]
 */
var retirer = function(tab, x) {
    if (contient(tab, x)) {      // The array contains x
        var i = 0;
        while (i < tab.length) {
            if (tab[i++] == x) { // Remove x
                return tab.slice(0, --i).concat(tab.slice(++i, tab.length));
            }
        }
    } else {
        return tab;
    }
};

// Unit test of the retirer function
var testRetirer = function(){
    assert( "" + retirer([9, 2, 5], 2) == "" + [9, 5]    );
    assert( "" + retirer([9, 2, 5], 4) == "" + [9, 2, 5] );
    assert( "" + retirer([], 9)        == "" + []        );
    assert( "" + retirer([9, 2, 5], 9) == "" + [2, 5]    );
    assert( "" + retirer([9, 2, 5], 5) == "" + [9, 2]    );
};

testRetirer();




/* Cells close to (x, y) in a (nx, ny) grid.
 *
 *  x (number)   : column number of the cell
 *  y (number)   :    row number of the cell
 * nx (number)   : number of grid columns
 * ny (number)   : number of grid lines
 *
 * output (array): list of cells close to (x, y)
 *
 * voisins(7, 2, 8, 4) = [15, 22, 31]
 */
var voisins = function(x, y, nx, ny) {
    var output = [];
    if (y) {          // Top cell
        output.push(nx * (y-1) + x);
    }
    if (x) {          // Left cell
        output.push(nx * y + x - 1);
    }
    if (x < (nx-1)) { // Right cell
        output.push(nx * y + x + 1);
    }
    if (y < (ny-1)) { // Lower cell
        output.push(nx * (y+1) + x);
    }

    return output;
};

// Unit test of the voisins function
var testVoisins = function(){
    assert( "" + voisins(0, 0, 8, 4) == "" + [1, 8] );
    assert( "" + voisins(7, 0, 8, 4) == "" + [6, 15] );
    assert( "" + voisins(0, 3, 8, 4) == "" + [16, 25] );
    assert( "" + voisins(7, 3, 8, 4) == "" + [23, 30] );
    assert( "" + voisins(1, 1, 8, 4) == "" + [1, 8, 10, 17] );
};

testVoisins();




/* Draw a maze
 *
 * nx  (number): number of columns
 * ny  (number): number of lines
 * pas (number): cell size
 *
 * output      : none
 *
 * laby(16, 9, 20)
 */
var laby = function(nx, ny, pas) {
    var mursH = iota(  nx    * (ny+1) ); // Set of horizontal walls
    var mursV = iota( (nx+1) *  ny    ); // Set of vertical walls
    var cave = [];                       // Set of cavities
    var front = [];                      // Set of frontal cells
    var currentCave;
    var x;
    var y;
    var newFront;
    var nextCave;

    // Initial cavity
    currentCave = randomInt(nx * ny);
    x = xVal(currentCave, nx);
    y = yVal(currentCave, nx);
    newFront = voisins(x, y, nx, ny);
    if (newFront.length) {
        nextCave = newFront[randomInt(front.length)];
    }

    // Walls removal
    if (nextCave + 8 == currentCave) { // next cave is above
        mursH = retirer(mursH, nx * y + x );
    } else if (nextCave + 1 == currentCave) { // next cave is on the left
        mursV = retirer(mursV, (nx+1) *  y     + x     );
    } else if (currentCave + 1 == nextCave   ) { // next cave is on the right
        mursV = retirer(mursV, (nx+1) *  y     + x + 1 );
    } else if (currentCave + 8 == nextCave) { // next cave is below
        mursH = retirer(mursH,  nx * (y+1) + x );
    }

    //front = front.concat(newFront);
    print(currentCave);
    print(newFront);
    print(nextCave);
    //print(front[randomInt(front.length)]);

    printMurs(mursH, mursV, nx, ny);
};

var xVal = function(cellNumber, nx) {
    return cellNumber % nx;
};

var yVal = function(cellNumber, nx) {
    return Math.floor(cellNumber / nx);
};

var randomInt = function(max) {
    return Math.floor( ( Math.random() * max ) );
};

var printMurs = function(mursH, mursV, nx, ny) {
    var murs;
    var nb;
    var number;

    var index = 0;
    print("mursH :");
    for (var i = 0; i < ny+2; i++) {
        murs = "";
        for(var j = i*nx; j < (i+1)*nx; j++) {
            nb = (index < 10 ? " " : "") + index;
            number = contient(mursH, index) ? " " + nb + " " : " -- ";
            murs += number;
            index++;
        }
        print(murs);
    }
    print();

    index = 0;
    print("mursV :");
    for (var i = 0; i < ny+1; i++) {
        murs = "";
        for(var j = i*(nx+1); j < (i+1)*(nx+1); j++) {
            nb = (index < 10 ? " " : "") + index;
            number = contient(mursV, index) ? " " + nb + " " : " -- ";
            murs += number;
            index++;
        }
        print(murs);
    }
    print();
};

laby(8, 4, 40);
