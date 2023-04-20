import TheBox from "@components/TheBox";
import { Cesspool, Record, UserAsField } from "@types";
import { getCity, getName } from "../../formats";
import React from "react";
import styles from "./styles.module.scss";
import TheBattery from "@components/TheBattery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSmile, faTrash, faWarning, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import TheLevel from "@components/TheLevel";
import { glass, red } from "../../settings";
import { Link } from "react-router-dom";
import AccountLink from "@components/AccountLink";


export interface _CesspoolItem {
    code: string;
    owner: UserAsField|null;
    city: string;
    record: Record|null;
    problems: string[];
    delete_at: string|null;
    isOwner?: boolean;

    showCity?: boolean;
    showOwner?: boolean;
    showIsOwner?: boolean;
};

const CesspoolItem: React.FC<_CesspoolItem> = (props) => {
    return (
        <tr>
            <th><Link to={"/admin/cesspool/" + props.code}>{props.code}</Link></th>
            { props.showCity && <th><Link to={"/admin/city/"+props.city }>{ getCity(props.city) }</Link></th> }
            { props.showIsOwner && <th style={{ textAlign: "center" }}>{<FontAwesomeIcon icon={props.isOwner ? faXmarkCircle : faCheckCircle} />}</th> }
            { props.showOwner && <th style={{ color: glass }}>{ props.owner ? <AccountLink {...props.owner} /> : "Bez vlastnika" }</th> }
            <th>
                <div className={styles.icons}>
                    { props.delete_at !== null && <FontAwesomeIcon icon={faTrash} color={red} /> }
                    { props.problems.length > 0 && <FontAwesomeIcon icon={faWarning} color={red} /> }
                    <TheBattery value={props.record ? props.record.battery : null} />
                    <TheLevel value={props.record ? props.record.level_percent : null} />
                </div>
            </th>
        </tr>
    )
}

export interface _CesspoolTable {
    cesspools: _CesspoolItem[];
}

function generateCesspoolTable({location = true, isOwner = true, owner = true, compareWithUser = ""}): React.FC<_CesspoolTable> {
    const CesspoolTable: React.FC<_CesspoolTable> = (props) => {        
        console.log(props.cesspools);
        return (
            <TheBox style={{ width: "100%", padding: 0 }}>
                <table className={styles.cesspoolTable}> 
                    <tr>
                        <th>Žumpa</th>
                        { location && <th>Mesto</th> }
                        { isOwner && <th>Je vlastnik</th> }
                        { owner && <th>Vlastnik</th> }
                        <th>Status</th>
                    </tr>
                    { props.cesspools.map(c => 
                        <CesspoolItem 
                            {...c} 
                            showCity={location} 
                            showIsOwner={isOwner} 
                            showOwner={owner} 
                            isOwner={c.owner !== null && c.owner.email === compareWithUser}
                        />) } 
                </table>
            </TheBox>
        )
    } 

    return CesspoolTable;
}

export default generateCesspoolTable;


export const toCesspoolItem = (cesspool: Cesspool) => {
    return cesspool as _CesspoolItem;
};