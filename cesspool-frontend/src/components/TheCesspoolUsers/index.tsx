import React from "react";
import styles from "@components/TheCesspoolUsers/styles.module.scss";
import { CesspoolToUser, SimpleCesspoolToUser } from "@types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPlusCircle, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { glass, red } from "../../settings";
import TheForm from "@components/TheForm";
import { TheButtonInput, TheButtonWrapper } from "@components/TheButton";
import useAxios from "@hooks/useAxios";
import AuthContext from "@context/AuthContext";
import TheInput from "@components/TheInput";


interface _NewCesspoolUser {
    onSubmit(user: string): void;
}

const NewCesspoolUser: React.FC<_NewCesspoolUser> = (props) => {
    const [user, setUser] = React.useState<string>("");

    const handleSubmit = () => {
        if (user === "")
            return;
        
        props.onSubmit(user);
        setUser("");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser(e.target.value.trim());
    }
    
    return (
        <li>
            <TheInput 
                value={user}
                onChange={handleChange}
                placeholder="Nový puživateľ..."
                color={glass}
                style={{ "borderBottomColor": glass }}
            />
        
            <div className={styles.iconWrapper}>
                { <FontAwesomeIcon color={glass} icon={faPlus} onClick={handleSubmit} /> }
            </div>
    </li>
    )
}


interface _TheCesspoolUser {
    key: number;
    user: string;
    is_super_owner: boolean;
    onTrashClick(user: string): void;
}

const CesspoolUser: React.FC<_TheCesspoolUser> = (props) => {
    return (
        <li key={props.key}>
            <span>{props.user}</span>
            
            <div className={styles.iconWrapper}>
                { props.is_super_owner && <FontAwesomeIcon icon={faStar} /> }
                { !props.is_super_owner && <FontAwesomeIcon icon={faTrash} color={red} onClick={() => props.onTrashClick(props.user)} /> }
            </div>
        </li>
    )
}

interface _TheCesspoolUsers {
    code: string;
    users: string[];
    max: number;
    onUpdate(ctu: CesspoolToUser): void;
}

const TheCesspoolUsers: React.FC<_TheCesspoolUsers> = (props) => {
    const [users, setUsers] = React.useState<string[]>(props.users);
    const [isChanged, setIsChanged] = React.useState<boolean>(false);

    const { user } = React.useContext(AuthContext);
    const axios = useAxios();

    const handleDelete = (user: string) => {
        setUsers((oldUsers) => oldUsers.filter(u => u !== user));
        setIsChanged(true);
    }

    const handleAdd = (user: string) => {
        if (users.includes(user)) 
            return
        setUsers([ ...users, user ]);
        setIsChanged(true);
    }

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        axios.patch("cesspool/c/" + props.code, { "cesspool_users": users })
             .then(res => props.onUpdate(res.data))
             .catch(() => {});
    }
    
    return (
        <TheForm onSubmit={handleSubmit} style={{ "gap": "2em" }}>
            <ul className={styles.users}>
                { users.map((user_email, index) => 
                    <CesspoolUser key={index} user={user_email} is_super_owner={user !== null && user_email === user.email} onTrashClick={handleDelete} />) }
                { users.length < props.max && <NewCesspoolUser onSubmit={handleAdd} /> }
            </ul>
                
            <div className={styles.formBottom}>
                <span>Max {props.max} použivatelia.</span>

                <TheButtonWrapper>
                    <TheButtonInput
                        style={{
                            fontSize: "1em",
                            borderColor: !isChanged ? glass : undefined, 
                            color: !isChanged ? glass : undefined 
                        }}
                        type="submit" 
                        value="Uložiť"
                        disabled={!isChanged}
                    />
                </TheButtonWrapper>
            </div>
        </TheForm>
    )
}

export default TheCesspoolUsers;