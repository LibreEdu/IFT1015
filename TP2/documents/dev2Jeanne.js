/* Fonctions pour le tp2 */


var random = function(n) {

    return Math.floor(Math.random()*n);
    
};

var shuffle = function() {

    var paquet = Array(52).fill(0).map(function(x,i) { return i; });

    for(var i = 51; i > 0; i--) {

	var j = random(i); // indice de la carte Ã  dÃ©placer
	
	var t = paquet[j];
	paquet[j] = paquet[i];
	paquet[i] = t;
	
    }

    return paquet;
    
};

var memeCoul = function(cartes) {

    for (var i = 1; i < cartes.length; i++) {

	if(cartes[i]&3 != cartes[0]&3) return false;

    }

    return true;
    
};

var memeVal = function(cartes) {

    for (var i = 1; i < cartes.length; i++) {

	if(cartes[i]>>2 != cartes[0]>>2) return false;

    }
    
    return true;
    
};

var suite = function(cartes) {

    cartes = cartes.sort();
            
    for(var i = 1; i < cartes.length; i++) {

	if(cartes[i-1]>>2 != cartes[i]>>2 - 1) return true;

    }

    return false;
 
};

var suiteRoyale = function(cartes) {

    cartes = cartes.sort();

    if(cartes[0]>>2 != 0) return false;

    for(var i = 1; i < cartes.length; i++) {
	
	if(cartes[i]>>2 != 32 + i*4) return false;

    }

    return true;
    
};


// Cette fonction prend en paramètre un tableau de 5 chiffres (main)
// et retourne un enregistrement qui contient une liste (deux) avec
// tous les sous-ensembles de 2éléments de main et une autre (trois)
// qui contient tous les sous-ensembles de trois éléments

var subsets = function(main) {

    var subs = {deux: [], trois: []}

    for(var i = 0; i < main.length -1; i++) {
	for(var j = i+1; j < main.length; j++) {

	    // Trois contient un sous-ensemble de 3 cartes de main et
	    // deux contient un sous-ensemble de 2 cartes de main
	    
	    trois = main.slice();

	    deux = trois.splice(i,1);
	    deux = deux.concat(trois.splice(j-1,1));

	    subs.deux.push(deux);
	    subs.trois.push(trois);

	}
    }

    return subs;
        
};


var quinteFlushRoyale = function(main) {

    return (suiteRoyale(main) && memeCoul(main));
    
};

var quinteFlush = function(main) {
    
    return (memeCoul(main) && suite(main));

};

var carre = function(main) {

    for(var i = 0; i < main.length; i++) {

	var cartes = main.slice();

	cartes.splice(i,1);
		
	if(memeVal(cartes)) return true;
	
    };

    return false;
};

var fullHouse = function(main) {

    var subs = subsets(main);
       
    var triple = false; // true si main contient trois cartes de meme valeur
    var pair = false; // true si main contient deux cartes de meme valeur différente de triple

    var tripleVal = -1; // Contient la valeur du triple s'il existe
    
    subs.trois.forEach(function(x) {
	                   if(memeVal(x)) triple = true, tripleVal = x[0]>>2; });

    subs.deux.forEach(function(x) {
	                  if(memeVal(x) && x[0]>>2 != tripleVal) pair = true; }); 
    
    if(triple && pair) return true; else return false;

};

var flush = function(main) {

    return memeCoul(main);
};


var quinte = function(main) {

    return (suiteRoyale(main) || suite(main));

};

var brelan = function(main) {
    
    var subs = subsets(main);

    for(var i = 0; i < subs.trois.length; i++) {

	if(memeVal(subs.trois[i])) return true;
	
    }

    return false;
    
};

var doublePaire = function(main) {

    var subs = subsets(main);

    var paires = 0; // Nombres de paires de cartes trouvés dans la main

    var paireVal = -1; // Valeur de la dernière paire trouvé

    subs.deux.forEach(function(x) { if(memeVal(x) && x[0]>>2 != paireVal) paires += 1; });

    return paires == 2;
    
};

var paire = function(main) {

    var subs = subsets(main);

    for(var i = 0; i < subs.deux.length; i++) {

	if(memeVal(subs.deux.length[i])) return true;
	
    }

    return false;
    
};

var pointsMain = function(main) {

    if(quinteFlushRoyale(main))	return 100;

    else if(quinteFlush(main)) return 75;

    else if(carre(main)) return 50;

    else if(fullHouse(main)) return 25;

    else if(flush(main)) return 20;

    else if(quinte(main)) return 15;

    else if(brelan(main)) return 10;

    else if(doublePaire(main)) return 5;

    else if(paire(main)) return 2;

    else return 0;
    
};

var numToCard = function(n) {

    var val = "";
    var coul = "";

    // Trouver la valeur

    switch(n>>2) {

    case 0:
	val = "A";
	break;
    case 10:
	val = "J";
	break;
    case 11:
	val = "Q";
	break;
    case 12:
	val = "K";
	break;
    default:
	val = n>>2  + 1;
    }

    // Trouver la couleur

    switch(n&3) {

    case 0:
	coul = "C";
	break;
    case 1:
	coul = "D";
	break;
    case 2:
	coul = "H";
	break;
    case 3:
	coul = "S";

    }

    return val + coul;
};









