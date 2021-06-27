/**
 * Description
 * @authors Your Name (you@example.org)
 * @date    2021-06-25 09:33:06
 * @version 1.0.0
 */

// match for running game
class Match {
    constructor(user, opponent) {
        this.user = user;
        this.opponent = opponent;
        this.userScore = 0;
        this.opponentScore = 0;
        this.updateView();
    };

    updateView() {
        console.log("update View called");

        // get hands of players
        let userDice = document.getElementById("userHand");
        let opponentDice = document.getElementById("opponentHand");
        let diceU = userDice.getElementsByClassName("die");
        let diceO = opponentDice.getElementsByClassName("die");

        for (let i = 0; i < 6; i++) {
            // representation of dice in html
            diceU[i].innerHTML = this.user.hand[i];
            diceO[i].innerHTML = this.opponent.hand[i];
        };

        // update with dice images
        let allDice = document.getElementsByClassName("die");
        for (let i = 0; i < allDice.length; i++) {
            //alert("for looped");
            if (allDice[i].innerHTML == 1) {
                var diceValue = document.createElement("i");
                diceValue.classList.add("fas", "fa-dice-one");
                allDice[i].innerHTML = "";
                allDice[i].appendChild(diceValue);


                // var iconSpan = document.createElement("span");
                // iconSpan.classList.add("fa-stack", "fa-1x");
                // var bgIcon = document.createElement("i");
                // bgIcon.classList.add("fas", "fa-square", "fa-stack-1x", "iconBg");
                // var frontIcon = document.createElement("i");
                // frontIcon.classList.add("fas", "fa-dice-one", "fa-stack-1x");
                // allDice[i].innerHTML = "";
                // allDice[i].appendChild(iconSpan);
                // iconSpan.appendChild(bgIcon);
                // iconSpan.appendChild(frontIcon);

            } else if (allDice[i].innerHTML == 2) {
                var diceValue = document.createElement("i");
                diceValue.classList.add("fas", "fa-dice-two");
                allDice[i].innerHTML = "";
                allDice[i].appendChild(diceValue);
            } else if (allDice[i].innerHTML == 3) {
                var diceValue = document.createElement("i");
                diceValue.classList.add("fas", "fa-dice-three");
                allDice[i].innerHTML = "";
                allDice[i].appendChild(diceValue);
            } else if (allDice[i].innerHTML == 4) {
                var diceValue = document.createElement("i");
                diceValue.classList.add("fas", "fa-dice-four");
                allDice[i].innerHTML = "";
                allDice[i].appendChild(diceValue);
            } else if (allDice[i].innerHTML == 5) {
                var diceValue = document.createElement("i");
                diceValue.classList.add("fas", "fa-dice-five");
                allDice[i].innerHTML = "";
                allDice[i].appendChild(diceValue);
            } else if (allDice[i].innerHTML == 6) {
                var diceValue = document.createElement("i");
                diceValue.classList.add("fas", "fa-dice-six");
                allDice[i].innerHTML = "";
                allDice[i].appendChild(diceValue);
            }
        }

        // update display of scores
        document.getElementById("userScore").innerHTML = this.userScore;
        document.getElementById("opponentScore").innerHTML = this.opponentScore;


    };

    //roll die button
    rollDie() {
        thisMatch.player.reRoll();
    };

};

// player for AI and user
class Player {

    constructor() {
        this.hand = []; // numbers
        this.bankedDie = []; // bools
        this.score = 0;
        this.setHand();
    };

    //populate initial hand
    setHand() {
        for (let i = 0; i < 6; i++) {
            this.hand[i] = getDie(i);
            this.bankedDie[i] = false;
        }
        console.log("this.hand= " + this.hand);
    };

    // selects random numbers for this players non-banked die
    reRoll() {
        console.log("(this).bankedDie) = " + (this).bankedDie);
        for (let i = 0; i < 6; i++) {
            if ((this).bankedDie[i] == false) {
                (this).hand[i] = getDie(i);
            };
        };
        thisMatch.updateView();
        getScore(this.hand);
    };

    test() {
        alert("test");
    }

};

// Returns a random value between 1 and 6
function getDie(position) {
    let numb = Math.random();
    let rand = (numb * 10) % 5;
    rand = Math.round(rand) + 1;
    return rand;
};


// Returns score of banked die
function getScore(passedHand) {

    // deep copy passed hand
    let inputHand = JSON.parse(JSON.stringify(passedHand));

    let score = 0;
    let dieCount = [0, 0, 0, 0, 0, 0];
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
            let multiplier = Math.floor(dieCount[i] / 3);
            score += ((i + 1) * 100 * multiplier);
            dieCount[i] = -(3 * multiplier);
            console.log(multiplier + "x triple " + (i + 1));
        }
        // single ones
        else if (i == (1 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 100);
            console.log(dieCount[i] + "x single ones");
        }
        //single fives
        else if (i == (5 - 1) && dieCount[i] > 0) {
            score += ((dieCount[i]) * 50);
            console.log(dieCount[i] + "x single fives");
        }
    }

    console.log("score: " + score);
    return score;
}

$(document).ready(function() {

    //setUp();
    user = new Player();
    opponent = new Player();
    thisMatch = new Match(user, opponent);
    thisMatch.updateView();

    // reroll method
    $("#rollDie").click(function() {
        user.reRoll();
    });

    //Score method
    $("#scoreDie").click(function() {
        bankedHand = [];
        // get only banked values
        for (let i = 0; i < 6; i++) {
            if (user.bankedDie[i] == true) {
                bankedHand[i] = user.hand[i];
            }
        }
        let score = getScore(bankedHand);
        user.score += score;
        console.log("scored as: " + score);
        thisMatch.updateView();
    });

    //click to select User dice
    $(".die").click(function() {
        // exit if opponent die clicked
        if ((this).parentElement.id == "opponentHand") {
            console.log("wrong dice set clicked");
            return;
        }

        // update class of clicked die
        (this).classList.toggle("banked");
        (this).classList.toggle("notBanked");
        // update data structure of banked Die
        let userDice = document.getElementById("userHand");
        let dice = userDice.getElementsByClassName("die");
        let pos = jQuery.inArray((this), dice);
        console.log("this pos = " + pos);
        user.bankedDie[pos] = !user.bankedDie[pos];
        console.log("user.bankedDie[pos]: " + user.bankedDie[pos]);
    });

});

// tests score function
function testScore(testHand) {
    let thisHand = testHand;
    let thisScore = getScore(thisHand);
    console.log("thisScore: " + thisScore);
    alert(thisScore);
}