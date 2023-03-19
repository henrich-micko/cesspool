import React from "react";
import styles from "@components/Navigation/styles.module.scss"
import { NavLink } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import AuthContext from "@context/AuthContext";


const Navigation: React.FC = () => {
    const { isLogged, user } = React.useContext(AuthContext);
    
    return (
        <header className={styles.wrapper}>
            <NavLink className={styles.logo} to="/">Žumpomer</NavLink>
            <ul>
                {
                    !isLogged ? <>
                        <li><HashLink to="/#install">Inštalácia</HashLink></li>
                        <li><HashLink to="/#subs">Predplatné</HashLink></li>
                        <li><HashLink to="/#contact">Kontakt</HashLink></li>
                        <li><NavLink id={styles.auth} to="/account/auth">Prihlasiť sa</NavLink></li>
                    </> : <>
                        <li><NavLink to="/cesspool">Moje žumpy</NavLink></li>
                        <li><NavLink id={styles.auth} to="/account/" >{user.email?.split("@").at(0)}</NavLink></li>
                    </>
                }        
            </ul>
        </header>
    )
}

export default Navigation