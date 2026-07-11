// layouts/GridLayout.tsx
import React from 'react';

interface GridLayoutProps {
    children: React.ReactNode;
    columns?: number;
    gap?: string;
    responsive?: boolean;
}

export const GridLayout = ({ 
    children, 
    columns = 3, 
    gap = '20px',
    responsive = true 
}: GridLayoutProps) => {
    const gridTemplateColumns = responsive 
        ? `repeat(auto-fit, minmax(280px, 1fr))`
        : `repeat(${columns}, 1fr)`;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns,
            gap,
            padding: '20px',
            width: '100%',
            minHeight: '100vh',
            background: '#f5f7fa'
        }}>
            {children}
        </div>
    );
};