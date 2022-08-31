import React from "react"

// styles && animations
import styles from "@styles/components/theBoard.module.scss"
import classNames from "classnames"
import { useAutoAnimate } from '@formkit/auto-animate/react'

// hooks
import useIsMobile from "@hooks/useIsMobile"


interface Props {
    children: React.ReactNode,
    isActive?: boolean
}

const TheBoard: React.FC<Props> = (props) => {
    const isMobile = useIsMobile()
    const [animationParent] = useAutoAnimate<HTMLDivElement>()

    return (
        <div ref={animationParent} className={classNames(styles.board, isMobile && styles.isMobile, props.isActive && styles.activate)}>
            {props.children}
        </div>
    )
}

export default TheBoard