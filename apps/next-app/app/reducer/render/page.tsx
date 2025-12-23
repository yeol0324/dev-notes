"use client";
import { useEffect, useReducer } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function reducer(state: any, action: any) {
  if (action.type === "incremented_age") {
    return {
      age: state.age + 1,
    };
  }
  if (action.type === "no") {
    return state;
  }
  throw Error("Unknown action.");
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  console.log("render");
  useEffect(() => {
    console.log("state commit (effect ran)");
  }, [state]);
  useEffect(() => {
    console.log("commit (effect ran)");
  });
  return (
    <>
      <button
        onClick={() => {
          dispatch({ type: "no" });
        }}
      >
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
