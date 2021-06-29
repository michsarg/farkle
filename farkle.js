/**
 * Description
 * @authors Your Name (you@example.org)
 * @date    2021-06-25 09:33:06
 * @version 1.0.0
 */



// VARIABLES
p1Total = 0;
p1Round = 0;
p1Selected = 0;
activeHand = [0, 0, 0, 0, 0, 0];
selectedDie = [false, false, false, false, false, false];
bankedDie = [false, false, false, false, false, false];
roll();

// FUNCTIONS
function roll() {
    console.log("activeHand: " + activeHand);
    console.log("selectedDie: " + selectedDie);
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == false && bankedDie[i] == false) {
            activeHand[i] = getDie(i);
        }
    }
    updateView();
    // check for bust
}

function bustCheck() {

    dice = document.getElementsByClassName("die");
    for (let i = 0; i < 6; i++) {

    }

    alert(p1Selected);


}


// updates webpage with data structure values
function updateView() {
    console.log("update View called");

    // updates webpage with dice information
    let activeDice = document.getElementsByClassName("die");
    for (let i = 0; i < activeDice.length; i++) {
        if (activeDice[i].childNodes[0]) {
            activeDice[i].removeChild(activeDice[i].childNodes[0]);
        }
        let diceValue = document.createElement("i");
        switch (activeHand[i]) {
            case 1:
                diceValue.classList.add("fas", "fa-dice-one");
                break;
            case 2:
                diceValue.classList.add("fas", "fa-dice-two");
                break;
            case 3:
                diceValue.classList.add("fas", "fa-dice-three");
                break;
            case 4:
                diceValue.classList.add("fas", "fa-dice-four");
                break;
            case 5:
                diceValue.classList.add("fas", "fa-dice-five");
                break;
            case 6:
                diceValue.classList.add("fas", "fa-dice-six");
                break;
        }
        activeDice[i].appendChild(diceValue);
    }
    // update display of scores?
};

// Returns a random value between 1 and 6
function getDie(position) {
    let numb = Math.random();
    let rand = (numb * 10) % 5;
    rand = Math.round(rand) + 1;
    return rand;
};



// Returns score of selected die
// called when a die is clicked
function getScore(passedHand) {

    // deep copy passed hand
    let inputHand = JSON.parse(JSON.stringify(passedHand));
    let dieCount = [0, 0, 0, 0, 0, 0];
    let score = 0;

    for (let i = 0; i < inputHand.length; i++) { // traverse die values
        for (let j = 0; j < 6; j++) { // traverse counter values
            if (inputHand[i] == (j + 1)) { dieCount[j]++; }
            //break;
        }
    }
    console.log("dieCount: " + dieCount);

    // full house
    if (inputHand.length == 6) {
        for (let i = 0; i < 6; i++) {
            if (dieCount[i] != 1) { break }
            if (i == 5) {
                score = 3000;
                console.log("full house");
                return score;
            }
        }
    }
    // 3 pairs
    var pairCount = 0;
    for (let i = 0; i < dieCount.length; i++) {
        if (dieCount[i] == 2) { pairCount++; }
    }
    if (pairCount == 3) {
        console.log("3 pairs")
        score = 1500;
        return score;
    }
    // triples
    // doesn't cover multiple triples of same
    for (let i = 0; i < dieCount.length; i++) {
        if (dieCount[i] >= 3) {
            score += ((i + 1) * 100);
            dieCount[i] -= 3;
            console.log("triple " + (i + 1));
        }
        // single ones
        else if (i == (1 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 100);
            console.log(dieCount[i] + "x single ones");
            //reset dieCount
            dieCount[i] = 0;
        }
        //single fives
        else if (i == (5 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 50);
            console.log(dieCount[i] + "x single fives");
            // bank selected scoring die
            //reset dieCount
            dieCount[i] = 0;
        }
    }

    // html update
    // Disable options if non-scoring die are selected
    let nonScoreDie = 0;
    for (let i = 0; i < 6; i++) {
        if (dieCount[i] != 0) {
            nonScoreDie++;
        }
    }
    if (nonScoreDie > 0) {
        document.getElementById("scoreRoll").classList.add("disabled");
        document.getElementById("scorePass").classList.add("disabled");
    } else {
        document.getElementById("scoreRoll").classList.remove("disabled");
        document.getElementById("scorePass").classList.remove("disabled");
    }

    console.log("score: " + score);
    console.log(dieCount);
    return score;
}

function getSelectedScore() {
    selectedHand = [];
    // get only selected values
    for (let i = 0; i < 6; i++) {
        if (selectedDie[i] == true && bankedDie[i] == false) {
            selectedHand[i] = activeHand[i];
        }
    }
    return getScore(selectedHand);
}

function updateScoreBoard() {
    document.getElementById("p1Total").innerHTML = p1Total;
    document.getElementById("p1Round").innerHTML = p1Round;
    document.getElementById("p1Selected").innerHTML = p1Selected;
}


// run game
$(document).ready(function() {

    updateView();

    $("#quit").click(function() {
        bustCheck();
    });

    // listener for scoreRoll button/method
    // can assume that only scoring dice have been selected
    $("#scoreRoll").click(function() {
        dice = document.getElementsByClassName("die");
        for (let i = 0; i < 6; i++) {
            if (selectedDie[i] == true) {
                bankedDie[i] = true;
                // update html display to show banked
                dice[i].classList.remove("selected");
                dice[i].classList.add("banked");
            }
        }
        console.log("banked: " + bankedDie);
        // update scoreboard
        p1Round += p1Selected;
        p1Selected = 0;
        updateScoreBoard();
        // call to reroll unselected die
        roll();

    });

    // listener for dice click/selection
    $(".die").click(function() {
        // check die not banked
        if ((this).classList.contains("banked")) {
            console.log("is this banked? " + (this).classList.contains("banked"))
            return
        }

        // update class of clicked die
        (this).classList.toggle("selected");
        (this).classList.toggle("notSelected");

        // update data structure of selected Die
        let dice = document.getElementsByClassName("die");
        let pos = jQuery.inArray((this), dice);
        console.log("this pos = " + pos);
        selectedDie[pos] = !selectedDie[pos];
        console.log("selectedDie[pos]: " + selectedDie[pos]);

        //update selected menu value
        p1Selected = getSelectedScore();
        updateScoreBoard();

    });

});

// tests score function
function testScore(testHand) {
    let thisHand = testHand;
    let thisScore = getScore(thisHand);
    console.log("thisScore: " + thisScore);
    alert(thisScore);
}