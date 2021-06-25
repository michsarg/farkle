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
    };

    updateView() {
        for (i = 0; i < 6; i++) {
            dice = document.getElementsByClassName("die");
            dice[i].innerHTML = this.player1.hand[i + 1];
            dice[5 + i].innerHTML = this.player2.hand[i + 1];
        };
    };

};

// player for AI and user
class Player {
    constructor(name) {
        this.name = name;
        this.hand = []; // numbers 1-6 
        this.bankedDie = []; // bool
        this.setHand();
        this.score = 0;
    };

    //populate initial hand
    setHand() {
        for (i = 1; i < 7; i++) {
            this.hand[i] = getDie(i);
            this.bankedDie[i] = false;
        };
    };

    //reroll on non banked die
    reRoll() {
        for (i = 1; i < 7; i++) {
            if (this.bankedDie[i] == false) {

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
    const p1 = new Player("user");
    const p2 = new Player("computer");
    const thisMatch = new Match(p1, p2);

});