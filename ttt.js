const Player = (mark, type) => {
  return {mark, type};
}

const gameBoard = (() => {

  const board = [...Array(9).keys()];

  const getBoard = () => {
    return board;
  }

  const markSquare= (index, mark) => {
    board[index] = mark;
  }

  const getSquare = (index) => {
    return board[index];
  }

  //can be used for testing boards, not just the original
  const emptySquares = (board) => {
   return board.filter((square) => typeof square ==='number');
  }

  return {
    getBoard,
    markSquare,
    getSquare,
    emptySquares
  }
})(); 

const BotLogic = (() => {

  let BotMark = null;
  let HumanMark = null;
  
  const setBotMark = (mark) => {
    BotMark = mark;
  }

  const setHumanMark = (mark) => {
    HumanMark = mark;
  }

  let BotDifficulty = null;

  const setBotDifficulty = (difficultyLevel) => {
    BotDifficulty = difficultyLevel;
  }

  const BotchooseSquare = (boardForBot) => {

    let mistakeValue = Math.floor(Math.random() * 101);

    let BotChoice = null;

    let possibleMoves = gameBoard.emptySquares(boardForBot);
    
    //The easier the bot difficulty, less are the chances of choosing a minmax move
    if (mistakeValue > BotDifficulty) {
      let Mistake = Math.floor(Math.random() * (possibleMoves.length));
      BotChoice = possibleMoves[Mistake];
      return BotChoice;

    } else {

      return minimaxProcess(boardForBot, BotMark).index;

      function minimaxProcess(testingBoard, currentTurnMark){

        const squaresToTest = gameBoard.emptySquares(testingBoard);
        
        if (playGame.checkForWin(testingBoard, HumanMark)) {
          return {score: -1};
        } else if (playGame.checkForWin(testingBoard, BotMark)) {
          return {score: 1};
        } else if (squaresToTest.length === 0) {
          return {score: 0};
        }
      
        const movesToTest = [];
      
        for (let i=0; i < squaresToTest.length; i++) {
      
          const currentMoveToTest = {};
      
          currentMoveToTest.index = testingBoard[squaresToTest[i]];
      
          testingBoard[squaresToTest[i]] = currentTurnMark;
      
          if (currentTurnMark == BotMark) {
            const result = minimaxProcess(testingBoard, HumanMark);
            currentMoveToTest.score = result.score;
            
          } else {
            const result =  minimaxProcess(testingBoard, BotMark);
            currentMoveToTest.score = result.score;
          }
          
          testingBoard[squaresToTest[i]] = currentMoveToTest.index;
      
          movesToTest.push(currentMoveToTest);
        }
      
        let bestMove = null;
      
        if (currentTurnMark === BotMark) {
          let bestScore = -100;
          for (let i = 0; i < movesToTest.length; i++) {
            if (movesToTest[i].score > bestScore) {
              bestScore = movesToTest[i].score;
              bestMove = i;
            }
          }
        } else {
          let bestScore = 100;
          for (let i = 0; i < movesToTest.length; i++) {
            if (movesToTest[i].score < bestScore) {
              bestScore = movesToTest[i].score;
              bestMove = i;
            }
          }
        }
      
        return movesToTest[bestMove];
      }
    }
  }

  return {
    setBotMark,
    setHumanMark,
    setBotDifficulty,
    BotchooseSquare
  }

})()

