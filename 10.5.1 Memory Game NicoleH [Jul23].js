//NH Let content load first
document.addEventListener("DOMContentLoaded", function () {
    //define variables
    const newGameButton = document.getElementById('startGame');
    const restartButton = document.getElementById('restart');
    const gameContainer = document.getElementById("game");
    let scoreKeeper = document.getElementById('currentTime');
    let lowestScore = document.getElementById('lowestTime');
    let clickedStorage = [];
    let colorStorage = [];
    let totalSeconds = 0;
    let timerStart;

    //create timer function with formatting
    let timerFunction =
        function timer() {
            ++totalSeconds;
            let hour = Math.floor(totalSeconds / 3600);
            let minute = Math.floor((totalSeconds - hour * 3600) / 60);
            let seconds = totalSeconds - (hour * 3600 + minute * 60);
            if (hour < 10) hour = "0" + hour;
            if (minute < 10) minute = "0" + minute;
            if (seconds < 10) seconds = "0" + seconds;
            document.getElementById('currentTime').innerHTML = hour + ":" + minute + ":" + seconds;
        };

    //pull stored lowscore and display it
    let finalScore = JSON.parse(localStorage.getItem('lowScore'));
    lowestScore.innerHTML = finalScore;

    //disallow cicking on cards before "start new game" is clicked (so timer can have a chance to run)
    gameContainer.addEventListener("click", beforeClickStart, true);
    function beforeClickStart(event) {
        event.stopPropagation();
        event.preventDefault();
    };

    //NH edited to add number at end.
    const COLORS = [
        "red1",
        "blue2",
        "green3",
        "orange4",
        "purple5",
        "red6",
        "blue7",
        "green8",
        "orange9",
        "purple0"
    ];

    // here is a helper function to shuffle an array
    // it returns the same array with values shuffled
    // it is based on an algorithm called Fisher Yates if you want ot research more
    function shuffle(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        };

        return array;
    }

    let shuffledColors = shuffle(COLORS);

    // this function loops over the array of colors
    // it creates a new div and gives it a class with the value of the color
    // it also adds an event listener for a click for each card
    function createDivsForColors(colorArray) {
        for (let color of colorArray) {
            // create a new div
            const newDiv = document.createElement("div");

            // give it a class attribute for the value we are looping over
            newDiv.classList.add(color.slice(0, color.length - 1));

            //NH - give it an id attribute for the value we are looping over (to make sure we don't click on the same card twice)
            newDiv.setAttribute('id', color.slice(color.length - 1, color.length));

            // call a function handleCardClick when a div is clicked on
            newDiv.addEventListener("click", handleCardClick);

            // append the div to the element with an id of game
            gameContainer.append(newDiv);
        };
    };
    createDivsForColors(shuffledColors);


    //function to handle card clicks
    function handleCardClick(event) {

        //NH - for identifying each card seperately
        let idProperty = event.target.id;
        //NH - for changing background color
        let idClass = event.target.className;

        //to iterate over the cards clicked and check if the user has clicked on the card, 
        for (let i = 0; i <= clickedStorage.length; i++) {

            //NH-to identify if a card has already been clicked
            if (event.target.style.backgroundColor !== "") {
                alert("You've already clicked this card");
            } else {

                //NH - if card has not been clicked, add to id to array and change background color
                clickedStorage.push(idProperty);

                //NH - to keep track of what colors were selected
                colorStorage.push(idClass);

                //to change the background color, so when we click on a card, it appears
                event.target.style.backgroundColor = idClass;
            };

            //provide code related to if two cards are selected and they match
            if ((clickedStorage.length === 2) && (colorStorage[colorStorage.length - 2] === colorStorage[colorStorage.length - 1])) {
                //reset clickStorage (should only ever have 2 length max);
                clickedStorage = [];
                if (colorStorage.length === 10) {
                    let finalScore = scoreKeeper.innerHTML;
                    alert("YOU WIN! Your time was " + finalScore);
                    if ((finalScore < lowestScore.innerHTML) || (lowestScore.innerHTML === "")) {
                        localStorage.setItem('lowScore', JSON.stringify(finalScore));
                    }
                    location.reload();
                };

                break;

                //provide code related to if two cards are selected and they DON'T match
            } else if ((clickedStorage.length === 2) && (colorStorage[colorStorage.length - 2] !== colorStorage[colorStorage.length - 1])) {

                //prevent a third (or more) card from being clicked
                addEventListener("click", extraCardClick, true);
                function extraCardClick(event) {
                    event.stopPropagation();
                    event.preventDefault();
                };

                //function that will run through timeout. This will turn the cards back around so they are not visible and allow clicks again
                function turnOver() {
                    //define variables
                    let firstCard = document.getElementById((clickedStorage[0]));
                    let secondCard = document.getElementById((clickedStorage[1]));
                    //change background colors back to default for the two cards clicked (since they don't match)
                    firstCard.style.backgroundColor = "";
                    secondCard.style.backgroundColor = "";
                    //reset storage, this should only ever have a length of 2
                    clickedStorage = [];
                    //remove the unmatched colors. We only want matched colors in colorStorage (to help determine when done with game)
                    colorStorage.pop();
                    colorStorage.pop();
                    //allow clicks again
                    function removeListener() {
                        removeEventListener("click", extraCardClick, true);
                    };
                    removeListener();
                };

                //let the user see the unmatched cards for 1s before they turn back over.
                setTimeout(turnOver, 1000);

                break;

            } else if (clickedStorage.length === 1) {

            }
            break;
        }
    }


    const newGame = function () {
        clearInterval(timerStart);
        totalSeconds = 0;
        clickedStorage = [];
        colorStorage = [];
        for (let i = 0; i < 10; i++) {
            let childId = document.getElementById(i);
            gameContainer.removeChild(childId);
        }
        let shuffledColorsAgain = shuffle(COLORS);
        createDivsForColors(shuffledColorsAgain);
        timerStart = setInterval(timerFunction, 1000);
    };

    const restartGame = function () {
        const gameTitle = document.querySelector('h1');
        gameTitle.setAttribute("class", "clicked");
        gameContainer.removeEventListener("click", beforeClickStart, true);
        totalSeconds = 0;
        document.getElementById('currentTime').innerHTML = "00:00:00";
        timerStart = setInterval(timerFunction, 1000);
    };
    //ations for when "Start New Game" button is pressed
    newGameButton.addEventListener("click", function () {
        //define variable to use class as a marker for what instance this button is being pressed in
        const gameTitle = document.querySelector('h1');
        //if a game has already been started and "start new game" is pressed again
        if (gameTitle.className === "clicked") {
            newGame();
        } else {
            restartGame();
            if (colorStorage.length === 10) {
                clearInterval(timerFunction, 1000);
                location.reload();
            };
        };
    });

    restartButton.addEventListener("click", function () {
        clickedStorage = [];
        colorStorage = [];
        const allDivs = document.querySelectorAll('div');
        for (let div of allDivs) {
            div.style.backgroundColor = "";
        };
        totalSeconds = 0;
        document.getElementById('currentTime').innerHTML = "00:00:00";
        timerFunction = "";
    });
})




//Nicole's Code


//DONE - define card1 vs card2
//DONE - added ids
//DONE - limit the clicks before reset to be 2 DIFFERENT card clicks (use target)
//DONE - get colors to turn on when clicked
//DONE - limit the card turnovers to 2 before reset of arrays (unless a match)
//DONE - if not a match, then reset card backgrounds

//DONE - make sure that you cannot click too quickly and guess more than two cards at a time (use load features)
//DONE - On click of card1, change the background color to be the color of the class it has
//DONE - on click of card2, check if card colors match
//DONE - if card colors match - those should stay revealed. (use session storage)
//DONE - else if they don't match - they should stay revealed for 1 section (1000) before they hide the color again (reset). Use setTimeout.
//DONE - reset the game when it has finished

//DONE - add notification for when the game has been completed
//DONE - add a button that when clicked will start the game
//DONE - add a button that when clicked will restart the game once it has ended
//DONE - for every guess made, increment a score variable and display the score while the game is played
//DONE - store the lowest-scoring game in local storage, so tht players can see a record of the best game played
//allow for ay number of cards to appear
//instead of hard-coding colors, try something different like random colors of even images!