import React from 'react'
import './App.css';
import Routes from "./components/Routes"
import { BrowserRouter } from 'react-router-dom'

function App () {
  return (
    <div>
      <BrowserRouter>
        <Routes></Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
