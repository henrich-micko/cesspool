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
import CtuPage from "@pages/ctuPage";
import Account from "@pages/account";
import CesspoolAdminPage from "@pages/cesspool";
import AccountMenu from "@pages/accountMenu"
import AccountPage from "@pages/accountPage";
import CityMenuAdmin from "@pages/cityMenuAdmin";
import CityPage from "@pages/city";
import CityPageAdmin from "@pages/cityPageAdmin";
import CityMenu from "@pages/cityMenu";


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
                <Route path="/account/me" element={<Account />} />

                <Route path="/cesspool" element={<CtuMenuPage />} />
                <Route path="/cesspool/:code" element={<CtuPage />} />
                
                <Route path="/admin/cesspool/" element={<CesspoolMenuPage />} />
                <Route path="/admin/cesspool/:code" element={<CesspoolAdminPage />} />
                <Route path="/admin/account/" element={<AccountMenu />} />
                <Route path="/admin/account/:pk" element={<AccountPage />} />               
                <Route path="/admin/city/" element={<CityMenuAdmin />} />
                <Route path="/admin/city/:district/:title" element={<CityPageAdmin />} />

                <Route path="/city/" element={<CityMenu />} />
                <Route path="/city/:district/:title" element={<CityPage />} />
            </Routes>
        </main>

      </div>
    </AuthProvider>
  );
}

export default App;
