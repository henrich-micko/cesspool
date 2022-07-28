import React from "react"
import { NavLink } from "react-router-dom"
 
// Styles
import styles from "./TheNavigation.module.scss"

// Permissions
import { IsAuthenticated, IsNotAuthenticated } from "../permissions/Authenticated"

const TheNaviagtion: React.FC = () => {
    return(
        <nav className={styles.navigation}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : undefined}>Domov</NavLink>

            <IsNotAuthenticated>
                <NavLink to="/account/login" className={({ isActive }) => isActive ? styles.active : undefined}>Prihlásenie</NavLink>
                <NavLink to="/account/register" className={({ isActive }) => isActive ? styles.active : undefined}>Registrácia</NavLink>
            </IsNotAuthenticated>

            <IsAuthenticated>
                <NavLink to="/cesspools" className={({ isActive }) => isActive ? styles.active : undefined}>Moje Zariadenia</NavLink>
                <NavLink to="/account" className={({ isActive }) => isActive ? styles.active : undefined}>Môj Učet</NavLink>
            </IsAuthenticated>

        </nav>    
    )
}

export default TheNaviagtion