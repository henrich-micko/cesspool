import React from "react"

// styles && animations
import styles from "@styles/components/themedBox.module.scss"
import classNames from "classnames"
import { useAutoAnimate } from '@formkit/auto-animate/react'


interface Props extends React.HTMLAttributes<HTMLDivElement> {
    label?: string|React.ReactNode
    header?: React.ReactNode
}

const ThemedBox: React.FC<Props> = (props) => {
    const [animationParent] = useAutoAnimate<HTMLDivElement>()

    const { label, children, ...rest } = props;
    
    const propsClassName = rest.className
    delete rest.className 

    return (
        <div ref={animationParent} className={classNames(styles.themedBox, propsClassName)} {...rest}>
            {props.label &&
                <div className={classNames(styles.header)}>
                    {
                        typeof props.label === "string" ?
                        <h2>{props.label}</h2>
                        : props.label !== undefined && props.label
                    }

                    <div className={styles.propsHeader}>
                        {props.header !== undefined && props.header}
                    </div>
                </div>
            }
            <div className={styles.body}>
                {props.children}
            </div>
        </div>
    )
}

export default ThemedBox