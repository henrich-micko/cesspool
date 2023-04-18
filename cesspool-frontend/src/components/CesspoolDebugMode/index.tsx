import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheForm from "@components/TheForm";
import useAxios from "@hooks/useAxios";
import { Cesspool } from "@types";
import React from "react";
import { glass } from "../../settings";


interface _CesspoolDebugMode {
    code: string;
    onUpdate(c: Cesspool): void;
}


export const CesspoolDebugModeTurnOn: React.FC<_CesspoolDebugMode> = (props) => {
    const axios = useAxios();

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        axios.patch("admin/cesspool/c/" + props.code, { debug_mode: true })
             .then(res => props.onUpdate(res.data))
             .catch(err => {});
    };
    
    return (
        <TheForm onSubmit={handleSubmit} style={{ "padding": "0" }}>
            <span style={{ textAlign: "left", color: glass }}>Tento profil slúži pre developeŕov, budú sa ukladať všetky záznamy aj s mqtt správami.
            Po vypnutí, sa všetky záznamy vytvorené v debug profile odstránia.</span>

            <TheButtonWrapper>
                <TheButtonInput 
                    style={{
                    fontSize: "1em",
                    marginTop: "1em",
                    border: "2px solid #4FACF7"
                }}
                type="submit" 
                value="Zapnuť"
            />
            </TheButtonWrapper>
    </TheForm>
    )
};


export const CesspoolDebugModeTurnOff: React.FC<_CesspoolDebugMode> = (props) => {
    const axios = useAxios();

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        axios.patch("admin/cesspool/c/" + props.code, { debug_mode: false })
             .then(res => props.onUpdate(res.data))
             .catch(err => {});
    };
    
    return (
        <TheForm onSubmit={handleSubmit} style={{ "padding": "0" }}>
            <span style={{ textAlign: "left", color: glass }}>Po vypnuťi sa všetky záznamy vytvorene v debug mode odstránia.</span>

            <TheButtonWrapper>
                <TheButtonInput 
                    style={{
                    fontSize: "1em",
                    marginTop: "1em",
                    border: "2px solid #ff5454"
                }}
                type="submit" 
                value="Vypnúť"
            />
            </TheButtonWrapper>
    </TheForm>
    )
};