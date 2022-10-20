import React from "react"
import ReactLoading from 'react-loading'
import styles from "@styles/components/theLoading.module.scss"

interface Props {
    size?: string|number
}

const TheLoading: React.FC<Props> = (props) => {
    return (
        <div className={styles.loadingWrapper}>
            <ReactLoading 
                width={props.size} 
                height={props.size}
                color={"#61dafb"}
                type={"spin"}
            />
        </div>
    )
}

export default TheLoading