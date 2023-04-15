import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheDate, { TheTime } from "@components/TheDate";
import TheError from "@components/TheError";
import TheForm from "@components/TheForm";
import useAxios from "@hooks/useAxios";
import React from "react";


function generateDeleteItem<T>(): React.FC<{title: string, url: string, onDelete(item: T): void}> {
    
    const DeleteItem: React.FC<{title: string, url: string, onDelete(item: T): void}> = (props) => {
        const [error, setError] = React.useState<string|null>(null);

        const axios = useAxios();
        const handleSubmit = (event: React.SyntheticEvent) => {
            event.preventDefault();
            axios.delete(props.url)
                .then(res => (props.onDelete(res.data)))
                .catch(err => setError("Nepodarilo sa odstraniť."));
        }
        
        return (
            <TheForm onSubmit={handleSubmit} style={{ "padding": "0" }}>
                <span style={{ textAlign: "left" }}>Važňe chcete odstraniť { props.title } ??</span>
                { error && <TheError>{error}</TheError> }
                <TheButtonWrapper>
                    <TheButtonInput 
                        style={{
                            fontSize: "1em",
                            marginTop: "1em",
                            border: "2px solid #ff5454"
                        }}
                        type="submit" 
                        value="Odstraniť"
                    />
                </TheButtonWrapper>
            </TheForm>
        )
    }

    return DeleteItem;
}

export default generateDeleteItem;

export function generateRestoreItem<T>(): React.FC<{title: string, url: string, deleteAt: string, onRestore(item: T): void}> {
    
    const RestoreItem: React.FC<{title: string, url: string, onRestore(item: T): void, deleteAt: string,}> = (props) => {
        const [error, setError] = React.useState<string|null>(null);

        const axios = useAxios();
        const handleSubmit = (event: React.SyntheticEvent) => {
            event.preventDefault();
            axios.get(props.url)
                .then(res => (props.onRestore(res.data)))
                .catch(err => setError("Nepodarilo sa obnoviť."));
        }
        
        return (
            <TheForm onSubmit={handleSubmit} style={{ "padding": "0" }}>
                <span style={{ textAlign: "left" }}>
                    { props.title } sa odstráni <TheTime time={props.deleteAt.split("T").at(1)} /> <TheDate date={props.deleteAt.split("T").at(0)} />
                </span>
                { error && <TheError>{error}</TheError> }
                <TheButtonWrapper>
                    <TheButtonInput
                        style={{
                            fontSize: "1em",
                            marginTop: "1em",
                        }}
                        type="submit" 
                        value="Obnoviť"
                    />
                </TheButtonWrapper>
            </TheForm>
        )
    }

    return RestoreItem;
}