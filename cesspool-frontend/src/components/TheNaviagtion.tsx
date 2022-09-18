import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
 
// styles
import styles from "@styles/components/theNavigation.module.scss"

// context && hooks
import AuthContext from "../context/AuthContext"
import useIsMobile from "../hooks/useIsMobile"


const TheNaviagtion: React.FC = (props) => {
    const { isLogged, user } = useContext(AuthContext)
    const isMobile = useIsMobile()

    const isUrlActive = (url: string): boolean => {
        return window.location.pathname.startsWith(url)
    }
 
    return(
        <nav className={styles.navigation}>
            {!isLogged ?
                <>
                    <NavLink to="/" className={({ isActive }) => isActive ? styles.active : undefined}>Prihlasiť sa</NavLink>
                </> :
                <>
                    <NavLink to="/machine" className={({ isActive }) => isActive ? styles.active : undefined}>Zariadenia</NavLink>
                    {user.is_superuser && <NavLink to="/admin/machine" className={() => isUrlActive("/admin") ? styles.active : undefined}>Machine admin</NavLink>}
                    {user.is_superuser && <NavLink to="/admin/machine" className={() => isUrlActive("/adminx") ? styles.active : undefined}>Account admin</NavLink>}
                    <NavLink to="/account" className={({ isActive }) => isActive ? styles.active : undefined}>Učet{!isMobile && ": " + user.email }</NavLink>
                </>
            }
        </nav>
    )
}

export default TheNaviagtion