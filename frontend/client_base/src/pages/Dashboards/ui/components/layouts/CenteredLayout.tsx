// layouts/CenteredLayout.tsx
import React from 'react';

interface CenteredLayoutProps {
    children: React.ReactNode;
    maxWidth?: string;
    background?: string;
}

export const CenteredLayout = ({
    children,
    maxWidth = '1200px',
    background = '#f5f7fa'
}: CenteredLayoutProps) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            background
        }}>
            <div style={{
                maxWidth,
                width: '100%',
                padding: '20px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
            }}>
                {children}
            </div>
        </div>
    );
};