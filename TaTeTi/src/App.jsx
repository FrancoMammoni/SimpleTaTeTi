import { useState } from 'react';
import './App.css';
import './index.css';

const TURNS = { x: 'X', o: 'O' }; // De esta forma se puede elegir, para representar a x u o un caracter, una imagen, emoticon, etc.

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Fila arriba
  [3, 4, 5], // Fila del medio
  [6, 7, 8], // Fila abajo
  [0, 3, 6], // Columna izquierda
  [1, 4, 7], // Columna central
  [2, 5, 8], // Columna derecha
  [0, 4, 8], // Diagonal 
  [2, 4, 6]  // Diagonal 
];

const Square = ({ children, isSelected, updateBoard, index, isWinningSquare }) => {
  const className = `square ${isSelected ? 'is-selected' : ''}
                            ${isWinningSquare ? 'winning-square' : ''}`;

  return (
    <div className={className} onClick={() => updateBoard(index)}>
      {children}
    </div>
  );
};

function App() {

  // Estado del 'turno de: ' (X u O)
  const [turnOf, setTurn] = useState(TURNS.x);

  // Estado del tablero (array de 9 elementos)
  const [board, setBoard] = useState(Array(9).fill(null));

  //Estado del ganador
  const [winner, setWinner] = useState(null);

  //Estado por si hay empate
  const [isDraw, setIsDraw] = useState(null);

  //Guardar combinacion ganadora
  const [winningSquares, setWinningSquares] = useState([]);

   // Función para actualizar el tablero
   const updateBoard = (index) => {
    if (board[index] || winner) return; // Si ya hay un ganador o el espacio está ocupado, no hacer nada

    const newBoard = [...board];
    newBoard[index] = turnOf;
    setBoard(newBoard);

    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner.winner);
      setWinningSquares(newWinner.winningSquares);
    } else if (!newBoard.includes(null)) { // Si no hay espacios vacíos y no hay ganador, es un empate
      setIsDraw(true);
    } else {
      setTurn(turnOf === TURNS.x ? TURNS.o : TURNS.x);
    }
  };

  //Checkear ganador
  const checkWinner = (board) => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
  
      // Si los valores en las posiciones de la combinación son iguales y no están vacíos:
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return {winner : board[a] , winningSquares : combination}; // Devuelve 'X' o 'O' como ganador y la comibinacion ganadora
      }
    }
    return null; // Si no hay ganador, retorna null.
  };

  //Reiniciar el juego
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.x);
    setWinner(null);
    setIsDraw(null);
    setWinningSquares([]);
  }

  return (
    <main className="board">
      <h1>Ta-Te-Ti!</h1>

      <section className="game">
        {
          board.map((value, index) => (
            <Square
              key={index}
              index={index}
              updateBoard={updateBoard} // Pasamos la función para actualizar
              isWinningSquare = {winningSquares.includes(index)} 
            >
              {value} {/* Mostramos el valor del cuadrado (X u O) */}
            </Square>
          ))
        }
      </section>

      <section className="turn">
        <Square isSelected={turnOf === TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turnOf === TURNS.o}>{TURNS.o}</Square>
      </section>

      
      {winner && <h2>¡Ganó el jugador {winner}!</h2>}
      {isDraw && <h2>🤝 ¡Empate! 🤝</h2>}
      <button onClick={resetGame}>Reiniciar Juego</button>
    </main>
  );
}

export default App;