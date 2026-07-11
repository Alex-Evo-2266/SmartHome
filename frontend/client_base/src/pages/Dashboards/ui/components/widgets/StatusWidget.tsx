// widgets/StatusWidget.tsx
import { useResolvedData, WidgetProps } from 'alex-evo-web-constructor';

export interface StatusWidgetProps {
    title?: string;
    statuses?: Array<{
        label: string;
        value: string;
        status: 'online' | 'offline' | 'warning' | 'error';
    }>;
}
export function StatusWidget({ widget }: WidgetProps<StatusWidgetProps>) {
    const title = useResolvedData(widget.data?.title) ?? widget.props?.title;
    const statuses = widget.props?.statuses || [];

    const getStatusColor = (status: string) => {
        const colors = {
            online: '#2ecc71',
            offline: '#95a5a6',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        return colors[status as keyof typeof colors] || '#95a5a6';
    };

    const getStatusDot = (status: string) => {
        const colors = {
            online: '#2ecc71',
            offline: '#95a5a6',
            warning: '#f39c12',
            error: '#e74c3c'
        };
        return (
            <span style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: colors[status as keyof typeof colors] || '#95a5a6',
                marginRight: '8px',
                animation: status === 'online' ? 'pulse 2s infinite' : 'none'
            }} />
        );
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
            {title && (
                <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '16px'
                }}>
                    {title}
                </h3>
            )}
            
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {statuses.map((status, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <span style={{
                            fontSize: '14px',
                            color: '#2c3e50'
                        }}>
                            {status.label}
                        </span>
                        <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '13px',
                            color: getStatusColor(status.status)
                        }}>
                            {getStatusDot(status.status)}
                            {status.value}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
            `}</style>
        </div>
    );
}