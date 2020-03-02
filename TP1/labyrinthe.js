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
/*
// Unit test of the iota function
var testIota = function(){
    assert( "" + iota(5) == "" + [0, 1, 2, 3, 4] );
    assert( "" + iota(1) == "" + [0]             );
    assert( "" + iota(0) == "" + []              );
};

testIota();
*/



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
/*
// Unit test of the contient function
var testContient = function(){
    assert( contient([9, 2, 5], 2) == true  );
    assert( contient([9, 2, 5], 4) == false );
    assert( contient([9, 2, 5], 9) == true  );
    assert( contient([9, 2, 5], 5) == true  );
};

testContient();
*/



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
/*
// Unit test of the ajouter function
var testAjouter = function(){
    assert( "" + ajouter([9, 2, 5], 2) == "" + [9, 2, 5]    );
    assert( "" + ajouter([9, 2, 5], 4) == "" + [9, 2, 5, 4] );
    assert( "" + ajouter([], 9)        == "" + [9]          );
};

testAjouter();
*/



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
/*
// Unit test of the retirer function
var testRetirer = function(){
    assert( "" + retirer([9, 2, 5], 2) == "" + [9, 5]    );
    assert( "" + retirer([9, 2, 5], 4) == "" + [9, 2, 5] );
    assert( "" + retirer([], 9)        == "" + []        );
    assert( "" + retirer([9, 2, 5], 9) == "" + [2, 5]    );
    assert( "" + retirer([9, 2, 5], 5) == "" + [9, 2]    );
};

testRetirer();
*/



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
/*
// Unit test of the voisins function
var testVoisins = function(){
    assert( "" + voisins(0, 0, 8, 4) == "" + [1, 8] );
    assert( "" + voisins(7, 0, 8, 4) == "" + [6, 15] );
    assert( "" + voisins(0, 3, 8, 4) == "" + [16, 25] );
    assert( "" + voisins(7, 3, 8, 4) == "" + [23, 30] );
    assert( "" + voisins(1, 1, 8, 4) == "" + [1, 8, 10, 17] );
};

testVoisins();
*/



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

    nx = Math.round(Math.abs(nx));
    ny = Math.round(Math.abs(ny));
    
    if (!(nx * ny > 0)) {
        return;
    }
    
    var mursH = iota(  nx    * (ny+1) - 1); // Set of horizontal walls
    var mursV = iota( (nx+1) *  ny       ); // Set of vertical walls
    var cave = [];                          // Set of cavities
    var front = [];                         // Set of frontal cells
    var cavity;                             // Cavity
    
    mursH = retirer(mursH, 0);
    /*
    mursH = retirer(mursH, 0);
    mursH = retirer(mursH, 8);
    mursV = retirer(mursV, 0);
    mursV = retirer(mursV, 9);
    printMurs(nx, ny, pas, mursH, mursV);
    //return;
    */

    // Initial cavity
    cavity = randomInt(nx * ny);
    
    //cavity = 56;
    var rt = [57,58,59,43];
    var ri = 0;
    
    while (cavity != -1) {
        //print();
        //print("Itération " + ri + ":");
        //print("cavity   = " + cavity);
        
        // Coordinates of the new cavity
        var x = xVal(cavity, nx);
        var y = yVal(cavity, nx);
        
        // All the adjacent cells of the new cavity
        var tempFront = voisins(x, y, nx, ny);

        // Local frontal cells, close to the cavity
        var newFront = [];
        
        // In adjacent cells, delete cavities
        do {
            var cell = tempFront.pop();
            if (!contient(cave, cell)) {
                newFront.push(cell);
            }
        } while (tempFront.length);
        
        //print("newFront = [" + newFront + "]");
        //if (ri == 3) pause();
        
        // Next cavity
        var nextCav;
        
        if (newFront.length) { // We have local adjacent cells
            
            //print("If : start");
            
            // Take one of them
            nextCav = newFront[randomInt(newFront.length)];
        
            //nextCav = rt[ri];
            //print("nextCav  = " + nextCav);
            //print("If : end");
        } else { // No more local front cells, let's explore a new branch
            
            //print("Else : start");
            //print("front    = [" + front + "]");
        
            // Remove old branch last cavity from the list of front cells
            front = retirer(front, nextCav);
            
            if (front.length) { // There are still frontal cells
                // Choice of a new cavity from the list of front cells
                nextCav = front[randomInt(front.length)];
                
                //nextCav = rt[ri];

                x = xVal(nextCav, nx);
                y = yVal(nextCav, nx);
                tempFront = voisins(x, y, nx, ny);
                cavity = -1;
                do {
                    var cell = tempFront.pop();
                    if (contient(cave, cell)) {
                        cavity = cell;
                        x = xVal(cavity, nx);
                        y = yVal(cavity, nx);
                    }
                } while (cavity == -1);
                
                //print("front    = [" + front + "]");
                
            } else {            //No more frontal cells
                // The labyrinth is over
                nextCav = -1;
            }
            
            //print("nextCav  = " + nextCav);
            //print("Else : end");
            //return;
        }
        //pause();
        front = retirer(front, nextCav);
        //pause();
        
        //pause();
        //print("cavity   = " + cavity);
        //print("nextCav  = " + nextCav);
        //if (ri == 3) pause();
        // Remove the wall between the two cavities
        if (nextCav != -1) {
            if (nextCav + nx == cavity) {         // nextCav is above
                mursH = retirer(mursH, nx * y + x );
                //print("retirer(murs N, " + (nx * y + x) + ")");
            } else if (nextCav + 1 == cavity) {  // nextCav is on the left
                mursV = retirer(mursV, (nx+1) * y + x);
                //print("retirer(murs O, " + ((nx+1) * y + x) + ")");
            } else if (cavity + 1 == nextCav ) { // nextCav is on the right
                mursV = retirer(mursV, (nx+1) * y + x + 1 );
                //print("retirer(murs E, " + ((nx+1) * y + x + 1) + ")");
            } else if (cavity + nx == nextCav) {  // nextCav is below
                mursH = retirer(mursH,  nx * (y+1) + x );
                //print("retirer(murs S, " + (nx * (y+1) + x) + ")");
            }
        }
        
        // Add the cavity to the list of cavities
        cave.push(cavity);
        
        // The new cavity for the next loop
        cavity = nextCav;
        //print("cavity   = " + cavity);
        
        //print("cave     = [" + cave + "]");
        //print("retirer([" + newFront + "]," + nextCav + ")");
        
        // Remove this cavity from the list of front cells
        newFront = retirer(newFront, nextCav);
        
        //print("newFront = [" + newFront + "]");
        
        //pause();
        
        // Add the new front cells to the front cells table
        while (newFront.length) {
            front = ajouter(front, newFront.pop());
        }
        
        //print("front    = [" + front + "]");
        //printMursTab(mursH, mursV, nx, ny);
        //printMursASCII(mursH, mursV, nx, ny);
        //printMurs(nx, ny, pas, mursH, mursV);
        //ri++;
        //pause();
        
        //if (ri == rt.length + 1) nextCav = -1;
    }
    printMurs(nx, ny, pas, mursH, mursV);
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

