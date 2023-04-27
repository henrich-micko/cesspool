import { Route, Routes } from "react-router-dom"

// Context
import { AuthProvider } from './context/AuthContext'

// Views
// import HomeView from './views/HomeView'
// import AccountView from './views/account/AccountView'
// import MachineView from "./views/MachineView"
// import AdminAccountView from "./views/admin/AccountViewAdmin"
// import AdminMachineView from "./views/admin/MachineViewAdmin"
// import AccountChangePassword from "@views/account/AccountChangePasswordSubmit"
// import AccountActivateView from "@views/account/AccountActivateView"

import HomePage from "@pages/home";
import AuthPage from "@pages/auth";
import ResetPasswordPage from "@pages/resetPassword";
import ActivateUserPage from "@pages/activateUser";
import CtuMenuPage from "@pages/ctuMenu";
import CesspoolMenuPage from "@pages/cesspoolMenu";
import CesspoolPage from "@pages/cesspool";
import Account from "@pages/account";
import CesspoolAdminPage from "@pages/cesspool/admin";
import UserMenuPage from "@pages/userMenu"
import UserPage from "@pages/user";
import CityMenuPage from "@pages/cityMenu";
import CityPage from "@pages/city";
import CityPageAdmin from "@pages/city/admin";


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <main className="content">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/account/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/account/activate/:token" element={<ActivateUserPage />} /> 
                <Route path="/account/auth" element={<AuthPage />} />
                <Route path="/cesspool" element={<CtuMenuPage />} />
                <Route path="/cesspool/:code" element={<CesspoolPage />} />
                <Route path="/account/me" element={<Account />} />
                <Route path="/admin/cesspool/" element={<CesspoolMenuPage />} />
                <Route path="/admin/cesspool/:code" element={<CesspoolAdminPage />} />
                <Route path="/admin/account/" element={<UserMenuPage />} />
                <Route path="/admin/account/:pk" element={<UserPage />} />
                <Route path="/admin/city/" element={<CityMenuPage />} />
                <Route path="/admin/city/:district/:title" element={<CityPageAdmin />} />
                <Route path="/city/:district/:title" element={<CityPage />} />
            </Routes>
        </main>

      </div>
    </AuthProvider>
  );
}

export default App;
