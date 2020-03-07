/* File: labyrinthe.js
 * 
 * Authors: Alexandre Pachot and Eliecer Rodriguez Silva
 * Date: March 11, 2020
 * 
 * Library to draw labyrinth.
 * 
 * List of functions:
 * ioata(n)                   : return an array containing numbers from 0 to n-1
 * contient(tab, x)           : indicate if tab contains x
 * ajouter(tab, x)            : if x is not in tab, add it
 * retirer(tab, x)            : if x is in tab, remove it
 * voisins(x, y, nx, ny)      : return cells close to (x, y) in a (nx, ny) grid
 * xVal(cellNumber, nx)       : return cell abscissa in a grid of nx columns
 * yVal(cellNumber, nx)       : return cell y-intercept in a grid of nx columns
 * randomInt(max)             : return a natural number < max
 * creerLaby(nx, ny)          : generate walls of a nx * ny labyrinth
 * afficherLaby(nx, ny, pas, murs): display the walls of the labyrinth
 * labySol(nx, ny, pas, murs) : solve the labyrinth
 * laby(nx, ny, pas)          : a labyrinth and its solution
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

// testIota();




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

// testContient();




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

// testAjouter();




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

// testRetirer();




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

// testVoisins();




/* Return the abscissa of a cell
 * 
 * cellNumber (number): the cell number
 * nx         (number): number of grid columns
 * 
 * output (number)    : the abscissa of the cell
 * 
 * xVal(15, 8) = 7
 */
var xVal = function(cellNumber, nx) {
    return cellNumber % nx;
};

// Unit test of the xval function
var testXVal = function(){
    assert( xVal(15, 8) == 7 );
    assert( xVal(16, 8) == 0 );
};

// testXVal();




/* Returning the y-intercept of a cell
 * 
 * cellNumber (number): the cell number
 * nx         (number): number of grid columns
 * 
 * output (number)    : the y-intercept of the cell
 * 
 * xVal(15, 8) = 1
 */
var yVal = function(cellNumber, nx) {
    return Math.floor(cellNumber / nx);
};

// Unit test of the xval function
var testYVal = function(){
    assert( yVal(15, 8) == 1 );
    assert( yVal(16, 8) == 2 );
};

// testYVal();




/* Return an integer random value less than max
 * 
 * max (number)   : upper limit
 * 
 * output (number): an integer n such that 0 ≤ n < max
 * 
 * randomInt(31) = 26
 */
var randomInt = function(max) {
    return Math.floor( ( Math.random() * max ) );
};

// Unit test of the randomInt function
var testRandomInt = function(){
    for (var i = 0; i < 10; i++) {
        assert( randomInt(2) == 0 || 1 || 2);
    }
};

// testRandomInt();




/* Generate the walls of the labyrinth
 * 
 * nx  (number)  : number of columns, integer ≥ 2
 * ny  (number)  : number of lines,   integer ≥ 2
 * 
 * output (array): walls of the labyrinth
 * 
 * creerLaby(16, 9)
 */
