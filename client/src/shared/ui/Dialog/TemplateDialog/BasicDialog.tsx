import "../Dialog.scss"

interface DialogProps{
    children: React.ReactNode
    header?: string
    action?: React.ReactNode
    onHide?: ()=>void
    className?: string
}

export const BasicTemplateDialog = ({className, children, header, action, onHide}:DialogProps) => {

    function hide() {
        onHide && onHide()
    }

    return(
        <>
        <div onClick={hide} style={{zIndex: "999"}} className="backplate"></div>
        <div className={`dialog-container ${className}`}>
            <div className="dialog-header"><h2 className="text-3xl">{header}</h2></div>
            <div className="dialog-content">
            {children}
            </div>
            {
                (action)?
                <div className="dialog-action">
                    {action}
                </div>:null
            }
        </div>
        </>
        
    )
}