import React from "react";
import styles from "@components/Navigation/styles.module.scss"
import { NavLink } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import AuthContext from "@context/AuthContext";


const Navigation: React.FC = () => {
    const { user } = React.useContext(AuthContext);

    return (
        <header className={styles.wrapper}>
            <NavLink className={styles.logo} to="/">Žumpomer</NavLink>
            <ul>
                {
                    user === null ? <>
                        <li><HashLink to="/#install">Inštalácia</HashLink></li>
                        <li><HashLink to="/#subs">Predplatné</HashLink></li>
                        <li><HashLink to="/#contact">Kontakt</HashLink></li>
                        <li><NavLink id={styles.auth} to="/account/auth">Prihlasiť sa</NavLink></li>
                    </> : 
                        <>
                            {/* client permissions */}
                            { user.permissions.includes("cesspool.related_to_cesspool") && 
                                <li>
                                    <NavLink to="/cesspool" className={({ isActive }) => (isActive ? styles.active : undefined)} >
                                        Moje žumpy
                                    </NavLink>
                                </li> }

                            {/* admin permissions */}
                            { user.permissions.includes("cesspool.manage_cesspool") && 
                                <li>
                                    <NavLink to="/admin/cesspool" className={({ isActive }) => (isActive ? styles.active : undefined)}>                                                                            
                                        Žumpy
                                    </NavLink>
                                </li> 
                            }

                            { user.permissions.includes("account.manage_account") && 
                                <li>
                                    <NavLink to="/account" className={({ isActive }) => (isActive ? styles.active : undefined)} >
                                        Uživatelia
                                    </NavLink>
                                </li>
                            }

                            { user.permissions.includes("location.manage_city") && 
                                <li>
                                    <NavLink to="/admin/city" className={({ isActive }) => (isActive ? styles.active : undefined)}>
                                        Mestá
                                    </NavLink>
                                </li> }
                        
                            {/* city admin permission */}
                            { user.permissions.includes("location.be_city_admin") && 
                                <li>
                                    <NavLink to="/cesspool" className={({ isActive }) => (isActive ? styles.active : undefined)}>
                                        Moje mesto
                                    </NavLink>
                                </li> 
                            }

                            <li><NavLink id={styles.auth} to="/account/me" >{user.email?.split("@").at(0)}</NavLink></li>
                    </>
                }        
            </ul>
        </header>
    )
}

export default Navigation