import { Route, Routes } from "react-router-dom"

// Components
import TheNaviagtion from './components/TheNaviagtion'

// Context
import { AuthProvider } from './context/AuthContext'

// Views
import Home from './views/HomeView'
import Login from './views/auth/LoginView'
import Register from "./views/auth/RegisterView"
import Account from './views/account/AccountView'

// Permissions

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
              <Route path="/account/login" element={<Login />}/>
              <Route path="/account/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