var creerLaby = function(nx, ny) {
    
    // Declaration of global variables to the loop
    var mursH = iota(  nx    * (ny+1) - 1); // Set of horizontal walls - exit
    var mursV = iota( (nx+1) *  ny       ); // Set of vertical walls
    var cave = [];                          // Cells that are part of the cavity
    var front = [];                         // Set of frontal cells
    var cavity;                             // Next cell added to the cave[]
    
    // Remove the entrance wall
    mursH = retirer(mursH, 0);
    
    // Initial cavity cell
    cavity = randomInt(nx * ny);
    
    // Until all the cells are part of the cavity
    do {
        
        // Add the cell to the cavity
        cave.push(cavity);
        
        // Coordinates of the new cell cavity
        var x = xVal(cavity, nx);
        var y = yVal(cavity, nx);
        
        // All the adjacent cells of the new cavity
        var neighbour = voisins(x, y, nx, ny);
        
        // Cells that are not part of the cavity are added to front[]
        do {
            var cell = neighbour.pop();
            if ( !contient(cave, cell) && !contient(front, cell)) {
                front.push(cell);
            }
        } while (neighbour.length);
        
        if (front.length) { // There are still frontal cells
            
            // Choice of a new cavity cell from the set of frontal cells
            var nextCav = front[randomInt(front.length)];
            
            // Coordinates of this cavity cell
            x = xVal(nextCav, nx);
            y = yVal(nextCav, nx);
            
            // The frontal cells of this cavity cell
            neighbour = voisins(x, y, nx, ny);
            
            // Initialize the end of loop indicator for the following loop
            cavity = -1;
            
            // Among all the frontal cells of the cavity cell, which one is a
            // cavity cell?
            do {
                // From the adjacent cells, we randomly pick one of them
                var cell = neighbour[randomInt(neighbour.length)];
                
                // And we remove it from the neighboring cells
                neighbour = retirer(neighbour, cell);
                
                // Is neighboring cell part of the cavity?
                if (contient(cave, cell)) { // If yes
                    
                    // Get the coordinates of this cavity, in order to remove
                    // the wall, later.
                    x = xVal(cell, nx);
                    y = yVal(cell, nx);
                    
                    // It's time to exit the loop
                    cavity = cell;
                }
            } while (cavity == -1);
            
        } else { // No more frontal cells, the labyrinth is done, yay :-)
            nextCav = -1;
        }
        
        // Remove the wall between the two cavities
        if (nextCav != -1) {
            if (nextCav + nx == cavity) {        // nextCav is above
                mursH = retirer(mursH, nx * y + x );
            } else if (nextCav + 1 == cavity) {  // nextCav is on the left
                mursV = retirer(mursV, (nx+1) * y + x);
            } else if (cavity + 1 == nextCav ) { // nextCav is on the right
                mursV = retirer(mursV, (nx+1) * y + x + 1 );
            } else if (cavity + nx == nextCav) { // nextCav is below
                mursH = retirer(mursH, nx * (y+1) + x );
            }
        }
        
        // The new cavity cell for the next loop
        cavity = nextCav;
        
        // Remove the cavity cell from the set of frontal cells
        front = retirer(front, cavity);
        
    } while (cavity != -1);
    
    // Output
    var murs = Array(2);
    murs[0] = mursH;
    murs[1] = mursV;
    
    return murs;
};




/* Draw the labyrinth
 * 
 * nx  (number) : number of columns
 * ny  (number) : number of lines
 * pas (number) : cell size
 * murs (array) : horizontal and vertical walls
 * 
 * output       : none
 * 
 * afficherLaby(2, 2, 20, [[1, 4], [0, 2, 3, 4, 5]])
 */
var afficherLaby = function(nx, ny, pas, murs) {
    
    // Origin point of the labyrinth, top left
    var ox = - (nx * pas) / 2;
    var oy = (ny * pas) / 2;
    
    // Horizontal and vertical walls
    var mursH = murs[0];
    var mursV = murs[1];
    
    // Clear screen
    cs();
    
    // Arrow pointing to the right
    rt(90);
    
    // Draw the horizontal walls, line by line, from top to bottom
    for (var j = 0; j <= ny; j++) {
        
        // Go to next horizontal line
        pu();
        mv(ox, oy - j*pas);
        pd();
        
        // Draw the walls of a horizontal line
        for (var i = 0; i <nx; i++) {
            if (contient(mursH, j*nx + i)) { // We have a wall
                fd(pas);
            } else {                         // No wall
                pu();
                fd(pas);
                pd();
            }
        }
    }
    
    // Arrow pointing down
    rt(90);
    
    // Draw the vertical walls, column by column, from left to right.
    for (var i = 0; i <= nx; i++) {
        
        // Go to the next vertical line
        pu();
        mv(ox + i*pas, oy);
        pd();
        
        // Draw the walls of a vertical line
        for (var j = 0; j < ny; j++) {
            if (contient(mursV, j*(nx+1) + i)) { // We have a wall
                fd(pas);
            } else {                             // No wall
                pu();
                fd(pas);
                pd();
            }
        }
    }
    
    // Move the cursor at the entrance to the labyrinth
    pu();
    mv(ox + pas/2, oy + 20);
};




/* Solve the labyrinth with the Pledge algorithm
 * 
 * nx  (number) : number of columns
 * ny  (number) : number of lines
 * pas (number) : cell size
 * murs (array) : horizontal and vertical walls
 * 
 * output       : none
 * 
 * labySol(2, 2, 20, [[1, 4], [0, 2, 3, 4, 5]])
 */
