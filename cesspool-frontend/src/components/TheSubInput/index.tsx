import useAxios from "@hooks/useAxios";
import { Subscription } from "@types";
import React from "react";


interface _TheSubInput {
    defaultSub: number; 
    onChange(subPk: number): void;
}

const TheSubInput: React.FC<_TheSubInput> = (props) => {
    const [subs, setSubs] = React.useState<Subscription[]>([]);
    
    const axios = useAxios();
    const fetchData = () => {
        axios.get("subs/")
             .then(res => setSubs(res.data))
             .catch(err => {});
    };

    React.useEffect(fetchData, []);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const subTitle = event.target.value;
        const sub = subs.filter(s => s.title === subTitle).at(0);
        props.onChange(sub ? sub.pk : props.defaultSub);
    };

    return (
        <select onChange={handleChange}>
            { subs.map(item => <option selected={item.pk === props.defaultSub}>{item.title}</option>) }
        </select>
    )
}

export default TheSubInput;