/* File: labyrinthe.js
 * 
 * Authors: Alexandre Pachot and Eliecer Rodriguez Silva
 * Date: March 11, 2020
 * 
 * Library to draw labyrinth.
 * 
 * List of functions:
 * ioata(n)              : return an array containing numbers from 0 to n-1
 * contient(tab, x)      : indicate if tab contains x
 * ajouter(tab, x)       : if x is not in tab, add it
 * retirer(tab, x)       : if x is in tab, remove it
 * voisins(x, y, nx, ny) : return cells close to (x, y) in a (nx, ny) grid
 * xVal(cellNumber, nx)  : return cell abscissa in a nx * ny grid
 * yVal(cellNumber, nx)  : return cell y-intercept in a nx * ny grid
 * randomInt(max)        : return a natural number < max
 * labyDraw(nx, ny, pas, mursH, mursV): visual output of the labyrinth
 * labySol(nx, ny, pas, mursH, mursV) : solve the labyrinth
 * laby(nx, ny, pas)     : generate a nx * ny labyrinth with pas pixel cells
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
var testxVal = function(){
    assert( xVal(15, 8) == 7 );
    assert( xVal(16, 8) == 0 );
};

// testxVal();




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
var testyVal = function(){
    assert( yVal(15, 8) == 1 );
    assert( yVal(16, 8) == 2 );
};

// testyVal();




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



/* Draw the labyrinth
 * 
 * nx  (number) : number of columns
 * ny  (number) : number of lines
 * pas (number) : cell size
 * mursH (array): set of horizontal walls
 * mursV (array): Set of vertical walls
 * 
 * output       : none
 * 
 * labyDraw(2, 2, 20, [1, 4], [0, 2, 3, 4, 5])
 */
var labyDraw = function(nx, ny, pas, mursH, mursV) {
    
    // Clear screen
    cs();
    
    // Origin point of the labyrinth, top left
    var ox = - (nx * pas) / 2;
    var oy = (ny * pas) / 2;
    
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
 * mursH (array): set of horizontal walls
 * mursV (array): Set of vertical walls
 * 
 * output       : none
 * 
 * labySol(2, 2, 20, [1, 4], [0, 2, 3, 4, 5])
 */
var labySol = function(nx, ny, pas, mursH, mursV) {
    // https://interstices.info/lalgorithme-de-pledge/
    
    // Declaration of variables
    var cell = 0;           // Initial position
    var exit = nx * ny - 1; // Exit position
    var nbRot = 0;          // Number of rotations
    var along = false;      // Go along the wall
    
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
        
    // Going to the north cell
    var goingNorth = function() {
        fd(pas);
        cell = cell - nx;
    };
    
    // Going to the south cell
    var goingSouth = function() {
        fd(pas);
        cell = cell + nx;
    };
    
    // Going to the west cell
    var goingWest = function() {
        fd(pas);
        cell = cell - 1;
    };
    
    // Going to the south cell
    var goingEast = function() {
        fd(pas);
        cell = cell + 1;
    };
    
    // Go straight ahead
    var goAhead = function() {
        if ( nbRot % 4 == 0 ) {         // We're heading south
            goingSouth();
        } else if ( nbRot % 4 == -1 ) { // We're heading west
            goingWest();
        } else if ( nbRot % 4 == -2 ) { // We're heading north
            goingNorth();
        } else {                        // We're heading east
            goingEast();
        }
    };
    
    // Turn right and go along the wall
    var turnRightGoAlong = function() {
        rt(90); 
        nbRot--;
        along = true;
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
                turnRightGoAlong();
            } else {                  // There's no wall in front
                goAhead();
            }
        }
    }

    // To have the cursor that points to the output
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
    
    // Declaration of global variables to the loop
    var mursH = iota(  nx    * (ny+1) - 1); // Set of horizontal walls - exit
    var mursV = iota( (nx+1) *  ny       ); // Set of vertical walls
    var cave = [];                          // Set of cavities
    var front = [];                         // Set of frontal cells
    var cavity;                             // Cavity
    
    // Remove the entrance wall
    mursH = retirer(mursH, 0);
    
    // Initial cavity
    cavity = randomInt(nx * ny);
    
    // As long as all the cells are not a cavity
    do {
        
        // Coordinates of the new cavity
        var x = xVal(cavity, nx);
        var y = yVal(cavity, nx);
        
        // All the adjacent cells of the new cavity, temporary array
        var tempFront = voisins(x, y, nx, ny);
        
        // Local frontal cells, close to the cavity
        var newFront = [];
        
        // In adjacent cells, delete cavities (newFront <- tempFront)
        do {
            var cell = tempFront.pop();
            if (!contient(cave, cell)) {
                newFront.push(cell);
            }
        } while (tempFront.length);


        // What will be the next cavity?
        var nextCav;
        
        if (newFront.length) { // We have local adjacent cells
            
            // Take one of them
            nextCav = newFront[randomInt(newFront.length)];
            
        } else { // No more local front cells, let's explore a new branch
            
            // Remove old branch last cavity from the set of frontal cells
            front = retirer(front, nextCav);
            
            if (front.length) { // There are still frontal cells
                
                // Choice of a new cavity from the set of frontal cells
                nextCav = front[randomInt(front.length)];
                
                // Coordinates of this cavity
                x = xVal(nextCav, nx);
                y = yVal(nextCav, nx);
                
                // The set of frontal cells of this cavity
                tempFront = voisins(x, y, nx, ny);
                
                // Initialize the end of loop indicator for the following loop
                cavity = -1;
                
                // Among all the frontal cells of this cavity we are looking
                // for, which one is a cavity? In order to connect this new
                // branch to all the cavities.
                do {
                    var cell = tempFront.pop();
                    if (contient(cave, cell)) { // We just found out which
                        // cavity we're connecting the new branch to
                        
                        // Get the coordinates of this cavity, in order to
                        // remove the wall, later.
                        x = xVal(cell, nx);
                        y = yVal(cell, nx);
                        
                        // It's time to exit the loop
                        cavity = cell;
                    }
                } while (cavity == -1);
                
            } else { // No more frontal cells, the labyrinth is done, yay :-)
                nextCav = -1;
            }
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
                mursH = retirer(mursH,  nx * (y+1) + x );
            }
        }
        
        // Add the cavity to the set of cavities
        cave.push(cavity);
        
        // The new cavity for the next loop
        cavity = nextCav;
        
        // Remove the cavity from the set of new frontal cells
        newFront = retirer(newFront, cavity);
        
        // Remove the cavity from the set of frontal cells
        front = retirer(front, cavity);
        
        // Add the new frontal cells to the set of frontal cells
        while (newFront.length) {
            front = ajouter(front, newFront.pop());
        }
    } while (cavity != -1);
    
    // No labyrinth without its visual representation
    labyDraw(nx, ny, pas, mursH, mursV);
    
    // No representation without a solution
    /*
    pause();
    labySol(nx, ny, pas, mursH, mursV);
    //*/
};

// If we want to calculate an average number of steps per labyrinth
// for (var i = 0; i < 100; i++)
// We get 309 000 steps per labyrinth (without labysol) for:
laby(10, 9, 20);

// laby(8, 4, 40);
// laby(16, 9, 20);
// laby(34, 18, 10);
