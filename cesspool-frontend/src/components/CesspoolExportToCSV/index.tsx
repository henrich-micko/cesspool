import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import TheForm from "@components/TheForm";
import useAxios from "@hooks/useAxios";
import React from "react";
import { glass } from "../../settings";


interface _CesspoolExportCSV {
    district: string;
    city: string;
};


export function downloadCsvFile({data = [], fileName = "Untitled.csv"}) {
    const blob = new Blob([...data], { type: "text/csv" });
  
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);  
    
    const clickEvt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    
    a.dispatchEvent(clickEvt);
    a.remove();
};


const CesspoolExportCSV: React.FC<_CesspoolExportCSV> = (props) => {
    const [data, setData] = React.useState<[]|null>(null);
    const [isReadyFredy, setIsReadyFredy] = React.useState<boolean>(false);

    const axios = useAxios();

    const fetchData = () => {
        axios.get("location/city/" + props.district + "/" + props.city + "/csv")
             .then(res => setData(res.data))
             .catch(err => {});
    };

    React.useEffect(fetchData, []);

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (data !== null) downloadCsvFile({data: data, fileName: "zumpomer_"+props.district+"_"+props.city+".csv"});
    }

    return (
        <TheForm onSubmit={handleSubmit}>
            <span style={{ textAlign: "left", color: glass }}>Exportovať data o vyprazdenení žump.</span>

            <TheButtonWrapper>
                <TheButtonInput 
                        style={{
                        fontSize: "1em",
                        marginTop: "1em",
                        border: "2px solid #4FACF7"
                    }}
                    type="submit" 
                    value="Exportovať"
                    disabled={data === null}
                />
            </TheButtonWrapper>
        </TheForm>
    );
};

export default CesspoolExportCSV;