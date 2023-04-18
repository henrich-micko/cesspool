import TheInput, { onChangeSetState } from "@components/TheInput";
import React from "react";


interface _DateInput {
    value: string;
}

const DateInput: React.FC<_DateInput> = (props) => {
    const [value, setValue] = React.useState<string>(props.value);
    const [error, setError] = React.useState<string|null>(null);


    return (
        <div>
            <TheInput 
                type={"text"}
                value={value.toString()}
                onChange={onChangeSetState(setValue, setError)}
            />
        </div>
    )
};

export default DateInput;