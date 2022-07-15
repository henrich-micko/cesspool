import React from "react"
import { NavLink } from "react-router-dom"
 
// Styles
import styles from "./TheNavigation.module.scss"

const TheNaviagtion: React.FC = () => {
    return(
        <nav className={styles.navigation}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : undefined}>Domov</NavLink>
            <NavLink to="/account/signin" className={({ isActive }) => isActive ? styles.active : undefined}>Prihlásenie</NavLink>
            <NavLink to="/account/signup" className={({ isActive }) => isActive ? styles.active : undefined}>Registrácia</NavLink>
        </nav>    
    )
}

export default TheNaviagtion