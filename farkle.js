/**
 * Description
 * @authors Your Name (you@example.org)
 * @date    2021-06-25 09:33:06
 * @version 1.0.0
 */



// VARIABLES
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
winScore = 2000;
gameMode = "none";
roll();

// FUNCTIONS

// updates data structure with random values 
// for non-selected non-banked dice
function roll() {
    let dice = document.getElementsByClassName("die");
    let bustCheckHand = [];
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == false && bankedDie[i] == false) {
            activeHand[i] = getDie(i);
            bustCheckHand.push(activeHand[i]);
        }
    }
    updateView();
    rotateDie();

    if (bustCheckHand.length > 0) {
        // continues handling of turn in bustCheck function
        bustCheck(bustCheckHand);
    } else {
        updateStatus("Play again!");
        setTimeout(function() {
            resetActiveHand();
        }, 1500);
    }
}

function resetActiveHand() {
    let dice = document.getElementsByClassName("die");
    for (let i = 0; i < 6; i++) {
        activeHand[i] = 0;
        selectedDie[i] = false;
        bankedDie[i] = false;
        dice[i].classList.remove("banked", "selected");
        dice[i].classList.add("notSelected");
    }
    roll();
}

function updateStatus(message) {
    document.getElementById("statusmsg").innerHTML = message;
    $("#status").show();
    setTimeout(function() { $("#status").hide() }, 1000);
}

// checks passed hand for bust condition
// and updates game status
function bustCheck(bustCheckHand) {
    console.log("bustCheck");
    score = getScore(bustCheckHand);
    if (0 == score) {
        updateStatus("Bust!");
        if (turn == "p1") {
            p1Round = 0;
            p1Selected = 0;
        } else {
            p2Round = 0;
            p2Selected = 0;
        }
        updateView();
        setTimeout(function() {
            resetActiveHand();
            progressTurn();
        }, 1500);
    }
}

function rotateDie() {
    dice = document.getElementsByClassName("die");
    for (let i = 0; i < 6; i++) {
        if (dice[i].classList.contains("notSelected")) {
            distance = Math.round((Math.random() * 1000 % 75));
            angle = Math.round((Math.random() * 1000 % 180));
            //improve spacings
            if (i % 2 == 0) {
                distance += 75;
            }
            $(dice[i]).css("transform", "translate(0px, " + distance + "px) rotate(" + angle + "deg)");
        }
    }
}

// updates webpage with data structure values
function updateView() {

    let dice = document.getElementsByClassName("die");
    let circle = document.createElement("i");
    $(circle).addClass("far", "fa-circle", "fa-stack-1x");

    // remove previous dice
    for (let i = 0; i < dice.length; i++) {

        //remove all pre existing child nodes
        while (dice[i].firstChild) {
            dice[i].removeChild(dice[i].firstChild)
        }


        let square = document.createElement("i");
        $(square).addClass("fas fa-square fa-stack-1x");


        let circle = document.createElement("i");
        $(circle).addClass("far fa-circle fa-stack-1x");

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
        $(circle).hide();
    }
    updateScoreBoard();
};

// Returns a random value between 1 and 6
function getDie(position) {
    let numb = Math.random();
    let rand = (numb * 10) % 5;
    rand = Math.round(rand) + 1;
    return rand;
};

// Returns score of hand passed to it
// called to detect busts
// called to detect if valid hand only has been selected
function getScore(passedHand) {

    // deep copy passed hand
    let inputHand = JSON.parse(JSON.stringify(passedHand));
    let dieCount = [0, 0, 0, 0, 0, 0];
    let score = 0;

    // build dieCount
    for (let i = 0; i < inputHand.length; i++) { // traverse die values
        for (let j = 0; j < 6; j++) { // traverse counter values
            if (inputHand[i] == (j + 1)) {
                dieCount[j]++;
            }
        }
    }

    // console.log("dieCount: " + dieCount);
    // console.log("inputHand: " + inputHand);
    // console.log("inputHand.length: " + inputHand.length);

    // full straight
    for (let i = 0; i < 6; i++) {
        if (dieCount[i] != 1) {
            // console.log("full straight not detected");
            break;
        }
        if (i == 5) {
            // console.log("full straight detected");
            //disableRollOnNonScore(dieCount);
            dieCount = [0, 0, 0, 0, 0, 0];
            score = 1500;
        }
    }

    // partial straights
    // console.log("checking for straights");
    // partial straight 1-5
    for (let i = 0; i < 5; i++) {
        if (dieCount[i] != 1) {
            // console.log("PS 1-5 not detected");
            break
        };
        if (i == 4) {
            for (let i = 0; i < 5; i++) {
                dieCount[i] -= 1;
            }
            score += 500;
            // console.log("PS 1-5 detected");
            // console.log("PS dieCount: " + dieCount);
        };
    }
    // partial straight 2-6
    for (let i = 1; i < 6; i++) {
        if (dieCount[i] != 1) {
            console.log("PS 2-6 not detected");
            break
        };
        if (i == 5) {
            for (let i = 1; i < 6; i++) {
                dieCount[i] -= 1;
            }
            score += 750
            console.log("partial straight 2-6 detected");
        };
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

    disableRollOnNonScore(dieCount, score);
    console.log("score: " + score);
    console.log("dieCount: " + dieCount);
    return score;
}

// Disable roll options if non-scoring die are selected
function disableRollOnNonScore(dieCount, score) {

    let nonScoreDie = 0;
    for (let i = 0; i < 6; i++) {
        if (dieCount[i] != 0) {
            nonScoreDie++;
            console.log("nonScoreDie: " + nonScoreDie);
        }
    }
    //is player has selected non-scoring die
    if (nonScoreDie > 0) {
        $("#scoreRoll").addClass("disabled");
        $("#scorePass").addClass("disabled");
    } else {
        $("#scoreRoll").removeClass("disabled");
        $("#scorePass").removeClass("disabled");
    }
}

// returns score of selected die only
function getSelectedScore() {
    selectedHand = [];
    // get only selected values
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == true && bankedDie[i] == false) {
            selectedHand[i] = activeHand[i];
        }
    }
    console.log("getSelectedHand");
    return getScore(selectedHand);
}

