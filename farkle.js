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



// FUNCTIONS

// updates data structure with random values 
// for non-selected non-banked dice
function roll() {

    //resetDieTop();
    let dice = document.getElementsByClassName("die");
    let bustCheckHand = [];
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == false && bankedDie[i] == false) {
            activeHand[i] = getDie(i);
            bustCheckHand.push(activeHand[i]);
        }
    }

    setTimeout(function() { updateView(); }, 1000);
    rotateDie();

    if (bustCheckHand.length > 0) {
        // continues handling of turn in bustCheck function
        setTimeout(function() { bustCheck(bustCheckHand); }, 2000);

    } else {
        updateStatus("Play again!");
        setTimeout(function() {
            resetActiveHand();
        }, 1500);
    }
}


// Hides die, resets data structures, visual representations
// then rolls and shows die
function resetActiveHand() {
    console.log("resetActiveHand called");
    $(".die").css("transition", "0.0s");
    $(".die").hide();
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
    setTimeout(function() {
        roll();
        $(".die").show();
        $(".die").css("transition", "0.5s");
    }, 1500);
}

function updateStatus(message) {
    document.getElementById("statusmsg").innerHTML = message;
    $("#status").show();
    setTimeout(function() { $("#status").hide() }, 1000);
}

// checks passed hand for bust condition
// and updates game status
function bustCheck(bustCheckHand) {
    // console.log("bustCheck");
    let score = getScore(buildDieCount(bustCheckHand), true);
    // submission of dice does determination of disabling
    if (0 == score) {
        updateStatus("Bust!");

        if (turn == "p1") {
            p1Round = 0;
            p1Selected = 0;
        } else {
            p2Round = 0;
            p2Selected = 0;
        }
        updateScoreBoard();
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
            if (!(gameMode == "pvc" && turn == "p2")) {
                $(dice[i]).addClass("deactivated");
            }
            setTimeout(function() {
                distance = Math.round((Math.random() * 1000 % 75));
                angle = Math.round((Math.random() * 1000 % 180));
                //improve spacings
                if (i % 2 == 0) { distance += 75; }
                $(dice[i]).css("transform", "translate(0px, " + distance + "px) rotate(" + angle + "deg)");
                if (!(gameMode == "pvc" && turn == "p2")) {
                    $(dice[i]).removeClass("deactivated");
                }
            }, 1000);

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
// used to fill activeHand
function getDie(position) {
    let numb = Math.random();
    let rand = (numb * 10) % 5;
    rand = Math.round(rand) + 1;
    return rand;
};


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

// Returns score of dieCount array passed to it
// called to detect busts
// called to detect if valid hand only has been selected
function getScore(dieCount, disableCheck) {

    // let dieCount = buildDieCount(passedHand);
    let score = 0;

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
            // console.log("PS 2-6 not detected");
            break
        };
        if (i == 5) {
            for (let i = 1; i < 6; i++) {
                dieCount[i] -= 1;
            }
            score += 750
                // console.log("partial straight 2-6 detected");
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

    // works by removing scoring die from dieCount
    // then submists this to disableRollOnNonScore
    if (disableCheck == true) { disableRollOnNonScore(dieCount); }
    return score;
}

// Disable roll options if non-scoring die are selected
function disableRollOnNonScore(dieCount) {

    let nonScoreDie = 0;
    for (let i = 0; i < 6; i++) {
        if (dieCount[i] != 0) {
            nonScoreDie++;
            // console.log("nonScoreDie: " + nonScoreDie);
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
    dieCount = buildDieCount(selectedHand);
    return getScore(dieCount, true);
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
    // unnessary extra rotation somwehre in here 
    // when going from player 1 to player 2
    // but not from player 2 to player 1
    if (turn == "p1") {
        turn = "p2";
        updateStatus("Player 2");
        $("#p1name").removeClass("simple-highlight");
        $("#p2name").addClass("simple-highlight");
        if (gameMode == "pvc") {
            //disable dick click on p2 play pvc
            $(".die").addClass("deactivated");
        }
    } else {
        turn = "p1"
        updateStatus("Player 1");
        $("#p1name").addClass("simple-highlight");
        $("#p2name").removeClass("simple-highlight");
        if (gameMode == "pvc") {
            //enable dice click on p1 play pvc
            $(".die").removeClass("deactivated");
        }
    }

    resetActiveHand();
    if (gameMode == "pvc" && turn == "p2") { computerPlay(); }
}

function startGame(selectedMode) {

    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("boardContainer").style.display = "block";
    $(".die").toggle();

    gameMode = selectedMode;
    if (gameMode == "pvc") {
        //updateStatus("player vs computer")
    } else if (gameMode == "pvp") {
        //updateStatus("player vs player")
    }
    //start the game
    setTimeout(function() { updateStatus("Lets Play!"); }, 0);
    setTimeout(function() { progressTurn(); }, 2000);
    setTimeout(function() { $(".die").toggle(); }, 2000);

}

function computerPlay() {

    // queue of clicks to be played
    let clickStack = [];

    // selectable/unbanked dice available for this round
    // unselectable/banked dice are -1
    let playableHand = [];
    for (let i = 0; i < 6; i++) {
        if (bankedDie[i] == false) {
            playableHand[i] = activeHand[i];
        } else { playableHand[i] = -1; }
    }

    let dieCount = buildDieCount(playableHand);
    console.log("playableHand: " + playableHand);
    dieCount = buildDieCount(playableHand);
    console.log("dieCount: " + dieCount);


    dice = document.getElementsByClassName("die");

    //detect triples
    for (let i = 0; i < 6; i++) {
        // find more than 3 of the same dice via dieCount
        // dieCount[5] = 3 means there are 3x die with number 6
        if (dieCount[i] >= 3) {
            // iterate over every dice in the playable hand
            for (let j = 0; j < 6; j++) {
                // this will select the first three, but cant do double triples
                if (playableHand[j] == (i + 1) && clickStack.length <= 3) {
                    // queue a click for the die with the matching number
                    clickStack.push(dice[j]);
                }
            }


        }
    }
    // if no triples try ones or fives
    if (clickStack.length == 0) {
        // select all ones
        if (dieCount[0] > 0) {
            for (let i = 0; i < 6; i++) {
                if (playableHand[i] == 1) {
                    clickStack.push(dice[i]);
                }
            }
        }
        // select all fives
        if (dieCount[4] > 0) {
            for (let i = 0; i < 6; i++) {
                if (playableHand[i] == 5) {
                    clickStack.push(dice[i]);
                }
            }
        }
    }

    // clickStack.push(document.getElementById("scorePass"));
    let lastDelay = 0;
    console.log("clickStack" + clickStack);
    for (let i = 0; i < clickStack.length; i++) {
        let delay = ((i + 1) * 500) + 1000;
        lastDelay = delay;
        setTimeout(function() {
                console.log("clickStack[" + i + "]: " + clickStack[i]);
                clickStack[i].click()
            },
            delay
        );
    }

    // set Timeout for  scorePass or scoreRoll
    setTimeout(function() {
        let nonSel = $(".notSelected").length;
        console.log(".notSelected.length: " + nonSel);
        if (nonSel >= 3) {
            $('#scoreRoll').click();
            // if still p2 turn, roll again
            setTimeout(function() {
                if (turn == "p2") {
                    computerPlay()
                }
            }, 3000);

        } else {
            $('#scorePass').click();
        }
    }, (lastDelay + 1000));

}

// run game
$(document).ready(function() {

    roll();

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
        updateView();
        updateScoreBoard();
        // call to reroll unselected die
        roll();

    });

    $("#scorePass").click(function() {

        setTimeout(function() {
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
                $("#p1table > .total > span").addClass("highlight");
                setTimeout(function() { $("#p1table > .total > span").removeClass("highlight"); }, 1000)
                p1Total += p1Round;
                p1Total += p1Selected;
                p1Round = 0;
                p1Selected = 0;
            } else {
                $("#p2table > .total > span").addClass("highlight");
                setTimeout(function() { $("#p2table > .total > span").removeClass("highlight"); }, 1000)
                p2Total += p2Round;
                p2Total += p2Selected;
                p2Round = 0;
                p2Selected = 0;
            }
            updateScoreBoard();
            progressTurn();
        }, 500);

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