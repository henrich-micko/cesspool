import React from "react";


interface _TheDate {
    date: string|undefined;
    separetor?: string|undefined;
}

const TheDate: React.FC<_TheDate> = (props) => {
    
    // this is very bad ik
    if (!props.date)
        return <></>
    
    const splitedDate = props.date.split(
        props.separetor ? props.separetor : "-"
    );
        
    const year = splitedDate.at(0);
    const month = splitedDate.at(1);
    const day = splitedDate.at(2);

    return (
        <>{day + "." + month + "." + year}</>
    )
}

export default TheDate;


interface _TheTime {
    time: string|undefined;
}

export const TheTime: React.FC<_TheTime> = (props) => {
    if (!props.time)
        return <></>
    return <>{ props.time.split(".").at(0) }</>
}