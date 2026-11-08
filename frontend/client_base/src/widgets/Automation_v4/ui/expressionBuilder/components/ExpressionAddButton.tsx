
import styles from "./ExpressionAddButton.module.scss"

interface ExpressionAddButtonProps {
    onClick: () => void
    label?: string
}

export const ExpressionAddButton = ({
    onClick,
    label = "+"
}: ExpressionAddButtonProps) => {
    return (
        <button
            type="button"
            className={styles.addButton}
            onClick={onClick}
            title="Добавить элемент выражения"
        >
            {label}
        </button>
    )
}
