import React from "react"

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCode, faUser } from "@fortawesome/free-solid-svg-icons"


const style = {
    display: "flex",
    width: "auto",
    height: "100%",
    alignItems: "center",

    span: {
        marginLeft: "0.25em",
        fontSize: "1.2em",
        marginBottom: "-0.15em"
    },
}


interface MachineCodeProps {
    code: string
}

export const MachineCode: React.FC<MachineCodeProps> = (props) => {
    return (
        <div style={style}>
            <FontAwesomeIcon icon={faCode} />
            <span style={style.span}>{props.code}</span>
        </div>
    )
} 

interface MachineUserProps {
    user: string|null,
}

export const MachineUser: React.FC<MachineUserProps> = (props) => {
    return (
        <div style={style}>
            <FontAwesomeIcon icon={faUser}/>
            <span style={style.span}>{props.user}</span>
        </div>
    )
}