// updates html with score variables
function updateScoreBoard() {
    document.getElementById("p1Total").innerHTML = p1Total;
    document.getElementById("p1Round").innerHTML = p1Round;
    document.getElementById("p1Selected").innerHTML = p1Selected;
    document.getElementById("p2Total").innerHTML = p2Total;
    document.getElementById("p2Round").innerHTML = p2Round;
    document.getElementById("p2Selected").innerHTML = p2Selected;
    winCheck();
}

function winCheck() {
    if (p1Total >= winScore) { alert("Player 1 wins") }
    if (p2Total >= winScore) { alert("Player 2 wins") }
    //reset game state

}


function progressTurn() {
    if (turn == "p1") {
        turn = "p2";
        updateStatus("Player 2");
        $("#p1name").removeClass("simple-highlight");
        $("#p2name").addClass("simple-highlight");
    } else {
        turn = "p1"
        updateStatus("Player 1");
        $("#p1name").addClass("simple-highlight");
        $("#p2name").removeClass("simple-highlight");
    }

    resetActiveHand();
}


function startGame(mode) {

    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("boardContainer").style.display = "block";
    $(".die").toggle();

    if (mode == "pvc") {
        //updateStatus("player vs computer")
    } else if (mode == "pvp") {
        //updateStatus("player vs player")
    }
    //start the game
    setTimeout(function() { updateStatus("Lets Play!"); }, 0);
    setTimeout(function() { progressTurn(); }, 2000);
    setTimeout(function() { $(".die").toggle(); }, 2000);

}

// run game
$(document).ready(function() {

    //title screen start buttons
    $("#pvc").click(function() { startGame("pvc") });
    $("#pvp").click(function() { startGame("pvp") });

    // quit button
    // dummy position now for reset hand
    $("#quit").click(function() {
        resetActiveHand();
    });

    // listener for scoreRoll button/method
    // can assume that only scoring dice have been selected
    $("#scoreRoll").click(function() {
        dice = document.getElementsByClassName("die");
        for (let i = 0; i < 6; i++) {
            if (selectedDie[i] == true) {
                bankedDie[i] = true;
                // update html display to show banked
                $(dice[i]).addClass("banked");
                $(dice[i]).removeClass("selected");
                // $(dice[i]).css("transition", "0.5s");
                $(dice[i]).css("transform", "translate(0px, 190px) rotate(0deg");
            }
        }
        // console.log("banked: " + bankedDie);
        // update scoreboard
        if (turn == "p1") {
            p1Round += p1Selected;
            p1Selected = 0;
        } else {
            p2Round += p2Selected;
            p2Selected = 0;
        }
        updateScoreBoard();
        // call to reroll unselected die
        roll();

    });

    $("#scorePass").click(function() {
        dice = document.getElementsByClassName("die");
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
            p1Round = 0;
            p1Selected = 0;
        } else {
            p2Total += p2Round;
            p2Total += p2Selected;
            p2Round = 0;
            p2Selected = 0;
        }
        updateScoreBoard();
        // next turn
        progressTurn();
    });


    // click on a die
    $(".die").click(function() {

        // do nothing if die is banked
        if ((this).classList.contains("banked")) { return }

        // update class of clicked die & presentation
        $((this)).toggleClass("selected notSelected");
        $((this).childNodes[2]).toggle(); // apply circle selected

        // update data structure of clicked die
        let dice = document.getElementsByClassName("die");
        let pos = jQuery.inArray((this), dice);
        selectedDie[pos] = !selectedDie[pos];

        //update selected menu value
        turn == "p1" ? p1Selected = getSelectedScore() : p2Selected = getSelectedScore();
        updateScoreBoard();
    });


    $("#magicDie").click(function() {
        activeHand = [1, 2, 3, 4, 5, 6];
        selectedDie = [false, false, false, false, false, false];
        bankedDie = [false, false, false, false, false, false];
        updateView();
    });

    $(".die").hover(function() {

    });


});
//MISCELLANEOUS TESTS

// tests score function
function testScore(testHand) {
    let thisHand = testHand;
    let thisScore = getScore(thisHand);
    // console.log("thisScore: " + thisScore);
    alert(thisScore);
}

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
}

function clickTest() {
    alert("clicked");
}