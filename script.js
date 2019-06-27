// mouvements possibles
const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

// nombre de cases par côté du plan de jeu
var side = 4;

// retient l'état courant du taquin
var current_state = [];

// position de la case vide
const empty_cell = {i: 0, j: 0};


// Initialisation de l'état courant
// manipule les variables globales current_state & empty_cell
function setInitState() {
    current_state = [];
    let val;
    for (let i = 0; i < side; i++) {
        current_state[i] = [];
        for (let j = 0; j < side; j++) {
            if (i === (side - 1) && j === (side - 1)) {
                val = 0;
            } else {
                val = i * side + j + 1;
            }
            current_state[i][j] = val;
        }
    }
    empty_cell.i = side - 1;
    empty_cell.j = side - 1;
}

// bouger la cellule vide en haut, bas, gauche ou droite
// manipule les variables globales current_state & empty_cell
function applyMove(state, ec, move) {
    switch (move) {
        case HAUT:
            if ((ec.i - 1) >= 0) {
                current_state[ec.i][ec.j] = state[ec.i - 1][ec.j];
                empty_cell.i = ec.i - 1;
                current_state[ec.i][ec.j] = 0;
            }
            break;
        case BAS:
            if ((ec.i + 1) <= (side - 1)) {
                current_state[ec.i][ec.j] = state[ec.i + 1][ec.j];
                empty_cell.i = ec.i + 1;
                current_state[ec.i][ec.j] = 0;
            }
            break;
        case GAUCHE:
            if ((ec.j - 1) >= 0) {
                current_state[ec.i][ec.j] = state[ec.i][ec.j - 1];
                empty_cell.j = ec.j - 1;
                current_state[ec.i][ec.j] = 0;
            }
            break;
        case DROITE:
            if ((ec.j + 1) <= (side - 1)) {
                current_state[ec.i][ec.j] = state[ec.i][ec.j + 1];
                empty_cell.j = ec.j + 1;
                current_state[ec.i][ec.j] = 0;
            }
            break;
    }
    displayState(current_state);
    console.log("Movement:", move);
}

//affcher l'état du jeu
function displayState(tab) {
    $(".grid").empty();
    for (let i = 0; i < tab.length; i++) {
        for (let j = 0; j < tab[i].length; j++) {
            const elem = tab[i][j];
            if (elem) {
                const item = $(
                    `<div data-i="${i}" data-j="${j}" class="item">${elem}</div>`
                );
                $(".grid").append(item);
            } else {
                $(".grid").append(`<div class="vide"></div>`);
            }
        }
    }
    console.log(current_state);
}

//vérifier si la partie est gagnée
function checkWin(cs) {

}

//randomiser la partie
function doRandomShuffle(cs, ec) {
    const quality = 10;
    let random = ((Math.random() * quality * side)).toFixed(0);
    for (let i = 0; i < random; i++) {
        let direction = (Math.random() * 4).toFixed(0);
        console.log(direction);
        switch (direction) {
            case 0:
                applyMove(cs, ec, HAUT);
                break;
            case 1:
                applyMove(cs, ec, BAS);
                break;
            case 2:
                applyMove(cs, ec, GAUCHE);
                break;
            case 3:
                applyMove(cs, ec, DROITE);
                break;
        }
    }
}

//l'ordinateur résout le jeu
function findSolution(cs, ec) {

}

//initialise le jeu à la situation "résolue" et l'affiche
function reset() {
    setInitState();
    displayState(current_state);
}

// Pour afficher la fenêtre quand on a gagné, appeler cette fonction
function displayWin() {
    modal.style.display = "block";
}

// ici on bouge au clavier fleché
function checkKey(e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 38:
            applyMove(current_state, empty_cell, HAUT);
            break;
        case 40:
            applyMove(current_state, empty_cell, BAS);
            break;
        case 37:
            applyMove(current_state, empty_cell, GAUCHE);
            break;
        case 39:
            applyMove(current_state, empty_cell, DROITE);
            break;
    }
    displayState(current_state);
    if (checkWin(current_state)) {
        displayWin();
    }
}


// Ici on gère l'ajout dynamique de .item
// ici on bouge en clickant avec la souris
$(".grid").on('click', '.item', function () {
    let data_i = $(this).attr("data-i");
    let data_j = $(this).attr("data-j");
    console.log(
        "Valeur:", $(this).html(),
        "click i:", data_i,
        "click j:", data_j);
    let delta_i = data_i - empty_cell.i;
    let delta_j = data_j - empty_cell.j;
    if (((Math.abs(delta_i) <= 1) || (Math.abs(delta_j) <= 1)) && !(((Math.abs(delta_i) === 1) && (Math.abs(delta_j) === 1)))) {
        console.log("vide bouge");
        switch (delta_i) {
            case 1:
                applyMove(current_state, empty_cell, BAS);
                break;
            case -1:
                applyMove(current_state, empty_cell, HAUT);
                break;
        }
        switch (delta_j) {
            case 1:
                applyMove(current_state, empty_cell, DROITE);
                break;
            case -1:
                applyMove(current_state, empty_cell, GAUCHE);
                break;
        }
    }
});





$(".check").click(function () {
    console.log("Is winning? ", checkWin(current_state));
});

$(".reset").click(reset);

$(".shuffle").click(function () {
    doRandomShuffle(current_state, empty_cell);
    displayState(current_state);
});

$(".solution").click(function () {
    console.log("Solution demandée par l'utilisateur·ice")
    findSolution(current_state, empty_cell);
});

// Pour augmenter la taille d'un côté.
$(".plus").click(function () {
    document.documentElement.style.setProperty("--side", ++side);
    reset();
    console.log("Plus grand")
});

// Pour diminuer la taille d'un côté.
$(".minus").click(function () {
    document.documentElement.style.setProperty("--side", --side);
    reset();
    console.log("Plus petit")
});

// Avec le code ci-dessous, j'ai des problèmes à chaque reset car les item sont
// supprimés.
// Pas de gestion dynamique de .item 
// $(".item").click(function(){
//   console.log("Je n'existe que jusqu'à ma mort dans un reset/ shuffle")
// }

// Quand on clique sur <span> (x), on ferme
$("span").click = function () {
    modal.style.display = "none";
};

// On ferme aussi si on clique n'importe où
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


// Une jolie fenêtre est prévue pour quand on gagne
var modal = document.getElementById("myModal");

// Pour fermer la fenetre avec un "X"
var span = document.getElementsByClassName("close")[0];

// changement de style css en fonction de "side"
document.documentElement.style.setProperty("--side", side);

// Pour récupérer l'appui sur les flèches du clavier
document.onkeydown = checkKey;

// Affichage initial : on fait un reset
reset();
