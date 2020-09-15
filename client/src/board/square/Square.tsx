import React, { ButtonHTMLAttributes, ReactElement } from "react";

interface ISquareProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  //   onSquareClick: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  onClick: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

// export class Square extends React.Component<ISquareProps> {
//   render() {
//     return (
//       <button className="square" onClick={this.props.onClick}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

export function Square(props: ISquareProps): ReactElement {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};
