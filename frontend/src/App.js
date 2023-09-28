import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return <Router>
    <Routes>
      <Route path = "create-vote" element = {<></>} />
      <Route path = "votes" element = {<></>} />
    </Routes>
  </Router>
}

export default App;
