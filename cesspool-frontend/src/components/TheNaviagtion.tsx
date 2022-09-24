import React, { ReactNode, useContext } from "react"
import { NavLink } from "react-router-dom"
 
// styles
import styles from "@styles/components/theNavigation.module.scss"

// context && hooks
import AuthContext from "@context/AuthContext"
import useIsMobile from "@hooks/useIsMobile"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faHome, faInfoCircle, faServer, faSignOut, faUser, faUserAstronaut } from "@fortawesome/free-solid-svg-icons"

interface TheNaviagtionLinkProps {
    to: string
    icon: IconProp
    children: ReactNode
}

const TheNaviagtionLink: React.FC<TheNaviagtionLinkProps> = (props) => {
    return (
        <NavLink to={props.to} className={({ isActive }) => isActive ? styles.active : undefined}>
            <FontAwesomeIcon className={styles.icon} icon={props.icon} />
            {props.children}
        </NavLink>
    )
}

interface Props {
    children?: ReactNode
}

const TheNaviagtion: React.FC<Props> = (props) => {
    const { isLogged, user } = useContext(AuthContext)

    return(
        <div className={styles.navigation}>
            <div className={styles.header}>
                <h1>Cesspool</h1>
                <FontAwesomeIcon className={styles.icon} icon={faInfoCircle} onClick={() => window.open("https://zumpomer.sk")} />
            </div>

            {isLogged &&
                <nav>
                    <TheNaviagtionLink to="/machine" icon={faHome}>Zariadenia</TheNaviagtionLink>
                    {user.is_superuser && <TheNaviagtionLink to="/admin/machine" icon={faServer}>Zariadenia admin</TheNaviagtionLink>}
                    {user.is_superuser && <TheNaviagtionLink to="/admin/account" icon={faUserAstronaut}>Uživatelia admin</TheNaviagtionLink>}
                    <TheNaviagtionLink to="/account" icon={faUser}>Môj učet</TheNaviagtionLink>
                </nav>
            }

            {props.children !== undefined &&
                <div className={styles.childrenWrapper}>
                    {props.children}
                </div>
            }
        </div>
    )
}

export default TheNaviagtion