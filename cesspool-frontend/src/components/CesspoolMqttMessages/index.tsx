import React from "react";
import { Record } from "@types";
import TheBox from "@components/TheBox";
import { glass, red } from "../../settings";


interface _CesspoolMqttMessages {
    records: Record[];
}

const CesspoolMqttMessages: React.FC<_CesspoolMqttMessages> = (props) => {
    return (
        <TheBox style={{"width": "100%", "margin": 0, "padding": 0, borderColor: red, overflowY: "scroll", overflowX: "hidden", height: "25em"}}>
            <span style={{ color: "white", paddingLeft: "1em", paddingTop: "1em", width: "100%", textAlign: "left", display: "inline-block" }}>Mqtt záznamy:</span>
            { props.records.map(r => <>{
                r.mqtt_message?.split("&&").map(m => <p style={{ color: glass, margin: 0, textAlign: "left", paddingLeft: "1em" }}>{m}</p>)
            }<br /></> ) }
        </TheBox>
    )
};

export default CesspoolMqttMessages;