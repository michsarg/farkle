"use strict";
/**
 * Description
 * @authors mich0550@protonmail.com
 * @date    2021-06-25 09:33:06
 * @version 1.0.0
 */
// VARIABLES
let p1Total = 0;
let p2Total = 0;
let p1Round = 0;
let p2Round = 0;
let p1Selected = 0;
let p2Selected = 0;
let activeHand = [0, 0, 0, 0, 0, 0];
let selectedDie = [false, false, false, false, false, false];
let bankedDie = [false, false, false, false, false, false];
let turn = "none";
let winScore = 2000;
let gameMode = "none";
let rotateAlt = 0;
// FUNCTIONS
// updates data structure with random values 
// for non-selected and non-banked dice
function roll() {
    let dice = document.getElementsByClassName("die");
    let bustCheckHand = [];
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == false && bankedDie[i] == false) {
            activeHand[i] = getDie();
            bustCheckHand.push(activeHand[i]);
        }
    }
    rotateDie();
    updateView();
    if (bustCheckHand.length > 0) {
        // continues handling of turn in bustCheck function
        bustCheck(bustCheckHand);
    }
    else {
        updateStatus("Play again!", false);
        setTimeout(function () {
            resetActiveHand();
        }, 1500);
    }
}
// resets data structures and visual representations
function resetActiveHand() {
    let dice = document.getElementsByClassName("die");
    for (let i = 0; i < 6; i++) {
        // reset data structures
        activeHand[i] = 0;
        selectedDie[i] = false;
        bankedDie[i] = false;
        // reset visual representation
        dice[i].classList.remove("banked", "selected");
        dice[i].classList.add("notSelected");
    }
    roll();
}
// displays a status overlay for 1s
function updateStatus(message, flashing) {
    document.getElementById("statusmsg").textContent = message;
    let emphasize = null;
    if (flashing == true) {
        let count = 0;
        emphasize = setInterval(function () {
            if (count % 2 == 0) {
                $("#statusmsg").css("text-shadow", "0px 0px 5px khaki");
            }
            else {
                $("#statusmsg").css("text-shadow", "0px 0px");
            }
            count += 1;
        }, 200);
        emphasize;
    }
    else {
        $("#statusmsg").css("text-shadow", "0px 0px");
    }
    $("#status").show();
    setTimeout(function () {
        clearInterval(emphasize);
        $("#status").hide();
    }, 1000);
}
// checks passed hand for bust condition
// and updates game status
function bustCheck(bustCheckHand) {
    let score = getScore(buildDieCount(bustCheckHand), true);
    if (0 == score) {
        updateStatus("Bust!", false);
        if (turn == "p1") {
            p1Round = 0;
            p1Selected = 0;
        }
        else {
            p2Round = 0;
            p2Selected = 0;
        }
        updateScoreBoard();
        if (!winCheck()) {
            setTimeout(function () {
                resetActiveHand();
                progressTurn();
            }, 1000);
        }
    }
}
//
function rotateDie() {
    let dice = document.getElementsByClassName("die");
    for (let i = 0; i < 6; i++) {
        if (dice[i].classList.contains("notSelected")) {
            if (!(gameMode == "pvc" && turn == "p2")) {
                $(dice[i]).addClass("deactivated");
            }
            let distance = Math.round((Math.random() * 1000 % 75));
            let angle = Math.round((Math.random() * 1000 % 180));
            if (i % (rotateAlt % 2) == 0) {
                distance += 75;
            }
            rotateAlt++;
            $(dice[i]).css("transform", "translate(0px, " + distance + "px) rotate(" + angle + "deg)");
            if (!(gameMode == "pvc" && turn == "p2")) {
                $(dice[i]).removeClass("deactivated");
            }
        }
    }
}
// visually updates webpage with data structure values for dice and scores
function updateView() {
    let dice = document.getElementsByClassName("die");
    for (let i = 0; i < dice.length; i++) {
        while (dice[i].firstChild) {
            dice[i].removeChild(dice[i].firstChild);
        }
        let square = document.createElement("i");
        $(square).addClass("fas fa-square fa-stack-1x");
        let circle = document.createElement("i");
        $(circle).addClass("far fa-circle fa-stack-1x");
        $(circle).css("display", "none");
        let diceValue = document.createElement("i");
        $(diceValue).addClass("fas");
        switch (activeHand[i]) {
            case 1:
                $(diceValue).addClass("fa-dice-one");
                break;
            case 2:
                $(diceValue).addClass("fa-dice-two");
                break;
            case 3:
                $(diceValue).addClass("fa-dice-three");
                break;
            case 4:
                $(diceValue).addClass("fa-dice-four");
                break;
            case 5:
                $(diceValue).addClass("fa-dice-five");
                break;
            case 6:
                $(diceValue).addClass("fa-dice-six");
                break;
        }
        $(diceValue).addClass("fa-stack-1x");
        dice[i].setAttribute("title", activeHand[i]);
        dice[i].appendChild(square);
        dice[i].appendChild(diceValue);
        dice[i].appendChild(circle);
    }
    updateScoreBoard();
}
;
// Returns a random value between 1 and 6
function getDie() {
    let numb = Math.random();
    let rand = (numb * 10) % 5;
    rand = Math.round(rand) + 1;
    return rand;
}
;
// returns array of sums of each dice number
// used to detect scoring combos
function buildDieCount(passedHand) {
    // deep copy passed hand
    let inputHand = JSON.parse(JSON.stringify(passedHand));
    let dieCount = [0, 0, 0, 0, 0, 0];
    // build dieCount
    for (let i = 0; i < inputHand.length; i++) { // traverse die values
        for (let j = 0; j < 6; j++) { // traverse counter values
            if (inputHand[i] == (j + 1)) {
                dieCount[j]++;
            }
        }
    }
    return dieCount;
}
// Returns score of the dieCount array passed to it
// disable check disables roll option on non-scoring hand
function getScore(dieCount, disableCheck) {
    let score = 0;
    // full straight
    for (let i = 0; i < 6; i++) {
        if (dieCount[i] != 1) {
            break;
        }
        if (i == 5) {
            dieCount = [0, 0, 0, 0, 0, 0];
            score = 1500;
        }
    }
    // partial straights 1-5
    for (let i = 0; i < 5; i++) {
        if (dieCount[i] != 1) {
            break;
        }
        ;
        if (i == 4) {
            for (let i = 0; i < 5; i++) {
                dieCount[i] -= 1;
            }
            score += 500;
        }
        ;
    }
    // partial straight 2-6
    for (let i = 1; i < 6; i++) {
        if (dieCount[i] != 1) {
            break;
        }
        ;
        if (i == 5) {
            for (let i = 1; i < 6; i++) {
                dieCount[i] -= 1;
            }
            score += 750;
        }
        ;
    }
    // remaining combinations
    for (let i = 0; i < dieCount.length; i++) {
        // more than three of a kind
        if (dieCount[i] >= 3) {
            // for 1s
            if (i == 0) {
                let subScore = 1000;
                dieCount[i] -= 3;
                while (dieCount[i] > 0) {
                    subScore *= 2;
                    dieCount[i] -= 1;
                }
                score += subScore;
            }
            // for 2-6
            else {
                let subScore = ((i + 1) * 100);
                dieCount[i] -= 3;
                while (dieCount[i] > 0) {
                    subScore *= 2;
                    dieCount[i] -= 1;
                }
                score += subScore;
            }
        }
        // single ones
        else if (i == (1 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 100);
            dieCount[i] = 0;
        }
        //single fives
        else if (i == (5 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 50);
            dieCount[i] = 0;
        }
    }
    // dieCount now only contains non-scoring die
    if (disableCheck == true) {
        disableRollOnNonScore(dieCount);
    }
    return score;
}
// Disable rolls if non-scoring die are selected
function disableRollOnNonScore(dieCount) {
    let nonScoreDie = 0;
    for (let i = 0; i < 6; i++) {
        if (dieCount[i] != 0) {
            nonScoreDie++;
        }
    }
    if (nonScoreDie > 0) {
        $("#scoreRoll").addClass("disabled");
        $("#scorePass").addClass("disabled");
    }
    else {
        $("#scoreRoll").removeClass("disabled");
        $("#scorePass").removeClass("disabled");
    }
}
// returns score of selected die only
function getSelectedScore() {
    let selectedHand = [];
    // get only selected values
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == true && bankedDie[i] == false) {
            selectedHand[i] = activeHand[i];
        }
    }
    let dieCount = buildDieCount(selectedHand);
    return getScore(dieCount, true);
}
// updates webpage with score values
function updateScoreBoard() {
    document.getElementById("p1Total").textContent = String(p1Total);
    document.getElementById("p1Round").textContent = String(p1Round);
    document.getElementById("p1Selected").textContent = String(p1Selected);
    document.getElementById("p2Total").textContent = String(p2Total);
    document.getElementById("p2Round").textContent = String(p2Round);
    document.getElementById("p2Selected").textContent = String(p2Selected);
}
// checks if a player has won and shows winScreen
function winCheck() {
    if (p1Total >= winScore) {
        let winTextElement = document.getElementById("winText");
        winTextElement.value = "player 1 wins";
        $("#winScreen").show();
        $("#status, #rules").hide();
        $(".die, #playButtons").addClass("blurred deactivated");
        $("#p1name, #p2name").removeClass("simple-highlight");
        return true;
    }
    else if (p2Total >= winScore) {
        let winTextElement = document.getElementById("winText");
        winTextElement.value = "player 2 wins";
        $("#winScreen").show();
        $("#status, #rules").hide();
        $(".die, #playButtons").addClass("blurred deactivated");
        $("#p1name, #p2name").removeClass("simple-highlight");
        return true;
    }
    else
        return false;
}
// resets game variables to start state
function resetToStart() {
    p1Total = 0;
    p2Total = 0;
    p1Round = 0;
    p2Round = 0;
    p1Selected = 0;
    p2Selected = 0;
    activeHand = [0, 0, 0, 0, 0, 0];
    selectedDie = [false, false, false, false, false, false];
    bankedDie = [false, false, false, false, false, false];
    turn = "none";
    gameMode = "none";
    rotateAlt = 0;
    let titleScreenElement = document.getElementById("titleScreen");
    titleScreenElement.style.display = "block";
    let boardContainerElement = document.getElementById("boardContainer");
    boardContainerElement.style.display = "block";
    $(".die").hide();
    $("#status").hide();
    roll();
}
// passes turn between players and updates webpage with this
function progressTurn() {
    if (turn == "p1") {
        turn = "p2";
        updateStatus("Player 2", false);
        $("#p1name").removeClass("simple-highlight");
        $("#p2name").addClass("simple-highlight");
        if (gameMode == "pvc") {
            //disable dick click on p2 play pvc
            $(".die").addClass("deactivated");
        }
    }
    else {
        turn = "p1";
        updateStatus("Player 1", false);
        $("#p1name").addClass("simple-highlight");
        $("#p2name").removeClass("simple-highlight");
        if (gameMode == "pvc") {
            //enable dice click on p1 play pvc
            $(".die").removeClass("deactivated");
        }
    }
    resetActiveHand();
    if (gameMode == "pvc" && turn == "p2") {
        computerPlay();
    }
}
// begin a game by showing board and alerting first player
function startGame(selectedMode) {
    let titleScreenElement = document.getElementById("titleScreen");
    titleScreenElement.style.display = "none";
    gameMode = selectedMode;
    //start the game
    setTimeout(function () { updateStatus("Lets Play!", false); }, 0);
    setTimeout(function () { progressTurn(); }, 1500);
    setTimeout(function () {
        $("#playableBoard").show();
        $("#menuStatus").show();
        $("#quitScreen").hide();
        $("#titleScreen").hide();
    }, 0);
    setTimeout(function () { $(".die").show(); }, 1000);
}
// plays one simple scoring move for the computer player
function computerPlay() {
    // exit function if bust roll is made
    if (0 == getScore(buildDieCount(activeHand), false)) {
        return;
    }
    // queue of clicks to be played
    let clickQueue = [];
    // create array of playable/non-banked dice
    let playableHand = [];
    for (let i = 0; i < 6; i++) {
        if (bankedDie[i] == false) {
            playableHand[i] = activeHand[i];
        }
        else {
            playableHand[i] = -1;
        }
    }
    let dieCount = buildDieCount(playableHand);
    let dice = document.getElementsByClassName("die");
    //detect triples
    for (let i = 0; i < 6; i++) {
        // find more than 3 of the same dice via dieCount
        // dieCount[5] = 3 means there are 3x die with number 6
        if (dieCount[i] >= 3) {
            // iterate over every dice in the playable hand
            for (let j = 0; j < 6; j++) {
                // this will select the first three, but cant do double triples
                if (playableHand[j] == (i + 1) && clickQueue.length <= 3) {
                    // queue a click for the die with the matching number
                    let diceJElement = dice[j];
                    clickQueue.push(diceJElement);
                }
            }
        }
    }
    // if no triples try ones or fives
    if (clickQueue.length == 0) {
        // select all ones
        if (dieCount[0] > 0) {
            for (let i = 0; i < 6; i++) {
                if (playableHand[i] == 1) {
                    let diceIElement = dice[i];
                    clickQueue.push(diceIElement);
                }
            }
        }
        // select all fives
        if (dieCount[4] > 0) {
            for (let i = 0; i < 6; i++) {
                if (playableHand[i] == 5) {
                    let diceIElement = dice[i];
                    clickQueue.push(diceIElement);
                }
            }
        }
    }
    // add final click to scorePass to end turn
    let scorePassElement = document.getElementById('scorePass');
    clickQueue.push(scorePassElement);
    let runClicks = setInterval(function () {
        // stop clicking if the turn is over
        if (turn != "p2") {
            clearInterval(runClicks);
            return;
        }
        // if its still the players round and no clicks left, 
        // this is an error state and shouldnt be reached
        else if (clickQueue.length == 0) {
            clearInterval(runClicks);
            return;
        }
        // else there are clicks left
        else if (clickQueue.length > 0) {
            // perform the next queued click
            let element = clickQueue.shift();
            element.click();
        }
    }, 1000);
    if (turn == "p2") {
        runClicks;
    }
    return;
}
// run game
$(() => {
    $("#titleScreen").show();
    $("#playableBoard").hide();
    $("#menuStatus").hide();
    $("#status, #rules").hide();
    resetToStart();
    //title screen start buttons
    $("#pvc").on('click', () => { startGame("pvc"); });
    $("#pvp").on('click', () => { startGame("pvp"); });
    // quit button
    $("#quit").on('click', () => {
        $("#playableBoard").hide();
        $("#menuStatus").hide();
        $("#status, #rules").hide();
        $("#winScreen").hide();
        $("#quitScreen").show();
    });
    $("#chooseQuit").on('click', () => {
        $("#quitScreen").hide();
        resetToStart();
    });
    $("#chooseResume").on('click', () => {
        $("#quitScreen").hide();
        $("#playableBoard").show();
        $("#menuStatus").show();
    });
    $("#returnMenu").on('click', () => {
        $("#winScreen").hide();
        $("#playableBoard").hide();
        $("#menuStatus").hide();
        $(".die, #playButtons").removeClass("blurred deactivated");
        resetToStart();
    });
    $("#hideRules").on('click', () => {
        $("#rules").hide();
        $("#playableBoard").show();
        $("#menuStatus").show();
    });
    $("#help").on('click', () => {
        $("#playableBoard").hide();
        $("#menuStatus").hide();
        $("#status").hide();
        $("#winScreen").hide();
        $("#titleScreen").hide();
        $("#rules").show();
    });
    // bank score from selected die and roll again
    $("#scoreRoll").on('click', () => {
        let dice = document.getElementsByClassName("die");
        for (let i = 0; i < 6; i++) {
            if (selectedDie[i] == true) {
                bankedDie[i] = true;
                // update html display to show banked
                $(dice[i]).addClass("banked");
                $(dice[i]).removeClass("selected");
                $(dice[i]).css("transform", "translate(0px, 190px) rotate(0deg");
            }
        }
        // update scoreboard
        if (turn == "p1") {
            p1Round += p1Selected;
            p1Selected = 0;
        }
        else {
            p2Round += p2Selected;
            p2Selected = 0;
        }
        updateView();
        updateScoreBoard();
        // call to reroll unselected die
        roll();
    });
    // bank score from selected die and pass turn
    $("#scorePass").on('click', () => {
        let dice = document.getElementsByClassName("die");
        for (let i = 0; i < 6; i++) {
            if (selectedDie[i] == true) {
                bankedDie[i] = true;
                // update html display to show banked
                dice[i].classList.remove("selected");
                dice[i].classList.add("banked");
            }
        }
        if (turn == "p1") {
            p1Total += p1Round;
            p1Total += p1Selected;
            updateStatus((p1Round + p1Selected) + " points", true);
            p1Round = 0;
            p1Selected = 0;
        }
        else {
            p2Total += p2Round;
            p2Total += p2Selected;
            updateStatus((p2Round + p2Selected) + " points", true);
            p2Round = 0;
            p2Selected = 0;
        }
        updateScoreBoard();
        if (!winCheck()) {
            setTimeout(function () {
                progressTurn();
            }, 1000);
        }
    });
    // select a die
    $(".die").on('click', function (e) {
        let element = e.target;
        // refers to parent if clicked element is not die
        // requred due to player clicks being detected as child nodes
        if (!e.target.classList.contains("die")) {
            element = e.target.parentElement;
        }
        // do nothing if die is banked
        if (element.classList.contains("banked")) {
            return;
        }
        // update class of clicked die & presentation
        $(element).toggleClass("selected notSelected");
        $(element.childNodes[2]).toggle(); // apply circle selected
        // update data structure of clicked die
        let dice = Array.from(document.getElementsByClassName("die"));
        let pos = jQuery.inArray(element, dice);
        selectedDie[pos] = !selectedDie[pos];
        //update selected menu value
        turn == "p1" ? p1Selected = getSelectedScore() : p2Selected = getSelectedScore();
        updateScoreBoard();
    });
});
