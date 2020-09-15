import React from "react";
import { Board } from "./board/Board";
import io from "socket.io-client";
// super(props);
// this.state = {
//   history: [{
//     squares: Array(9).fill(null),
//   }],
//   xIsNext: true,
// };
// }

interface IGameState {
  xIsNext: boolean;
  history: {
    squares: string[];
  }[];
  status: string;
  done: boolean;
  stepNumber: number;
}

class Game extends React.Component<{}, IGameState> {
  private socket: SocketIOClient.Socket;

  constructor(props: {}) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill("") }],
      xIsNext: true,
      status: "Next Player: X",
      done: false,
      stepNumber: 0,
    };
    this.socket = io("/");
    
    this.socket.on("join", (data: { user: string; msg: string }) => {
      console.log(`Connected user ${data.user} with message ${data.msg}`);
    });
  }

  emitState = (state: IGameState) => {
    console.log(`emitting state change: ${state}`)
    this.socket.emit("newState", state);
  }
  
  componentDidMount(): void {
    // emit state as new game
    this.emitState({...this.state});

    // call on state change
    this.socket.on("newState", (data: IGameState) => {
      this.setState(data);
    });


  }
  calculateWinner = (squares: string[]): string | null => {
    const winners = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winners.length; i++) {
      const positions = winners[i];
      if (
        squares[positions[0]] &&
        squares[positions[0]] === squares[positions[1]] &&
        squares[positions[0]] === squares[positions[2]]
      ) {
        return `Winner: ${squares[positions[0]]}`;
      }
    }
    return null;
  };

  handleClick = (i: number) => {
    // check if winner has been decided
    if (this.state.done) {
      return;
    }

    // get current squares
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];

    // if squares is filled then return
    if (squares[i]) {
      return;
    }

    // set square value
    squares[i] = this.state.xIsNext ? "X" : "O";

    // check if winner
    const winner = this.calculateWinner(squares);
    if (winner) {
      const newState: IGameState = {
        done: true,
        history: [...history, { squares }],
        status: winner,
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      };
      this.emitState(newState);
      // this.setState({
      //   done: true,
      //   history: [...history, { squares }],
      //   status: winner,
      //   stepNumber: history.length,
      // });
      return;
    }
    // set state if no winner is decided
    const status = !this.state.xIsNext ? "Next Player: X" : "Next Player: O";
    this.emitState({
      history: [...history, { squares }],
      status,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      done: false
    });
    // this.setState({
    //   history: [...history, { squares }],
    //   status,
    //   xIsNext: !this.state.xIsNext,
    //   stepNumber: history.length,
    // });
  };

  jumpTo = (move: number) => {
    const xIsNext = move % 2 === 0;
    const status = xIsNext ? "Next Player: X" : "Next Player: O";

    this.emitState({
      ...this.state,
      stepNumber: move,
      xIsNext,
      status,
      done: false,
    });
    // this.setState({
    //   stepNumber: move,
    //   xIsNext,
    //   status,
    //   done: false,
    // });
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";

      return (
        <li key={move}>
          <button key={move} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares.slice()}
            status={this.state.status}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{this.state.status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
