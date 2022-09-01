import React from "react"

// Styles && assets
import logo from "../assets/logo.png"
import styles from "./HomeView.module.scss"


const Home: React.FC = () => {    
    return (
        <div>
             <div>
                <img src={logo} className={styles.logo} alt="logo" />
            </div>

            <h1>Cesspool Manager</h1>
            <p>Naštívte našu <a href="https://zumpomer.sk"> domovskú stranku</a></p>
            <p>Kontaktuje nás na náš <a href="mailto:heno.micko@gmail.com">email</a></p>

            <br />
        </div>
    )
}

export default Home