import TheButton from "@components/form/TheButton"
import React from "react"

// Styles && assets
import logo from "../assets/logo.png"
import styles from "./HomeView.module.scss"


const Home: React.FC = () => {    
    return (
        <div className={styles.view}>
            <div className={styles.aboutWrapper}>
                <h1>Žumpomer</h1>
                <TheButton label="Navštivte našu stranku" onClick={() => {}} type="blue" />
                <TheButton label="Kontaktuje nás" onClick={() => {}} type="blue" />
            </div>

            <div className={styles.logoWrapper}>
                <img src={logo} className={styles.logo} alt="logo" />
            </div>
        </div>
    )
}

export default Home