/* File: ~/script.js
  Homework 5: Making the Scrabble Game
  Modib Qadir, UMass Lowell Computer Science, Modib_qadir@student.uml.edu
  Copyright (c) 2023 by Modib Qadir. All rights reserved. May be freely copied or
  excerpted for educational purposes with credit to the author.
  Updated by MQ on December 13th, 2023.
 */



//I didn't know how to connect the Json File here
var ScrabbleTiles = [  
    {"letter":"A", "value":1, "amount":9},
    {"letter":"B", "value":3, "amount":2},
    {"letter":"C", "value":3, "amount":2},
    {"letter":"D", "value":2, "amount":4},
    {"letter":"E", "value":1, "amount":12},
    {"letter":"F", "value":4, "amount":2},
    {"letter":"G", "value":2, "amount":3},
    {"letter":"H", "value":4, "amount":2},
    {"letter":"I", "value":1, "amount":9},
    {"letter":"J", "value":8, "amount":1},
    {"letter":"K", "value":5, "amount":1},
    {"letter":"L", "value":1, "amount":4},
    {"letter":"M", "value":3, "amount":2},
    {"letter":"N", "value":1, "amount":5},
    {"letter":"O", "value":1, "amount":8},
    {"letter":"P", "value":3, "amount":2},
    {"letter":"Q", "value":10, "amount":1},
    {"letter":"R", "value":1, "amount":6},
    {"letter":"S", "value":1, "amount":4},
    {"letter":"T", "value":1, "amount":6},
    {"letter":"U", "value":1, "amount":4},
    {"letter":"V", "value":4, "amount":2},
    {"letter":"W", "value":4, "amount":2},
    {"letter":"X", "value":8, "amount":1},
    {"letter":"Y", "value":4, "amount":2},
    {"letter":"Z", "value":10, "amount":1},
    {"letter":"_", "value":0, "amount":2}
]

$(document).ready(function(){
    initalizeboard();
    generateTiles();
})

function initalizeboard(){
    createTiles('scrabble-board', 'b', 15);
    createTiles('tile-rack', 't', 7);
}

var score = 0;
var tempScore = 0;

let data = [];

function allowDrop(event) {
    if (event.target && event.target.childNodes.length > 0) {
      return false;
    }
    event.preventDefault();
}
  
function drag(event) {
    if (document.querySelector("#final-score").textContent !== "") {
        event.preventDefault();
        return;
}

    event.dataTransfer.setData('dragID', event.target.id);
    data = [
        event.target.offsetLeft - event.clientX,
        event.target.offsetTop - event.clientY
    ];
}
  
function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('dragID');
    const droppedTile = document.getElementById(data);
    const placementDiv = event.target;

    // Check if the target div is a placement spot and is not already occupied
    if (placementDiv.classList.contains('placement') && placementDiv.children.length === 0) {
        placementDiv.appendChild(droppedTile);
        checkBoard();
    }
}

function createTiles(containerId, prefix, count) {
    const container = document.getElementById(containerId);
    for (let i = 0; i < count; i++) {
        const tile = document.createElement('div');
        tile.className = 'placement';
        tile.id = `${prefix}${i}`;
        tile.setAttribute('ondrop', 'drop(event)');
        tile.setAttribute('ondragover', 'allowDrop(event)');
        container.appendChild(tile);
    }
}

