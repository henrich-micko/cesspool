import React from "react"

// Styles && assets
import logo from "../assets/cesspool-logo.svg"
import styles from "./Home.module.scss"

const Home: React.FC = () => {
    return (
        <div>
            <h1>Cesspool Manager</h1>
            <em>we make the world a better place</em>

            <div>
                <img src={logo} className={styles.logo} alt="logo" />
            </div>
        </div>
    )
}

export default Home