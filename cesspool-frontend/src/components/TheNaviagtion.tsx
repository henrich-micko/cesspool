import React from "react"
import { NavLink } from "react-router-dom"
 
// Styles
import styles from "./TheNavigation.module.scss"

const TheNaviagtion: React.FC = () => {
    return(
        <nav className={styles.navigation}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : undefined}>Home</NavLink>
            <NavLink to="/account/login" className={({ isActive }) => isActive ? styles.active : undefined}>Login</NavLink>
            <NavLink to="/account/signup" className={({ isActive }) => isActive ? styles.active : undefined}>Sign up</NavLink>
        </nav>    
    )
}

export default TheNaviagtion