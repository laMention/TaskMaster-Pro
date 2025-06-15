import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import TaskView from "./views/TaskView";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<TaskView />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
