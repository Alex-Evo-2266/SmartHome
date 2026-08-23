// layouts/DashboardLayout.tsx

interface DashboardLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    header?: React.ReactNode;
    sidebarWidth?: string;
}

export const DashboardLayout = ({ 
    children, 
    sidebar, 
    header,
    sidebarWidth = '280px' 
}: DashboardLayoutProps) => {
    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            {sidebar && (
                <div style={{
                    width: sidebarWidth,
                    background: 'white',
                    boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
                    padding: '20px',
                    overflowY: 'auto',
                    position: 'sticky',
                    top: 0,
                    height: '100vh'
                }}>
                    {sidebar}
                </div>
            )}
            
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh'
            }}>
                {header && (
                    <div style={{
                        background: 'white',
                        padding: '20px 30px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        position: 'sticky',
                        top: 0,
                        zIndex: 100
                    }}>
                        {header}
                    </div>
                )}
                
                <div style={{
                    padding: '20px 30px',
                    flex: 1
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};