import React from "react"

import EmojyLogo from "../assets/emojy.svg"

interface Props {
    missing: string
}

const NoContent: React.FC<Props> = (props) => {
    const message = "Nenašli sa žiadne " + props.missing

    return (
        <div style={{marginTop: "3em", display: "flex", justifyContent: "center"}}>
			<h2>{message}</h2>
            <img style={{width: "2em", marginLeft: "0.5em"}} src={EmojyLogo} alt="Thinking emojy" />
		</div>
    )
}

export default NoContent