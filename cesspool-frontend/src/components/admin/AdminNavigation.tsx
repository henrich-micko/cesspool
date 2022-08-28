import React from "react"
import { NavLink } from "react-router-dom"

// styles && icons
import styles from "./styles.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faRefresh } from "@fortawesome/free-solid-svg-icons"


interface Props {
    onPlus(): void;
    onRefresh(): void;
}

const AdminNavigation: React.FC<Props> = (props) => {
    return(
        <div className={styles.adminNavigation}>
            <nav>
                <NavLink to="/admin/machine" className={({ isActive }) => isActive ? styles.active : undefined}>Machine</NavLink>
                <NavLink to="/admin/account" className={({ isActive }) => isActive ? styles.active : undefined}>Account</NavLink>
            </nav>

            <div className={styles.adminPanel}>
                <FontAwesomeIcon className={styles.icon} icon={faPlusCircle} onClick={props.onPlus}/>
                <FontAwesomeIcon className={styles.icon} icon={faRefresh} onClick={props.onRefresh} />
            </div>
        </div>
    )
}

export default AdminNavigation