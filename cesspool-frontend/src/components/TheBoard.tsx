import React from "react"

// styles && animations
import styles from "@styles/components/theBoard.module.scss"
import classNames from "classnames"
import { useAutoAnimate } from '@formkit/auto-animate/react'

// hooks
import useIsMobile from "@hooks/useIsMobile"


interface Props {
    children: React.ReactNode
    isActive?: boolean
    label?: string
    className?: string
    style?: {}
    align?: "left"|"center"|"right"
}

const TheBoard: React.FC<Props> = (props) => {
    const isMobile = useIsMobile()
    const [animationParent] = useAutoAnimate<HTMLDivElement>()

    const align: Props["align"] = props.align !== undefined ? props.align : "left"

    return (
        <div
            style={props.style}
            ref={animationParent} 
            className={classNames(
                styles.board, 
                isMobile && styles.isMobile, 
                props.isActive && styles.activate,
                props.className
            )}
        >
            {props.label &&
                <div 
                    className={classNames(
                        styles.header, 
                        align !== undefined ?
                        align === "left" ? styles.left :
                        align === "right" ? styles.right :
                        align === "center" ? styles.center : undefined : undefined
                    )}>
                    <h2>{props.label}</h2>
                </div>
            }
            <div className={styles.body}>
                {props.children}
            </div>
        </div>
    )
}

export default TheBoard