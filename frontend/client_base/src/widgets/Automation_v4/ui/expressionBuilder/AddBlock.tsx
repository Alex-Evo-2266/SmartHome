
type AddBlockProps = {
    onClick: () => void
}

export const AddBlock = ({onClick}:AddBlockProps) => {



    return(
        <>
            <div>
                <span onClick={onClick}>+</span>
            </div>
        </>
    )
}