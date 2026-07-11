// layouts/CardLayout.tsx
import React from 'react';

interface CardLayoutProps {
    children: React.ReactNode;
    columns?: number;
    gap?: string;
    cardMinWidth?: string;
}

export const CardLayout = ({ 
    children, 
    columns = 4, 
    gap = '24px',
    cardMinWidth = '250px'
}: CardLayoutProps) => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${cardMinWidth}, 1fr))`,
            gap,
            padding: '24px',
            width: '100%',
            minHeight: '100vh',
            background: '#f8f9fa'
        }}>
            {React.Children.map(children, (child) => (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    padding: '20px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    // ':hover': {
                    //     transform: 'translateY(-2px)',
                    //     boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    // }
                }}>
                    {child}
                </div>
            ))}
        </div>
    );
};