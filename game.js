
const gameObj = {
    currentPlayer: 0, // 0: red, 1: blue
    decidedTime: 10, // seconds
    blockItems: [],
    userLastTouch: null,
    offsetY: document.querySelector('#header').clientHeight,
    maxColumn: 6,
    maxRow: 6,
}

function init() {
    gameObj.currentPlayer = 0;
    gameObj.blockItems = [];
    gameObj.getPlayerColor = () => gameObj.currentPlayer ? 'red' : 'black';
    gameObj.switchSide = () => {
        gameObj.currentPlayer = +!Boolean(gameObj.currentPlayer);
        log(`current player ${gameObj.currentPlayer}`);
    }
    for (let i = 0; i < gameObj.maxRow; i++) {
        gameObj.blockItems.push(Math.floor(util.getRandomArbitrary(1, gameObj.maxColumn)));
    }
}
function getLineHistory() {
    if (gameObj.currentPlayer === 0) {
        return 0;
    } else {
        return 1;
    }
}

// utils
const util = {};
util.approx = (num) => Math.floor(num + 0.5);
util.getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;
const log = (x) => console.log('debug: ', x);
init();