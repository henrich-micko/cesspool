import React from "react";
import styles from "@components/TheFooter/styles.module.scss";


const TheFooter: React.FC = () => {
    return (
        <footer className={styles.theFooter}>
            <span>© 2023 Žumpomer - Henrich Mičko</span>
        </footer>
    )
}

export default TheFooter;