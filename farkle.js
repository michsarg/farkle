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
        this.updateView();
    };

    updateView() {
        let userDice = document.getElementById("userHand");
        let opponentDice = document.getElementById("opponentHand");
        let diceU = userDice.getElementsByClassName("die");
        console.log("diceU: " + diceU);
        let diceO = opponentDice.getElementsByClassName("die");

        for (let i = 0; i < 6; i++) {
            // representation of dice in html
            diceU[i].innerHTML = this.user.hand[i];
            diceO[i].innerHTML = this.opponent.hand[i];
        };
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

    //click to select User dice
    $(".die").click(function() {
        // exit if opponent die clicked
        if ((this).parentElement.id == "opponentHand") {
            console.log("wrong dice set clicked");
            return;
        }

        // update class of clicked die
        (this).classList.toggle("banked");
        // update data structure of banked Die
        let userDice = document.getElementById("userHand");
        let dice = userDice.getElementsByClassName("die");
        let pos = jQuery.inArray((this), dice);
        console.log("this pos = " + pos);
        user.bankedDie[pos] = !user.bankedDie[pos];
        console.log("user.bankedDie[pos]: " + user.bankedDie[pos]);
    });

});