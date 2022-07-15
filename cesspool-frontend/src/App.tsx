import React from 'react'
import { Route, Routes } from "react-router-dom"

// Components
import TheNaviagtion from './components/TheNaviagtion';

// Views
import Home from './views/Home';
import SignIn from "./views/authentication/SignIn"
import SignUp from "./views/authentication/SignUp"

function App() {
  return (
    <div className="App">
      <header>
        <TheNaviagtion />
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account/signin" element={<SignIn />} />
          <Route path="/account/signup" element={<SignUp />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
