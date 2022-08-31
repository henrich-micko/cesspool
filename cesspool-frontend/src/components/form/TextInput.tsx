import React, { ChangeEvent } from "react"

// styles
import styles from "@styles/components/form/styles.module.scss"

// modules
import { debounce } from "lodash-es"


interface Props {
    label?: string;
    value?: string;
    id?: string;
    onSubmit(value: string): void;
}

const TextInput: React.FC<Props> = (props) => {
    const handleChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        props.onSubmit(value)
	}, 600)

    return (
        <div className={styles.textNumberInputWrapper}>
            {props.label !== undefined && <span>{props.label}:</span>}   
            
            <input
                id={props.id}
                type="text"
                defaultValue={props.value}
                onChange={handleChange}
            />
        </div>
    )
}

export default TextInput