import React from "react"

// Styles && assets
import logo from "../assets/logo.png"
import styles from "./Home.module.scss"

const Home: React.FC = () => {
    return (
        <div>
             <div>
                <img src={logo} className={styles.logo} alt="logo" />
            </div>

            <h1>Cesspool Manager</h1>
            <em>Robíme zo sveta lepšie miesto</em>
        </div>
    )
}

export default Home