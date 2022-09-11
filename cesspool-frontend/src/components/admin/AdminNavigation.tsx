import React from "react"
import { NavLink } from "react-router-dom"

// styles && icons
import styles from "@styles/components/admin/adminNavigation.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFilter, faPlusCircle, faRefresh, faSearch, faUser } from "@fortawesome/free-solid-svg-icons"


interface Props {
    handleIcon(icon: string): void;
}

const AdminNavigation: React.FC<Props> = (props) => {
    return(
        <div className={styles.adminNavigation}>
            <nav>
                <NavLink to="/admin/machine" className={({ isActive }) => isActive ? styles.active : undefined}>Machine</NavLink>
                <NavLink to="/admin/account" className={({ isActive }) => isActive ? styles.active : undefined}>Account</NavLink>
            </nav>

            <div className={styles.adminPanel}>
                <FontAwesomeIcon 
                    className={styles.icon} 
                    icon={faSearch}
                    onClick={() => props.handleIcon("search")}
                />
                <FontAwesomeIcon 
                    className={styles.icon} 
                    icon={faUser} 
                    onClick={() => props.handleIcon("filter")}
                />
                <FontAwesomeIcon 
                    className={styles.icon} 
                    icon={faPlusCircle} 
                    onClick={() => props.handleIcon("plus")}
                />
                <FontAwesomeIcon 
                    className={styles.icon} 
                    icon={faRefresh} 
                    onClick={() => props.handleIcon("refresh")}
                />
            </div>
        </div>
    )
}

export default AdminNavigation