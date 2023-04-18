import React, { createRef, ReactNode, useContext, useEffect, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
 
// styles
import styles from "@styles/components/theNavigation.module.scss"

// context && hooks
import AuthContext from "@context/AuthContext"
import useIsMobile, { useMaxWidth } from "@hooks/useIsMobile"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { icon, IconProp } from "@fortawesome/fontawesome-svg-core"
import { faClose, faHome, faInfoCircle, faListUl, faServer, faUser, faUserAstronaut } from "@fortawesome/free-solid-svg-icons"
import classNames from "classnames"
import { useSwipeable } from "react-swipeable"


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
    defaultBehavior?: "static"|"dynamic-hidden"|"dynamic-viewed"
}

const TheNaviagtion: React.FC<Props> = (props) => {
    const { isLogged, user } = useContext(AuthContext)
    
    const isUnderMiddleSize = useMaxWidth("1700px")
    const viewMenuIcon = !useMaxWidth("470px");
    const [behavior, setBehavior] = useState<"static"|"dynamic-hidden"|"dynamic-viewed">()

    const iconRef = createRef<SVGSVGElement>()

    useEffect(() => {
        setBehavior(isUnderMiddleSize ? props.defaultBehavior !== undefined ? props.defaultBehavior : "dynamic-viewed" : "static")
    }, [isUnderMiddleSize])

    useEffect(() => {
        document.body.style.overflow = ""
        if (behavior === "dynamic-viewed") document.body.style.overflow = "hidden"
    }, [behavior])

    const handleBehaviorIcon = () => {
        if (behavior === "dynamic-hidden") setBehavior("dynamic-viewed")
        else if (behavior === "dynamic-viewed") setBehavior("dynamic-hidden")
    }

    const currentView = () => {
        const path = window.location.pathname

        if (path === "/machine") return "Zariadenia"
        if (path === "/admin/machine") return "Zariadenia admin"
        if (path === "/admin/account") return "Uživatelia admin"
        if (path === "/account") return "Môj učet"
    }

    const handlers = useSwipeable({
        onSwiped: (eventData) => eventData.dir === "Left" && setBehavior("dynamic-hidden"),
    });

    const ClickOutHandler = require('react-onclickout');

    const onClickOut = (e: any) => {
        if (behavior === "dynamic-viewed" && iconRef.current !== e.target) setBehavior("dynamic-hidden")
    }

    return (
        <>
            <ClickOutHandler onClickOut={onClickOut}>
                <div className={classNames(styles.navigation, behavior === "dynamic-hidden" && styles.hidden)} {...handlers}>
                    <div className={styles.headder}>
                        <h1>Žumpomer</h1>
                        <FontAwesomeIcon className={styles.icon} icon={faInfoCircle} onClick={() => window.open("https://zumpomer.sk")} />
                    </div>

                    {isLogged &&
                        <nav>
                            <TheNaviagtionLink to="/machine" icon={faHome}>Zariadenia</TheNaviagtionLink>
                            {user.is_staff && <TheNaviagtionLink to="/admin/machine" icon={faServer}>Zariadenia admin</TheNaviagtionLink>}
                            {user.is_staff && <TheNaviagtionLink to="/admin/account" icon={faUserAstronaut}>Uživatelia admin</TheNaviagtionLink>}
                            <TheNaviagtionLink to="/account" icon={faUser}>Môj učet</TheNaviagtionLink>
                        </nav>
                    }

                    {props.children !== undefined &&
                        <div className={styles.childrenWrapper}>
                            {props.children}
                        </div>
                    }
                </div>
            </ClickOutHandler>

            {
                (behavior === "dynamic-hidden" || behavior === "dynamic-viewed") &&
                <div className={styles.navigationHeadder}>
                    <h1>{currentView()}</h1>
                    {(viewMenuIcon || behavior === "dynamic-hidden") && <FontAwesomeIcon ref={iconRef} icon={behavior === "dynamic-hidden" ? faListUl : faClose} onClick={handleBehaviorIcon} size="lg"/>}
                </div> 
            }
        </>
    )
}

export default TheNaviagtion