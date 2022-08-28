import React from "react"
import { NavLink } from "react-router-dom"
 
// Styles
import styles from "./TheNavigation.module.scss"

// context && hooks
import AuthContext from "../context/AuthContext"
import useIsMobile from "../hooks/useIsMobile"


const TheNaviagtion: React.FC = () => {
    const { isLogged, user } = useContext(AuthContext)
    const isMobile = useIsMobile()
 
    return(
        <nav className={styles.navigation}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : undefined}>Domov</NavLink>

            {!isLogged ?
                <>
                    <NavLink to="/account/login" className={({ isActive }) => isActive ? styles.active : undefined}>Prihlásenie</NavLink>
                    <NavLink to="/account/register" className={({ isActive }) => isActive ? styles.active : undefined}>Registrácia</NavLink>
                </> :
                <>
                    <NavLink to="/machine" className={({ isActive }) => isActive ? styles.active : undefined}>Zariadenia</NavLink>
                    {user.is_superuser && <NavLink to="/admin/machine" className={({ isActive }) => isActive ? styles.active : undefined}>Admin</NavLink>}
                    <NavLink to="/account" className={({ isActive }) => isActive ? styles.active : undefined}>Učet{!isMobile && ": " + user.email }</NavLink>
                </>
            }

        </nav>
    )
}

export default TheNaviagtion