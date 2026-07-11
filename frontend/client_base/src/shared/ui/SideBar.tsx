// Sidebar.tsx
import { Divider, IconButton, Panel, X } from 'alex-evo-sh-ui-kit'
import React, { ReactNode } from 'react'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    width?: string | number
    position?: 'left' | 'right'
    overlay?: boolean // Если true - затемняет фон
    closeOnOverlayClick?: boolean
    className?: string
}

export const Sidebar = ({
    isOpen,
    onClose,
    children,
    width = '400px',
    position = 'right',
    className = ''
}: SidebarProps) => {

    // Стили для самого сайдбара
    const sidebarStyle: React.CSSProperties = {
        position: 'fixed' as const,
        top: 0,
        [position]: 0,
        width: width,
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: position === 'right' 
            ? '-2px 0 8px rgba(0,0,0,0.1)' 
            : '2px 0 8px rgba(0,0,0,0.1)',
        transform: isOpen ? 'translateX(0)' : `translateX(${position === 'right' ? '100%' : '-100%'})`,
        transition: 'transform 0.3s ease',
        zIndex: 1000,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
    }


    return (
        <>
            <Panel style={sidebarStyle} className={className}>
                <div style={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <IconButton 
                        icon={<X/>}
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '4px 8px'
                        }}
                    >
                        ✕
                    </IconButton>
                </div>
                <Divider/>
                <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
                    {children}
                </div>
            </Panel>
        </>
    )
}