import React, { useState } from 'react'
import { Route, Routes } from "react-router-dom"

// Components
import TheNaviagtion from './components/TheNaviagtion'

// Context
import { AuthProvider } from './context/AuthContext'

// Views
import Home from './views/HomeView'
import Login from './views/auth/LoginView'
import Register from "./views/auth/RegisterView"

// Permissions
import PrivateRoute from './permissions/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header>
          <TheNaviagtion />
        </header>

        <main className="content">
          <Routes>
              <Route path="/" element={<Home />} />
              <PrivateRoute path="/account/login" element={<Login />} />
              <PrivateRoute path="/account/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
