// Une jolie fenêtre est prévue pour quand on gagne
const modal = document.getElementById("myModal");

// Pour fermer la fenetre avec un "X"
const span = document.getElementsByClassName("close")[0];

// mouvements possibles
const HAUT = "H";
const BAS = "B";
const DROITE = "D";
const GAUCHE = "G";

// nombre de cases par côté du plan de jeu
let side = 3;

// string identifiant du tableau gagnant
let solutionID = "";

// retient l'état courant du taquin
let current_state = [];
// position de la case vide
let empty_cell = {i: 0, j: 0};
// historique des mouvements depuis le dernier reset
let current_state_history = [];
let gameState = {ec: empty_cell, cs: current_state, csh: current_state_history};


// initialise le jeu à la situation "résolue" et l'affiche, crée l'identifiant de la solution
function reset() {
    setInitState();
    solutionID = current_state_id(gameState.cs);
    gameState.csh = [];
    // console.log("le " + typeof solutionID + " identifiant unique de la solution gagnante est: " + solutionID);
    displayState(gameState.cs);
}

// retourne le string identifiant unique du jeu cs
function current_state_id(cs) {
    return cs.toString();
}

// Initialisation de l'état courant
// écrit dans les variables globales
function setInitState() {
    gameState.cs = [];
    let val;
    for (let i = 0; i < side; i++) {
        gameState.cs[i] = [];
        for (let j = 0; j < side; j++) {
            if (i === (side - 1) && j === (side - 1)) {
                val = 0;
            } else {
                val = i * side + j + 1;
            }
            gameState.cs[i][j] = val;
        }
    }
    gameState.ec.i = side - 1;
    gameState.ec.j = side - 1;
}

// maj vars globales gameState
function updateGameState(cs, ec, move) {
    let temp = applyMove(cs, ec, move);
    gameState.cs = temp.cs.map(val => val);
    gameState.ec = temp.ec;
    gameState.csh.push(temp.move);
    displayState(gameState.cs);
}

// maj vars globales gameState
function updateGameStateNoHistory(cs, ec, move) {
    console.log("toto");
    let temp = applyMove(cs, ec, move);
    gameState.cs = temp.cs.map(val => val);
    // gameState.cs = [...temp.cs];
    console.log(temp.cs);
    console.log(gameState.cs);
    gameState.ec = temp.ec;
    displayState(gameState.cs);
}

// afficher l'état du jeu
function displayState(cs) {
    $(".grid").empty();
    for (let i = 0; i < cs.length; i++) {
        for (let j = 0; j < cs[i].length; j++) {
            const elem = cs[i][j];
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
    // console.log(cs);
}

// bouger la cellule vide en haut, bas, gauche ou droite
function applyMove(cs, ec, move) {
    switch (move) {
        case HAUT:
            if ((ec.i - 1) >= 0) {
                cs[ec.i][ec.j] = cs[ec.i - 1][ec.j];
                ec.i = ec.i - 1;
                cs[ec.i][ec.j] = 0;
            }
            break;
        case BAS:
            if ((ec.i + 1) <= (side - 1)) {
                cs[ec.i][ec.j] = cs[ec.i + 1][ec.j];
                ec.i = ec.i + 1;
                cs[ec.i][ec.j] = 0;
            }
            break;
        case GAUCHE:
            if ((ec.j - 1) >= 0) {
                cs[ec.i][ec.j] = cs[ec.i][ec.j - 1];
                ec.j = ec.j - 1;
                cs[ec.i][ec.j] = 0;
            }
            break;
        case DROITE:
            if ((ec.j + 1) <= (side - 1)) {
                cs[ec.i][ec.j] = cs[ec.i][ec.j + 1];
                ec.j = ec.j + 1;
                cs[ec.i][ec.j] = 0;
            }
            break;
    }
    return {ec: ec, cs: cs, move: move};
}

// vérifier si la partie est gagnée
function checkWin(cs) {
    console.log("le " + typeof current_state_id(cs) + " identifiant unique de l'état courant est : " + current_state_id(cs));
    if (current_state_id(cs) === solutionID) {
        displayWin();
        return "yes";
    } else {
        return "no";
    }
}

// modifies global var and displays
function doRandomShuffle() {
    const quality = 20;
    const random = Math.trunc(Math.random() * quality * side);
    const available_movements = [HAUT, BAS, DROITE, GAUCHE];
    for (let i = 0; i < random; i++) {
        const direction = Math.trunc(Math.random() * 4);
        const randomMove = available_movements[direction];
        updateGameState(gameState.cs, gameState.ec, randomMove);
    }
}

// solves the game
function findSolution(gs) {
    let resolveMethod = prompt("1. for playback\n2. for further use", "1");
    switch (resolveMethod) {
        case "1":
            console.log("solution by movement playback");
            playMovesBack(gs);
            break;
        case "2":
            console.log("solution by Breadth-first search");
            break;
        default:
            console.log("solution by Depth-first search");
    }
}

// rejoue l'inverse de la sequence joue depuis le dernier reset
function playMovesBack(gs) {
    console.log(gs.csh);
    const reverseMoves = {
        "H": BAS,
        "B": HAUT,
        "D": GAUCHE,
        "G": DROITE,
    };
    let reverseSequence = gameState.csh.map(move => reverseMoves[move]).reverse();
    console.log(reverseSequence);
    reverseSequence.forEach(move => {
        console.log("titi");
        console.log(move);
        updateGameStateNoHistory(gameState.cs, gameState.ec, move);
    });
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
            updateGameState(gameState.cs, gameState.ec, HAUT);
            break;
        case 40:
            updateGameState(gameState.cs, gameState.ec, BAS);
            break;
        case 37:
            updateGameState(gameState.cs, gameState.ec, GAUCHE);
            break;
        case 39:
            updateGameState(gameState.cs, gameState.ec, DROITE);
            break;
    }
    checkWin(gameState.cs);
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
    let delta_i = data_i - gameState.ec.i;
    let delta_j = data_j - gameState.ec.j;
    if (((Math.abs(delta_i) <= 1) || (Math.abs(delta_j) <= 1)) && !(((Math.abs(delta_i) === 1) && (Math.abs(delta_j) === 1)))) {
        console.log("vide bouge");
        switch (delta_i) {
            case 1:
                updateGameState(gameState.cs, gameState.ec, BAS);
                break;
            case -1:
                updateGameState(gameState.cs, gameState.ec, HAUT);
                break;
        }
        switch (delta_j) {
            case 1:
                updateGameState(gameState.cs, gameState.ec, DROITE);
                break;
            case -1:
                updateGameState(gameState.cs, gameState.ec, GAUCHE);
                break;
        }
    }
});


$(".check").click(function () {
    console.log("Is winning? ", checkWin(gameState.cs));
});

$(".reset").click(reset);

$(".shuffle").click(function () {
    doRandomShuffle();
});

$(".solution").click(function () {
    console.log("Solution demandée par l'utilisateur·ice");
    console.log(gameState);
    findSolution(gameState);
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

// Quand on clique sur <span> (x), on ferme
span.onclick = function () {
    modal.style.display = "none";
};

// On ferme aussi si on clique n'importe où
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


// changement de style css en fonction de "side"
document.documentElement.style.setProperty("--side", side);

// Pour récupérer l'appui sur les flèches du clavier
document.onkeydown = checkKey;

// Affichage initial : on fait un reset
reset();
