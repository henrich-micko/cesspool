import React from "react"

import EmojyLogo from "../assets/emojy.svg"

interface Props {
    missing: string
}

const NoContent: React.FC<Props> = (props) => {
    const message = "Nenašli sa žiadne " + props.missing

    return (
        <div style={{marginTop: "3em"}}>
			<img style={{width: "9em"}} src={EmojyLogo} alt="Thinking emojy" />
			<h2>{message}</h2>
		</div>
    )
}

export default NoContent