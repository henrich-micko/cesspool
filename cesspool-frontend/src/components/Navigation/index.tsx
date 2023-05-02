import React from "react";
import styles from "@components/Navigation/styles.module.scss"
import { NavLink } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import AuthContext from "@context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faListUl } from "@fortawesome/free-solid-svg-icons";
import { useMaxWidth } from "@hooks/useIsMobile";


const Navigation: React.FC = () => {
    const [showMenu, setShowMenu] = React.useState<boolean>(false);
    const isSmall = useMaxWidth("1000px");
    const { user } = React.useContext(AuthContext);

    return (
        <header className={styles.wrapper}>
            <NavLink className={styles.logo} to="/">Žumpomer</NavLink>
            
            <div className={styles.menuWrapper}>            
                {
                    isSmall &&
                    <FontAwesomeIcon size="lg" icon={!showMenu ? faListUl : faClose} className={styles.icon} onClick={() => setShowMenu(o => o ? false : true)}/>
                }
                <ul style={{ display: showMenu && isSmall ? "block" : undefined }}>
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
                                        <NavLink to="/admin/account" className={({ isActive }) => (isActive ? styles.active : undefined)} >
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
                                        <NavLink to="/city/" className={({ isActive }) => (isActive ? styles.active : undefined)}>
                                            Moje mestá
                                        </NavLink>
                                    </li> 
                                }

                                <li><NavLink id={styles.auth} to="/account/me" >{user.email?.split("@").at(0)}</NavLink></li>
                        </>
                    }        
                </ul>
            </div>
        </header>
    )
}

export default Navigation