
const Player = (mark, type) => {

  return {mark, type}

}

const gameBoard = (() => {

  const board = [...Array(9).keys()]

  const getBoard = () => {
    return board
  }

  const markSquare= (index, mark) => {
    board[index] = mark;
  }

  const getSquare = (index) => {
    return board[index];
  }

  const emptySquares = (board) => {
   return board.filter((square) => typeof square ==='number' )
  }

  return {
    getBoard,
    markSquare,
    getSquare,
    emptySquares
  }
  
  
})(); 





const playGame = (() => {

  let gameRound = 0;

  let playAgainstPlayer = null
  let player1 = null
  let player2 = null

  const gameboardSquares = Array.from(document.querySelectorAll('.square'))
  
  const gameboard = document.getElementById('gameboard')

  const playVsPlayer = document.getElementById('vs-player-btn');
  playVsPlayer.onclick = () => {
    playAgainstPlayer = true
    player1 = Player('X', 'human')
    player2 = Player('O', 'human')
  }

  gameboardSquares.forEach((square) => {
    square.addEventListener('click', (event) => {

      markSquareWithCurrentPlayer(gameboardSquares.indexOf(event.target), getTurnPlayerMark());
      
      checkForWin(gameBoard.getBoard(), getTurnPlayerMark());

      if (playAgainstPlayer===false) {
        const baby = gameBoard.getBoard()
      }

    })
  })

  const getTurnPlayerMark = () => {
    
    if (gameRound % 2 === 0)  {
      return player1.mark
    } else {
      return player2.mark
    }
  }


  const markSquareWithCurrentPlayer = (square, mark) => {
  
    if (gameboardSquares[square].textContent !== "") return;

    gameboardSquares[square].textContent = mark

    gameBoard.markSquare(square, mark)

    gameRound ++;

  }

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
    ]

    let winningCombination = winCombinations.filter((combination) => combination.every((index) => boardToCheck[index] === mark))
    

    if (winningCombination.length >= 1) {
      return true
    } else if (gameRound === 9) {

      console.log('draw')

    } else {
      return false
    }


  }

  return {
    getTurnPlayerMark,
    checkForWin
  }
})()