var printMursTab = function(mursH, mursV, nx, ny) {
    var murs;
    var nb;
    var number;

    var index = 0;
    print("mursH :");
    for (var i = 0; i < ny+2; i++) {
        murs = "";
        for(var j = i*nx; j < (i+1)*nx; j++) {
            nb = (index < 10 ? "  " : index < 100 ? " " : "") + index;
            number = contient(mursH, index) ? " " + nb + " " : " --- ";
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
            nb = (index < 10 ? "  " : index < 100 ? " " : "") + index;
            number = contient(mursV, index) ? " " + nb + " " : " --- ";
            murs += number;
            index++;
        }
        print(murs);
    }
    print();
};

var printMurs = function(nx, ny, pas, mursH, mursV) {
    cs();
    var ox = - (nx * pas) / 2;
    var oy = (ny * pas) / 2;
    
    rt(90);
    for (var j = 0; j <= ny; j++) {
        pu();
        mv(ox, oy-j*pas);
        pd();
        for (var i = 0; i <nx; i++) {
            if (contient(mursH, j*nx + i)) {
                //print("mursH contient " + (j*nx + i));
                fd(pas);
            } else {
                //print("mursH ne contient pas " + (j*nx + i));
                pu();
                fd(pas);
                pd();
            }
        }
        //pause();
    }
    
    rt(90);
    for (var i = 0; i <= nx; i++) {
        pu();
        mv(ox+i*pas, oy);
        pd();
        for (var j = 0; j < ny; j++) {
            if (contient(mursV, j*(nx+1) + i)) {
                //print("mursV contient " + (j*(nx+1) + i));
                //pause();
                fd(pas);
            } else {
                //print("mursV ne contient pas " + (j*(nx+1) + i));
                pu();
                fd(pas);
                pd();
            }
            //pause();
        }
    }
    
    pu();
    mv(ox + pas/2, oy + 20);
};





laby(10, 9, 20);

