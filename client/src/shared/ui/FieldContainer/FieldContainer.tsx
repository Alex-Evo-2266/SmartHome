import './FieldContainer.scss'

interface FieldContainerProps{
    children: React.ReactNode
    header: string
}

export const FieldContainer = ({children, header}:FieldContainerProps) => (
    <div className='field-container-ui'>
        <h4>{header}</h4>
        <div className='field-container-content'>
            {children}
        </div>
    </div>
)