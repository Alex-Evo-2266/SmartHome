// layouts/StackLayout.tsx

import { Children, Fragment } from "react";

interface StackLayoutProps {
    children: React.ReactNode;
    spacing?: 'sm' | 'md' | 'lg' | 'xl';
    align?: 'left' | 'center' | 'right';
    dividers?: boolean;
}

const spacingMap = {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
};

export const StackLayout = ({
    children,
    spacing = 'md',
    align = 'left',
    dividers = false
}: StackLayoutProps) => {
    const childrenArray = Children.toArray(children);
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacingMap[spacing],
            alignItems: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
            padding: '20px',
            width: '100%',
            minHeight: '100vh',
            background: '#f8f9fa'
        }}>
            {childrenArray.map((child, index) => (
                <Fragment key={index}>
                    <div style={{ width: '100%' }}>
                        {child}
                    </div>
                    {dividers && index < childrenArray.length - 1 && (
                        <div style={{
                            width: '100%',
                            height: '1px',
                            background: '#e0e0e0'
                        }} />
                    )}
                </Fragment>
            ))}
        </div>
    );
};