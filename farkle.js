/**
 * Description
 * @authors Your Name (you@example.org)
 * @date    2021-06-25 09:33:06
 * @version 1.0.0
 */



// match for running game
class Match {
    constructor(p1, p2) {
        this.player1 = p1;
        this.player2 = p2;
        this.updateView();
    };

    updateView() {
        let dice = document.getElementsByClassName("die");
        for (let i = 0; i < 6; i++) {

            dice[i].innerHTML = this.player1.hand[i + 1];
            dice[6 + i].innerHTML = this.player2.hand[i + 1];
        };
    };

};

// player for AI and user
class Player {
    constructor() {
        this.hand = []; // numbers 1-6 
        this.bankedDie = []; // bool
        this.score = 0;
        this.setHand();
    };

    //populate initial hand
    setHand() {
        for (let i = 1; i < 7; i++) {
            this.hand[i] = getDie(i);
            this.bankedDie[i] = false;
            console.log("hand: " + this.hand[i]);
        }
    };

    //reroll on non banked die
    reRoll() {
        for (i = 1; i < 7; i++) {
            if (this.bankedDie[i] == false) {
                // not yet implemented
            };
        };
    };


};






// get die
function getDie(position) {

    let numb = Math.random();
    let rand = (numb * 10) % 5;
    rand = Math.round(rand) + 1;

    // alternate code to prevent sucessive duplication
    // let dice = document.getElementsByClassName("die");
    // console.log("position=" + position);
    // if (position > 0) {
    //     if (rand == dice[(position - 1)].innerHTML) {
    //         console.log("sequence detected");
    //         rand = getDie(position);
    //     }
    // }
    //console.log(rand);

    return rand;

};

// set up initial dice
// function setUp() {

//     // html version
//     let dice = document.getElementsByClassName("die");
//     for (i = 0; i < dice.length; i++) {
//         dice[i].innerHTML = getDie(i);
//     };

// };

$(document).ready(function() {
    console.log("hello world");
    //setUp();
    p1 = new Player();
    p2 = new Player();
    thisMatch = new Match(p1, p2);
    thisMatch.updateView();

});