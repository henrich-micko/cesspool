import TheInput, { onChangeSetState } from "@components/TheInput";
import TheSugInput from "@components/TheSugInput";
import { faArrowRight, faInbox, faShopSlash, faSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@hooks/useAxios";
import { AxiosResponse } from "axios";
import React from "react";
import { glass } from "../../settings";
import styles from "./styles.module.scss"


interface _CityInput {
    district: string;
    city: string;
    setError(error: string): void; 
    onDistrictChange(value: string): void;
    onCityChange(value: string): void;
}


const CityInput: React.FC<_CityInput> = (props) => {
    const [cityDisabled, setCityDisabled] = React.useState<boolean>(!(props.district.length > 0));
    const axios = useAxios();

    const handleDistrict = (value: string): Promise<AxiosResponse<any, any>> => {        
        props.onDistrictChange(value);
        setCityDisabled(!(value.length > 0));
        return axios.get("location/autocomplete/district?value=" + value)
    }

    const handleCity = (value: string): Promise<AxiosResponse<any, any>> => {        
        props.onCityChange(value);
        return axios.get("location/autocomplete/city?value=" + value + "&d=" + props.district)
    }

    return (
        <div className={styles.wrapper}>
            <TheSugInput 
                placeholder="Okres"
                value={props.district} 
                onChange={handleDistrict}
                onClick={props.onDistrictChange}
            />
            <FontAwesomeIcon icon={faArrowRight} color={glass}/>
            <TheSugInput 
                placeholder="Mesto"
                value={props.city} 
                disabled={cityDisabled}
                onChange={handleCity}
                onClick={props.onCityChange}
            />
        </div>
    )
}

export default CityInput;