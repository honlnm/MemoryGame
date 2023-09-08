document.addEventListener("DOMContentLoaded", function () {
    const newGameButton = document.getElementById('startGame');
    const restartButton = document.getElementById('restart');
    const gameContainer = document.getElementById("game");
    let scoreKeeper = document.getElementById('currentTime');
    let lowestScore = document.getElementById('lowestTime');
    let clickedStorage = [];
    let catStorage = [];
    let totalSeconds = 0;
    let timerStart;

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

    let finalScore = JSON.parse(localStorage.getItem('lowScore'));
    lowestScore.innerHTML = finalScore;

    gameContainer.addEventListener("click", beforeClickStart, true);
    function beforeClickStart(event) {
        event.stopPropagation();
        event.preventDefault();
    };

    const CATS = [
        "url('cat1.png')1",
        "url('cat2.png')2",
        "url('cat3.png')3",
        "url('cat4.png')4",
        "url('cat5.png')5",
        "url('cat1.png')6",
        "url('cat2.png')7",
        "url('cat3.png')8",
        "url('cat4.png')9",
        "url('cat5.png')0"
    ];

    function shuffle(array) {
        let counter = array.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        };
        return array;
    }

    let shuffledCats = shuffle(CATS);

    function createDivsForCats(catArray) {
        for (let cat of catArray) {
            const newDiv = document.createElement("div");
            newDiv.classList.add(cat.slice(0, cat.length - 1));
            newDiv.setAttribute('id', cat.slice(cat.length - 1, cat.length));
            newDiv.addEventListener("click", handleCardClick);
            newDiv.style.backgroundImage = "url(paw-print.png)";
            gameContainer.append(newDiv);
        };
    };

    createDivsForCats(shuffledCats);

    function handleCardClick(event) {
        let idProperty = event.target.id;
        let idClass = event.target.className;
        console.log(document.getElementById(idProperty).style.backgroundImage);
        for (let i = 0; i <= clickedStorage.length; i++) {
            if (event.target.style.backgroundImage !== 'url("paw-print.png")') {
                alert("You've already clicked this card");
            } else {
                clickedStorage.push(idProperty);
                catStorage.push(idClass);
                event.target.style.backgroundImage = idClass;
            };
            if ((clickedStorage.length === 2) && (catStorage[catStorage.length - 2] === catStorage[catStorage.length - 1])) {
                clickedStorage = [];
                if (catStorage.length === 10) {
                    let finalScore = scoreKeeper.innerHTML;
                    alert("YOU WIN! Your time was " + finalScore);
                    if ((finalScore < lowestScore.innerHTML) || (lowestScore.innerHTML === "")) {
                        localStorage.setItem('lowScore', JSON.stringify(finalScore));
                    }
                    location.reload();
                };
                break;
            } else if ((clickedStorage.length === 2) && (catStorage[catStorage.length - 2] !== catStorage[catStorage.length - 1])) {
                addEventListener("click", extraCardClick, true);
                function extraCardClick(event) {
                    event.stopPropagation();
                    event.preventDefault();
                };

                function turnOver() {

                    let firstCard = document.getElementById((clickedStorage[0]));
                    let secondCard = document.getElementById((clickedStorage[1]));

                    firstCard.style.backgroundImage = "url(paw-print.png)";
                    secondCard.style.backgroundImage = "url(paw-print.png)";

                    clickedStorage = [];

                    catStorage.pop();
                    catStorage.pop();

                    function removeListener() {
                        removeEventListener("click", extraCardClick, true);
                    };
                    removeListener();
                };

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
        catStorage = [];
        for (let i = 0; i < 10; i++) {
            let childId = document.getElementById(i);
            gameContainer.removeChild(childId);
        }
        let shuffledCatsAgain = shuffle(CATS);
        createDivsForCats(shuffledCatsAgain);
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

    newGameButton.addEventListener("click", function () {
        const gameTitle = document.querySelector('h1');
        if (gameTitle.className === "clicked") {
            newGame();
        } else {
            restartGame();
            if (catStorage.length === 10) {
                clearInterval(timerFunction, 1000);
                location.reload();
            };
        };
    });

    restartButton.addEventListener("click", function () {
        clickedStorage = [];
        catStorage = [];
        const allDivs = document.querySelectorAll('div');
        for (let div of allDivs) {
            div.style.backgroundImage = "url(paw-print.png)";
        };
        totalSeconds = 0;
        document.getElementById('currentTime').innerHTML = "00:00:00";
        timerFunction = "";
    });
})
