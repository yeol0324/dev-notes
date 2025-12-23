/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useReducer } from "react";
// @ts-nocheck
function createInitialState(username: any) {
  console.log("createInitialState");
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1),
    });
  }
  return {
    draft: "",
    todos: initialTodos,
  };
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case "changed_draft": {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    }
    case "added_todo": {
      return {
        draft: "",
        todos: [
          {
            id: state.todos.length,
            text: state.draft,
          },
          ...state.todos,
        ],
      };
    }
  }
  throw Error("Unknown action: " + action.type);
}

export default function TodoList({ username }: any) {
  // const [state, dispatch] = useReducer(reducer, createInitialState(username));
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  return (
    <>
      <input
        value={state.draft}
        onChange={(e) => {
          dispatch({
            type: "changed_draft",
            nextDraft: e.target.value,
          });
        }}
      />
      <button
        onClick={() => {
          dispatch({ type: "added_todo" });
        }}
      >
        Add
      </button>
      <ul>
        {state.todos.map((item: any) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </>
  );
}
