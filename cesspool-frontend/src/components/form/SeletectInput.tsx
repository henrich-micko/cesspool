import React from "react"

// styles
import styles from "@styles/components/form/styles.module.scss"


interface Props {
    label?: string;
    value?: string;
    id?: string;
    onSubmit(value: string): void;
    options: string[][];
    selected: string|null;
}

const SelectInput: React.FC<Props> = (props) => {
    return (
        <div className={styles.selectInput}>
            {props.label !== undefined && <span>{props.label}:</span>}   
            
            <select onChange={(event) => props.onSubmit(event.target.value)}>          
                {props.options.map(item => <option selected={props.selected === item.at(0)} value={item.at(0)}>{item.at(1)}</option>)}
            </select>
        </div>
    )
}

export default SelectInput