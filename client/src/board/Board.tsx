import React from "react";
import { Square } from "./square/Square";

// interface IBoardState {
//   squares: string[];
//   status: string;
//   isXNext: boolean;
//   done: boolean;
// }

interface IBoardProps {
  squares: string[];
  status: string;
  onClick: (i: number) => void;
}
export class Board extends React.Component<IBoardProps> {

  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {/* <div className="status">{this.props.status}</div> */}
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
