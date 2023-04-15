import React from "react";
import { IsNotAuthenticatedView } from "@permissions/Authenticated";
import Navigation from "@components/Navigation";
import Page from "@components/Page"
import styles from "@pages/home/styles.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowDown, faCheckCircle, faXmarkCircle } from "@fortawesome/free-solid-svg-icons"
import { HashLink } from "react-router-hash-link";
import { Subscription } from "@types"
import Picture1 from "@assets/Zumpomer-obr1.png";
import Picture2 from "@assets/Zumpomer-obr2.png";
import Picture3 from "@assets/Zumpomer-obr3.png";
import useAxios from "@hooks/useAxios";


interface _SubscriptionBoxParam {
    about: string;
    value: any;
}

export const SubscriptionBoxParam: React.FC<_SubscriptionBoxParam> = (props) => {    
    return (
        <li className={styles.subscriptionBoxParam}>
            <span>
                {props.about}
                { typeof props.value === "boolean"
                  ? <FontAwesomeIcon
                        className={styles.icon}
                        icon={props.value ? faCheckCircle : faXmarkCircle}
                        color={props.value ? "#009473" : "#ff5454"}
                    />
                  : <span>: {props.value}</span> 
                }
            </span>
        </li>
    )
}


export const SubscriptionBox: React.FC<Subscription> = (props) => {
    return (
        <div className={styles.subscriptionBox}>
            <div className={styles.header}>
                <h3>{props.title}</h3>
                <article>{props.about}</article>
            </div>
            <div className={styles.body}>
                <ul>
                    <SubscriptionBoxParam about="Email notifikacie" value={props.email_notf} />
                    <SubscriptionBoxParam about="Sms notifikacie" value={props.sms_notf} />
                    <SubscriptionBoxParam about="Výmena dielov" value={props.change_parts} />
                    <SubscriptionBoxParam about="Počet vlastnikov" value={props.max_owners} />
                </ul>
                {props.month_paying !== null && 
                    <>
                        <span className={styles.cost}>{props.month_paying}€</span>
                        <span className={styles.costAbout}>mesačne</span>
                    </>
                }
            </div>
        </div>
    )
}


interface _ScrollButton {
    id: string;
}

export const ScrollButton: React.FC<_ScrollButton> = (props) => {
    return (
        <HashLink to={"#" + props.id}>
            <FontAwesomeIcon className={styles.scrollButton} icon={faCircleArrowDown} size="2x" color={"#6A718A"}/>
        </HashLink>
    )
}


interface _InstallationBox {
    src: string;    
    head: string;
    about: string;
}

export const InstallationBox: React.FC<_InstallationBox> = (props) => {
    return (
        <div className={styles.installationBox}>
            <img src={props.src} alt="Really cool picture" />
            <div>
                <h3>{props.head}</h3>
                <span>{props.about}</span>
            </div>
        </div>
    ) 
}


const HomePage: React.FC = () => {
    const [subs, setSubs] = React.useState<Subscription[]>([]);

    const axios = useAxios();
    const fetchData = () => {
        axios.get("subs/")
             .then(res => setSubs(res.data))
             .catch(() => {});
    }

    React.useEffect(fetchData, []);

    return (
        <>
            <Page>
                <Navigation />
                <div className={styles.cesspoolPoem}>
                    <em>
                        V hĺbkach, kde jama leží,<br />
                        systém detekuje, čo hrozí.<br />
                        Tehnológie zázrak, splnený sen,<br />
                        chráni domovy a odpad celý deň.<br />
                        -- Florence Wood --
                    </em>
                </div>
                
                <ScrollButton id="install" />
            </Page>

            <Page>
                <h2 className={styles.pageHeader} id="install">Prevedenie inštalácií v praxi</h2>
                
                <div className={styles.installationBoxes}>
                    <InstallationBox 
                        src={Picture1} 
                        head="Snímač a elektronika" 
                        about="Uchytenie systému Žumpomera." 
                    />

                    <InstallationBox 
                        src={Picture2} 
                        head="Elektronika" 
                        about="Fixné upevnenie na stenu." 
                    />

                    <InstallationBox 
                        src={Picture3} 
                        head="Snímač" 
                        about="Uchytenie snímača a káblov v hlbšej šachte" 
                    />
                </div>

                <ScrollButton id="subs" />
            </Page>

            <Page>
                <h2 className={styles.pageHeader} id="subs">Predplatne</h2>
            
                <div className={styles.subscriptions}>
                    { subs.map(sub => 
                        <SubscriptionBox {...sub}/> )}
                </div>
            </Page>
        </>
    )
}

export default HomePage