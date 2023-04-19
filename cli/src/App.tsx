import { Route, Routes } from "react-router";
import Home from "./views/Home/Home";
import Chat from "./views/Chat/Chat";


function App() { 

  return (
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/room/:id" element={<Chat />}/>
      </Routes>
  );
}

export default App;