var labySol = function(nx, ny, pas, murs) {
    // https://interstices.info/lalgorithme-de-pledge/
    
    // Declaration of variables
    var cell = 0;           // Initial position
    var exit = nx * ny - 1; // Exit position
    var nbRot = 0;          // Number of rotations
    var along = false;      // Go along the wall
    
    // Horizontal and vertical walls
    var mursH = murs[0];
    var mursV = murs[1];
    
    // Origin point of the labyrinth, top left
    var ox = - (nx * pas) / 2;
    var oy = (ny * pas) / 2;
    
    // check if there's a north wall
    var checkNorth = function() {
        return contient(mursH, cell);
    };
    
    // check if there's a south wall
    var checkSouth = function() {
        return contient(mursH, cell + nx);
    };
    
    // check if there's a west wall
    var checkWest = function() {
        return contient(mursV, cell + yVal(cell, nx));
    };
    
    // check if there's a east wall
    var checkEast = function() {
        return contient(mursV, cell + yVal(cell, nx) + 1);
    };
    
    // Check the front wall
    var checkFront = function() {
        if ( nbRot % 4 == 0 ) {         // We're heading south
            return checkSouth();
        } else if ( nbRot % 4 == -1 ) { // We're heading west
            return checkWest();
        } else if ( nbRot % 4 == -2 ) { // We're heading north
            return checkNorth();
        } else {                        // We're heading east
            return checkEast();
        }
    };
    
    // Check the left wall
    var checkLeft = function() {
        if ( nbRot % 4 == 0 ) {         // We're heading south
            return checkEast();
        } else if ( nbRot % 4 == -1 ) { // We're heading west
            return checkSouth();
        } else if ( nbRot % 4 == -2 ) { // We're heading north
            return checkWest();
        } else {                        // We're heading east
            return checkNorth();
        }
    };
    
    // Go straight ahead
    var goAhead = function() {
        fd(pas);
        if ( nbRot % 4 == 0 ) {         // We're heading south
            cell = cell + nx;           // New cell = south cell
        } else if ( nbRot % 4 == -1 ) { // We're heading west
            cell = cell - 1;            // New cell = west cell
        } else if ( nbRot % 4 == -2 ) { // We're heading north
            cell = cell - nx;           // New cell = north cell
        } else {                        // We're heading east
            cell = cell + 1;            // New cell = east cell
        }
    };
    
    // Turn right
    var turnRight = function() {
        rt(90); 
        nbRot--;
    };
    
    // Turn left
    var turnLeft = function() {
        lt(90); 
        if (++nbRot == 0) {
            along = false;
        }
    };
    
    // Move the cursor inside the labyrinth, in the middle of the first cell
    mv(ox + pas/2, oy);
    
    // Close the entrance of the labyrinth: no return possible. Good luck :-)
    ajouter(mursH, 0);
    
    // In red, to be more visible
    setpc(1, 0, 0);
    
    // Pen down, ready to go
    pd();
    
    // Moving from the edge to the centre of the cell, on the starting blocks
    fd(pas/2);
    
    // Until we get to the exit
    while (cell != exit) {
        if (along) {                  // Go along the wall
            if ( checkLeft() ) {      // There's a wall to the left
                if ( checkFront() ) { // There's a wall in front
                    turnRight();
                } else {              // There's no wall in front
                    goAhead();
                }
            } else {                  // There's no wall to the left
                turnLeft();
                goAhead();
            }
        } else {                      // Go straight ahead
            if ( checkFront() ) {     // There's a wall in front
                turnRight();
                along = true;         // Now, go along the wall
            } else {                  // There's no wall in front
                goAhead();
            }
        }
    }
    
    // To have the cursor that points to the exit
    rt(nbRot * 90);
    
    // Last Steps
    fd(pas/2);
    
    // Move the cursor at the entrance to the labyrinth
    pu();
    mv(ox + pas/2, oy + 20);
};




/* Generate a labyrinth
 * 
 * nx  (number): number of columns, integer ≥ 2
 * ny  (number): number of lines,   integer ≥ 2
 * pas (number): cell size
 * 
 * output      : none
 * 
 * laby(16, 9, 20)
 */
var laby = function(nx, ny, pas) {
    
    // Robustness of the arguments: laby("", "", "") => laby(2, 2, 10)
    nx = Math.max( Math.round(Math.abs(nx)), 2 );
    ny = Math.max( Math.round(Math.abs(ny)), 2 );
    nx = nx != nx ? 2 : nx;
    ny = ny != ny ? 2 : ny;
    pas = pas === 0 ? pas : pas/pas * pas;
    pas = pas != pas ? 10 : pas;
    
    // Generate the walls of the labyrinth
    var murs = creerLaby(nx, ny);
    
    // No labyrinth without its visual representation
    afficherLaby(nx, ny, pas, murs);
    
    // No representation without a solution
    // labySol(nx, ny, pas, murs);
};

// If we want to calculate an average number of steps per labyrinth
// for (var i = 0; i < 100; i++)
// We get 374 000 steps per labyrinth (without labysol) for:
laby(10, 9, 20);

// laby(8, 4, 40);
// laby(16, 9, 20);
// laby(34, 18, 10);
