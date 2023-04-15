import { AxiosResponse } from "axios";
import React from "react";
import styles from "./styles.module.scss";


interface _TheSugInput {
    value: string;
    placeholder: string;
    onChange(value: string): Promise<AxiosResponse<any, any>>; // return options
    onClick(value: string): void;
    disabled?: boolean;
}

const TheSugInput: React.FC<_TheSugInput> = (props) => {
    const [options, setOptions] = React.useState<string[]>([]);
    const [value, setValue] = React.useState<string>(props.value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value.trim();
        setValue(inputValue);
        
        if (!inputValue) {
            setOptions([]);
            return
        }

        props.onChange(inputValue)
             .then(res => setOptions(res.data))
             .catch(err => {});
    }

    const handleClick = (item: string) => {
        setOptions([]);
        setValue(item);
        props.onClick(item);
    }

    React.useEffect(() => console.log(options), [options]);

    return (
        <div className={styles.wrapper} >

            <input 
                type={"text"} 
                value={value}
                onChange={handleChange}
                style={options.length > 0 
                    ? { borderRadius: "7px 7px 0 0", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }
                    : {}} 
                placeholder={props.placeholder}
                disabled={props.disabled === undefined ? false : props.disabled}
                required={true}
            />

            { options.length > 0 &&
                <ul>
                    { options.map(o => <li onClick={() => handleClick(o)}>{o}</li>) }
                </ul> 
            }
        </div>
    )
}

export default TheSugInput;