// Generates tiles for beginning
function generateTiles() {
    for (let i = 0; i < 7; i++) {
        let genFirst = tileGenerate();
        if (ScrabbleTiles[genFirst].amount > 0) {
        ScrabbleTiles[genFirst].amount--;
        let letter = ScrabbleTiles[genFirst].letter;
        let value = ScrabbleTiles[genFirst].value;
        $('#t' + i).append('<div class="tile" style="background-image: url(\'./images/Scrabble_Tiles/Scrabble_Tile_' + letter + '.jpg\')" id="drag' + i + '" data-value="' + value + '" draggable="true" ondragstart="drag(event)"></div>');
    }else{
        let newTile = tileGenerate();
        while (ScrabbleTiles[newTile].amount === 0) {
            newTile = tileGenerate();
        }
        let letter = ScrabbleTiles[newTile].letter;
        let value = ScrabbleTiles[newTile].value;
        $('#t' + i).append('<div class="tile" style="background-image: url(\'./images/Scrabble_Tiles/Scrabble_Tile_' + letter + '.jpg\')" id="drag' + i + '" data-value="' + value + '" draggable="true" ondragstart="drag(event)"></div>');
        ScrabbleTiles[newTile].amount--;
        }
    }
}

// Generates random tiles.
function tileGenerate() {
    return Math.floor(Math.random() * 27);
}

// Function for updating the score based on the tiles on the board.
function checkBoard() {
    let doubled = 0;
    let arrayBoard = [];
    for (let i = 0; i < 15; i++) {
        arrayBoard.push(document.querySelector('#b' + i));
    }
    let scoreBoard = document.querySelector('#score-display');
    let temp = 0;
    let intTemp = 0;
    let totalScore = 0;

    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 7; j++) {
            if (arrayBoard[i].contains(document.querySelector('#drag' + j))) {
                temp = document.querySelector('#drag' + j).getAttribute('data-value');
                intTemp = parseInt(temp);
                totalScore += (i === 6 || i === 8) ? intTemp * 2 : intTemp;
                if (i === 2 || i === 12) {
                    doubled = 1;
                }
            }
        }
    }
    
    if (doubled === 1) {
        scoreBoard.innerHTML = "Score: " + (score + totalScore * 2);
        tempScore = score + totalScore * 2;
    }else {
        scoreBoard.innerHTML = "Score: " + (score + totalScore);
        tempScore = score + totalScore;
    }
}

function resetGame() {
    location.reload();
}

$(function () {
    $('#conbtn').click(function () {
        continueRound();
    });
});

$(function () {
    $('#resetbtn').click(function () {
        resetGame();
    });
});

var tilesGenerated = 0; // Track the number of tiles generated

// Function to Continue the round when the button is pressed.
function continueRound() {
    score = tempScore;
    let arrayBoard = [];
    for (let i = 0; i < 15; i++) {
        arrayBoard.push(document.querySelector('#b' + i));
    }

    // Gets rid of everything on the board
    for (let i = 0; i < 15; i++) {
        let parent = document.getElementById("b" + i);
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
    }

    // Tile reset.
    for (let m = 0; m < 7; m++) {
        $('#drag' + m).appendTo('#t' + m);
    }

    //Amount of tiles in a normal scrabble.
    const maxTiles = 100;   

    //Generates each tile and counts it to prevent mores than in the bag 
    for (let j = 0; j < 7; j++) {
        let tGen = tileGenerate();
        if (!document.getElementById('t' + j).children.length > 0) {
            if (ScrabbleTiles[tGen].amount > 0) {
                ScrabbleTiles[tGen].amount--;
                let letter = ScrabbleTiles[tGen].letter;
                let value = ScrabbleTiles[tGen].value;
                $('#t' + j).append('<div class="tile ' + letter + '" id="drag' + j + '" data-value="' + value + '" draggable="true" ondragstart="drag(event)"></div>');
                tilesGenerated++;
                console.log(`Tiles Generated: ${tilesGenerated}`);
            }
        }

        if (tilesGenerated > maxTiles) {
            document.querySelector("#conbtn").setAttribute("disabled", "true");
            document.querySelector("#final-score").textContent = `Final Score: ${score}`;
            document.querySelector("#tiles-left").style.display = "none";
            break;
        }
    }
    
    const tilesLeft = maxTiles - tilesGenerated;
    document.querySelector("#tiles-left").textContent = `Tiles Left: ${tilesLeft}`;
    
}