const playGame = (() => {

  let gameRound = 0;

  let playAgainstPlayer = null;
  let player1 = null;
  let player2 = null;

  const gameboardSquares = Array.from(document.querySelectorAll('.square'));
  const gameboardContainer = document.getElementById('gameboardcontainer');

  const P1 = document.getElementById('player-1');
  const P2 = document.getElementById('player-2');

  const gameSettings = document.getElementById('game-settings-container');

  const playerTypeSettings = document.getElementById('choose-player-type');
  const playVsPlayer = document.getElementById('vs-player-btn');
  const playVsBot = document.getElementById('vs-bot-btn');

  const difficultySettings = document.getElementById('choose-difficulty');
  const beginnerMode = document.getElementById('beginner-btn');
  const intermediateMode = document.getElementById('intermediate-btn');
  const expertMode = document.getElementById('expert-btn');

  const orderSettings = document.getElementById('choose-order');
  const startFirst = document.getElementById('start-first-btn');
  const startSecond = document.getElementById('start-second-btn');

  gameboardContainer.style.filter = 'blur(10px)';

  playVsPlayer.onclick = () => setUpGame(playVsPlayer);

  playVsBot.addEventListener('click', ()=> {

    playAgainstPlayer = false;

    difficultySettings.style.visibility = 'visible';
    playerTypeSettings.classList.add('disabled');

    const goBackContainer = document.getElementById('go-back-container');
    goBackContainer.style.visibility ='visible';

    const goBackButton = document.createElement('button');
    goBackButton.setAttribute('id', 'go-back-btn');
    goBackButton.innerHTML = 'Go Back';
    goBackContainer.appendChild(goBackButton);
    goBackButton.addEventListener('click', () => {

      if ((playerTypeSettings.classList.contains('disabled') && (!difficultySettings.classList.contains('disabled')))) {
        playerTypeSettings.classList.remove('disabled');
        difficultySettings.style.visibility = 'hidden';
        goBackContainer.style.visibility = 'hidden';
      } else {
        difficultySettings.classList.remove('disabled');
        orderSettings.style.visibility = 'hidden';
      }
    })
    
    beginnerMode.addEventListener('click', () => {
      BotLogic.setBotDifficulty(20);
      startOrder();
    })

    intermediateMode.addEventListener('click', () => {
      BotLogic.setBotDifficulty(60);
      startOrder();
    })

    expertMode.addEventListener('click', () => {
      BotLogic.setBotDifficulty(100);
      startOrder();
    })
  })

  const startOrder = () => {

    difficultySettings.classList.add('disabled');
    orderSettings.style.visibility = 'visible';
    
    startFirst.onclick = () => {
      setUpGame(startFirst);
    }

    startSecond.onclick = () => {
      setUpGame(startSecond);
    }
  }

  //creates player objects
  const setUpGame = (button) => {

    const You = document.createTextNode('(You)\n');
    const Bot = document.createTextNode('(Bot)\n');
        
    if (button===playVsPlayer) {
      playAgainstPlayer = true;
      player1 = Player('X', 'human');
      player2 = Player('O', 'human');

    } else if (button===startFirst) {
      player1 = Player('X', 'human');
      player2 = Player('O', 'bot');
      BotLogic.setBotMark('O');
      BotLogic.setHumanMark('X');
      P1.append(You);
      P2.append(Bot);

    } else {
      player1 = Player('X', 'bot');
      player2 = Player('O', 'human');
      BotLogic.setBotMark('X');
      BotLogic.setHumanMark('O');
      P1.appendChild(Bot);
      P2.appendChild(You);
      gameboardSquares[4].textContent = player1.mark;
      gameBoard.markSquare(4, 'X');
      gameRound++;
    }

    gameSettings.remove();
    gameboardContainer.style.filter = '';
  }

  gameboardSquares.forEach((square) => {
    square.addEventListener('click', (event) => {

      markSquareWithCurrentPlayer(gameboardSquares.indexOf(event.target), getTurnPlayerMark());
      
      if (playAgainstPlayer===false) {
        const copyOriginalBoard = gameBoard.getBoard().slice();
        playAgainstBot(copyOriginalBoard);
      }
    })
  })

  const getTurnPlayerMark = () => {
    
    if (gameRound % 2 === 0)  {
      return player1.mark;
    } else {
      return player2.mark;
    }
  }

  //marks clicked square in board with mark of the current player
  const markSquareWithCurrentPlayer = (square, mark) => {
  
    if (gameboardSquares[square].textContent !== "") return;

    gameboardSquares[square].textContent = mark;

    gameBoard.markSquare(square, mark);

    gameRound ++;

    if (checkForWin(gameBoard.getBoard(), mark)){
      endGame(mark);
    } else if (gameRound ===9) {
      endGame();
    }
  }
  
  //takes a shallow copy of the original board to use in the minmax algorith
  const playAgainstBot = (boardForBot) => {

    if ((player1.type ==='bot') && (gameRound % 2 === 0)) {
      markSquareWithCurrentPlayer(BotLogic.BotchooseSquare(boardForBot), 'X');
      checkForWin(gameBoard.getBoard(), 'X');

    } else if ((player2.type ==='bot') && (gameRound % 2 === 1)){
      markSquareWithCurrentPlayer(BotLogic.BotchooseSquare(boardForBot), 'O');
      checkForWin(gameBoard.getBoard(), 'O');

    } else {
      return;
    }
  } 

  //can be used for any board, including the testing ones for minmax algorithm
  const checkForWin = (boardToCheck, mark) => {

    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
    ];

    let winningCombination = winCombinations.filter((combination) => combination.every((index) => boardToCheck[index] === mark));
    
    if (winningCombination.length >= 1) {
      return true;
    } else {
      return false;
    }
  }

  //declare game-end state and offer restart option
  const endGame = (winner) => {
    
    gameboardContainer.style.pointerEvents = 'none';

    const Win = document.createTextNode('WIN');
    const Lose = document.createTextNode('LOSE');
    const Tie = document.createTextNode('DRAW');

    if (winner === 'X') {
      P1.appendChild(Win);
      P2.appendChild(Lose);
    } else if (winner === 'O') {
      P1.appendChild(Lose);
      P2.appendChild(Win);
    } else {
      const playerBoard = document.getElementById('playerboard');
      playerBoard.insertBefore(Tie, playerBoard.childNodes[2]);
    }

    const Board = document.getElementById('gameboard');
    Board.style.filter = 'blur(10px)';

    const restartDisplay = document.getElementById('restart-display');
    restartDisplay.style.visibility = 'visible';

    const restart = document.getElementById('restart-btn');
    restart.onclick = () => window.location.reload();
  }

  return {
    checkForWin
  }
})()

