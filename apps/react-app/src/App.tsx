import "./App.css";
import { ExcelPerfDemo } from "./components/ExcelPerfDemo";
import { PetstorePetsByStatusPage } from "./components/PetstorePetsByStatusPage";
function App() {
  return (
    <>
      <div>
        <PetstorePetsByStatusPage />
        <ExcelPerfDemo />
      </div>
    </>
  );
}

export default App;
