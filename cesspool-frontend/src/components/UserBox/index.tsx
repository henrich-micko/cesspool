import React from "react";
import styles from "./styles.module.scss";
import { TheBoxMin } from "@components/TheBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartBroken, faPerson, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { red } from "../../settings";
import translate from "@permissions/translate";


interface _UserBox {
    pk: number;
    email: string;
    deleteAt: string|null;
    createdBy: string|null;
    groups: string[];
    isActive: boolean;
    isMe: boolean;
    onClick(pk: number): void;
}

const UserBox: React.FC<_UserBox> = (props) => {
    return (
        <TheBoxMin
            style={{
                "padding": 0,
                "marginTop": "2em",
                "cursor": "pointer",
                "height": "fit-content",
                "width": "auto"
            }}
            onClick={() => props.onClick(props.pk)} >

            <div className={styles.header}>
                <h2>{ props.email.split("@").at(0) }</h2>

                <div className={styles.iconWrapper}>
                   { props.isActive && props.deleteAt && <FontAwesomeIcon icon={faTrash} color={red} /> }
                   { !props.isActive && <FontAwesomeIcon icon={faHeartBroken} color={red} /> }
                   { props.isMe && <FontAwesomeIcon icon={faUser} /> }
                </div>
            </div>
            
            <div className={styles.group}>
                <span>
                    { props.groups.length > 0 
                           ? props.groups.map(g => <>{translate(g)} / </>)
                           : "Zatiaľ bez povolení" }
                </span>
            </div>
        </TheBoxMin>
    )
}

export default UserBox;