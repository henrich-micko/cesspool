import SwithInput from "@components/SwitchInput";
import translate from "@permissions/translate";
import React from "react";


interface _GroupsInput {
    groups: string[];
    onUpdate(group: string, value: boolean): void;
}

const GroupsInput: React.FC<_GroupsInput> = (props) => {
    const [client, setClient] = React.useState<boolean>(props.groups.includes("client"));
    const [admin, setAdmin] = React.useState<boolean>(props.groups.includes("admin"));
    const [cityAdmin, setCityAdmin] = React.useState<boolean>(props.groups.includes("city_admin"));
    
    const handleClick = (group: "client"|"admin"|"city_admin") => {
        if (group === "client") { 
            setClient(client ? false : true);
            props.onUpdate("client", client ? false : true);
        } 
        
        else if (group === "admin") {
            setAdmin(admin ? false : true);
            props.onUpdate("admin", admin ? false : true);
        } 
        
        else {
            setCityAdmin(cityAdmin ? false : true);
            props.onUpdate("city_admin", cityAdmin ? false : true);
        };
    };

    return (
        <>
            <SwithInput label={ translate("client") } value={client} onClick={() => handleClick("client")} />
            <SwithInput label={ translate("admin") } value={admin} onClick={() => handleClick("admin")} />
            <SwithInput label={ translate("city_admin") } value={cityAdmin} onClick={() => handleClick("city_admin")} />
        </>
    )
}

export default GroupsInput;