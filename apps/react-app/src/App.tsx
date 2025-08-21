import { UseOptimisticDemo } from "./experiments/useOptimisticDemo/useOptimisticDemo";
import { UseReducerDemo } from "./study/useReducerDemo";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <UseOptimisticDemo />
        <UseReducerDemo />
      </div>
    </>
  );
}

export default App;
