import React from "react";
import styles from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";


interface _SearchBar {
    onChange(filter: string|null): void;
}

const SearchBar: React.FC<_SearchBar> = (props) => {
    const [filter, setFilter] = React.useState<string|null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value.trim());
    } 

    React.useEffect(() => props.onChange(filter), [filter]);

    return (
        <div className={styles.wrapper} style={{"border": filter !== null && filter.length > 0 ? "1px solid #96d0ff" : undefined }}>
            <input 
                type="text" 
                placeholder="Vyhľadať..."
                value={filter === null ? undefined : filter} 
                onChange={handleChange} />

            <FontAwesomeIcon icon={faSearch} />
        </div>
    )
}

export default SearchBar;