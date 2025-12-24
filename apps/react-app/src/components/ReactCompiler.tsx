import React from "react";
import { useEffect, useReducer } from "react";

const ReactCompilerChild = React.memo(() => {
  console.log("child call");
  useEffect(() => {
    console.log("child render");
  });
  return <div>child</div>;
});
type State = { age: number };
type Action = { type: string };
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increase":
      return { age: state.age + 1 };
      break;
    case "decrease":
      return { age: state.age - 1 };
      break;

    default:
      return state;
      break;
  }
};
export const ReactCompiler = () => {
  const [state, dispatch] = useReducer(reducer, { age: 0 });
  const handleDecrease = () => {
    dispatch({ type: "decrease" });
  };
  const handleIncrease = () => {
    dispatch({ type: "increase" });
  };
  return (
    <div>
      <button onClick={handleDecrease}>-</button>
      <span>{state.age}</span>
      <button onClick={handleIncrease}>+</button>
      <ReactCompilerChild />
    </div>
  );
};
