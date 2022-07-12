import React from 'react'
import { Route, Routes } from "react-router-dom"

// Components
import TheNaviagtion from './components/TheNaviagtion';

// Views
import Home from './views/Home';
import Login from "./views/Login"

function App() {
  return (
    <div className="App">
      <header>
        <TheNaviagtion />
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
