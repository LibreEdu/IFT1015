/******************************************************************
 * *
 * note: this group of functions draw a maze
 * using two arrays is perfectly functional
 * 
 * was not included in the TP1 because we used the functions
 * Alexander used to debug the whole algoritm
 * 
 */

///////////////////////
// not include -contient- just for testing
////////////////////////

var contient = function(tab, x) {
    
    var i = 0;
    while (i < tab.length) {
        if (tab[i++] == x) {
            return true;
        }
    }
    return false;
};

// var mursH = [1,2,3,4,5,6,7,8,10,13,14,16,17,23,30,31,32,33,34,35,36,37,38] ;

// var mursV = [0,4,8,9,12,13,14,15,17,18,21,23,26,27,28,29,30,31,32,35] ;

var mursH = [1,2,3,4,5,6,7,13,14,17,19,24,30,31,32,33,34,35,36,37,38];
var mursV = [0,1,3,4,8,9,11,12,14,16,17,18,20,21,22,23,24,26,27,29,32,35];

///////////////////////////////////////////////////////////
var NX = 8;
var NY = 4;
var pas = 40 ;

var ranHor = NY + 1 ;
var ranVer = NX + 1 ;

const ANG_MUR_HOR = 90 ;
const ANG_MUR_VER = 180 ;

const DIR_HOR = 0 ;
const DIR_VER = 1 ;

const START = 1 ;
const STOP = 0 ;

var sauter = function(arlong){
    pu();
    fd(arlong);
    pd();
};

var dessinerDroite = function(arlong){
    pd();
    fd(arlong);
    pu(); 
};

var tortueOriginLab = function (directionMur, switchTort){
    
    var angTour ;

    pu();
    mv(-(NX/2)*pas, (NY/2)*pas);
    pd();
  
    directionMur == DIR_HOR ? angTour = ANG_MUR_HOR : angTour = ANG_MUR_VER ;

    switchTort == STOP ? angTour = angTour * (-1) : angTour = angTour ;

    rt(angTour); 

} ;

var tortueDansVoi = function (voi, dirMur){

    if( dirMur == DIR_HOR ){
 
        mv(-(NX/2)*pas, (NY/2)*pas - (voi*pas));
        
    } else { // vert

        mv(-(NX/2)*pas + (voi*pas), (NY/2)*pas );

    }

} ;

var traceMur = function (tblSeqMurs, argpas){
       
    var long = argpas ;
    
    // les murs plus longues qu'une cellule 
    // se dessinent avec une droite unique 
    for(var elemDessiner = 0; elemDessiner < tblSeqMurs.length ; elemDessiner ++){

        if(elemDessiner > 0){
            // accumuler la longeur 
            if( tblSeqMurs [elemDessiner] ==  tblSeqMurs [elemDessiner - 1] ){
              
                long += argpas ;

            } else { // sino
    
                tblSeqMurs [elemDessiner - 1] == 0 ? sauter (long) : dessinerDroite(long)  ;
        
                //  reinitialise la longueur 
                // du droite ou de saute
                long = argpas;
    
            } // fin
            
            //dernier element
            if(elemDessiner == tblSeqMurs.length - 1){

                tblSeqMurs [elemDessiner] == 0 ? sauter (long) : dessinerDroite(long)  ;

            }

        }

    }  // proximo elemento

} ;


var dessineEnsembleMurs = function (argtblMurs,qttVoiMurs,dirVoi){

    // argument de la function traceMur
    var tblMursDessiner ; // [0,1,1,1,0.0,1,1]
    
    tortueOriginLab(dirVoi, START);
  
    for (var compteVoi = 0 ; compteVoi < qttVoiMurs ; compteVoi ++ ) {
    
        tblMursDessiner = [] ;

        // horiz = 1, vert NX
        var murChercher ;
        
        if( dirVoi == DIR_HOR){

            // cree un tableau [011110101] pour signaler vide et murs
            for (var compteMur = (compteVoi * NX) ; compteMur < ((compteVoi * NX)+ NX) ; compteMur++){
                
                if( contient (argtblMurs, compteMur)){
    
                    tblMursDessiner.push(1);
    
                } else { //         sino
    
                    tblMursDessiner.push(0);    
    
                } //  fin

            } //  proximo muro
    
        } else { // vertical

            for (var compteMur = 0 ; compteMur < NY ; compteMur++){
              
                if( compteMur  != 0 ) {
    
                    murChercher  =  (compteMur * ranVer) + compteVoi ;
    
                }else{
    
                    murChercher  =  compteVoi ;
    
                };
    
                if( contient (argtblMurs, murChercher)){ // ver
    
                    tblMursDessiner.push(1);
    
                } else { //         sino
    
                    tblMursDessiner.push(0);    
    
                } //  fin
            
            } //  proximo muro
        };
        
        tortueDansVoi (compteVoi, dirVoi);
           
        traceMur(tblMursDessiner, pas );
        
    } // proxima fila de muros 

    tortueOriginLab(dirVoi, STOP);

} ;// fonct

 dessineEnsembleMurs(mursH, ranHor, DIR_HOR);
 dessineEnsembleMurs(mursV, ranVer,DIR_VER);
