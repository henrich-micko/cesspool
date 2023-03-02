import React from "react";
import styles from "@components/PopupWin/styles.module.scss";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";


export const TheMask = styled.div`
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 98;
`;


interface _PopupWin {
    close(): void;
    label?: string;
    children: React.ReactNode;
}

const PopupWin: React.FC<_PopupWin> = (props) => {
    return (
        <>
            <TheMask />
            
            <div className={styles.popupWin}>
                <div className={styles.header}>
                    <h2>{props.label !== undefined ? props.label : "Hello world"}</h2>    
                    <FontAwesomeIcon
                        icon={faClose}
                        onClick={props.close}
                    />
                </div>
                <div className={styles.body}>
                    {props.children}
                </div>
            </div>
        </>
    )
}

export default PopupWin;