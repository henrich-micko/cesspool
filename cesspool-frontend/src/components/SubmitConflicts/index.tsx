import React from "react";
import { Cesspool } from "@types";


function generateSubmitConflict<T>(url: string): React.FC {
    const SubmitConflit: React.FC = () => {
        const [items, setItems] = React.useState<Cesspool[]|null>(null);
    
        return (
            <div></div>
        )
    }

    return SubmitConflit;
}

export default generateSubmitConflict;