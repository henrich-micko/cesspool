import { ChangeEvent, Dispatch, SetStateAction } from "react";
import styled from "styled-components";


export function onChangeSetState(setState: Dispatch<SetStateAction<any>>, clearError: Dispatch<SetStateAction<any>>|null = null, trim: boolean = true) {
    return function eventHandler(event: ChangeEvent<HTMLInputElement>) {
        const value = trim ? event.target.value.trim() : event.target.value;
        setState(value);
        clearError && clearError(null);
    }
}

const TheInput = styled.input`
    color: #fff;
    font-size: 1em;
    background: none;
    border: none;
    border-bottom: 0.125em solid hsla(0, 0%, 100%, 0.9);
    display: block;
    text-align: left;
    margin: 0 auto 0.5em;
    width: 100%;
`;

export default TheInput;