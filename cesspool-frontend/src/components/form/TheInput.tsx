import React, { ChangeEvent, useEffect } from "react"

// styles
import styles from "@styles/components/form/styles.module.scss"

// modules
import { debounce } from "lodash-es"


interface Props {
    label?: string;
    value?: number|string;
    id?: string;
    onChange(value: string): void;
    type?: "number"|"text"
    behavior?: "auto"|"static"
}

const TheInput: React.FC<Props> = (props) => {
    const input = React.createRef<HTMLInputElement>()
    
    const type = props.type === undefined ? "text" : props.type
    const behavior = props.behavior !== undefined ? "auto" : props.behavior

    useEffect(() => {
        if (input.current !== null && props.value !== undefined) input.current.value = String(props.value) 
    }, [props.value])


    let handleChange

    if (behavior === "auto") {
        handleChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            props.onChange(value)
        }, 600)
    
    } else {
        handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            props.onChange(value)
        }
    }

    return (
        <div className={styles.theInput}>
            {props.label !== undefined && <span>{props.label}:</span>}   
            
            <input
                ref={input}
                id={props.id}
                type={type}
                onChange={handleChange}
            />
        </div>
    )
}

export default TheInput