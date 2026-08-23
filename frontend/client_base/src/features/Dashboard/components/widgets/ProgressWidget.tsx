// widgets/ProgressWidget.tsx
import { useResolvedData, WidgetProps } from 'alex-evo-web-constructor';

interface ProgressWidgetProps {
    title?: string;
    value?: number;
    max?: number;
    color?: string;
    showPercentage?: boolean;
    segments?: Array<{
        label: string;
        value: number;
        color: string;
    }>;
}

export function ProgressWidget({ widget }: WidgetProps<ProgressWidgetProps>) {
    
    const title = useResolvedData(widget.data?.title) ?? widget.props?.title;
    const value = Number(useResolvedData(widget.data?.value) ?? widget.props?.value ?? 0);
    const max = Number(widget.props?.max ?? 100);
    const color = widget.props?.color || '#667eea';
    const showPercentage = widget.props?.showPercentage ?? true;
    const segments = widget.props?.segments;

    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
            {title && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                }}>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#2c3e50'
                    }}>
                        {title}
                    </span>
                    {showPercentage && (
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#2c3e50'
                        }}>
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}

            {segments ? (
                // Сегментированный прогресс-бар
                <div style={{
                    display: 'flex',
                    height: '8px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    background: '#ecf0f1'
                }}>
                    {segments.map((segment, index) => {
                        const segmentPercent = (segment.value / max) * 100;
                        return (
                            <div
                                key={index}
                                style={{
                                    width: `${segmentPercent}%`,
                                    background: segment.color,
                                    transition: 'width 0.6s ease'
                                }}
                                title={`${segment.label}: ${segment.value}`}
                            />
                        );
                    })}
                </div>
            ) : (
                // Обычный прогресс-бар
                <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: '#ecf0f1',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '4px',
                        transition: 'width 0.6s ease'
                    }} />
                </div>
            )}

            {segments && (
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '12px',
                    flexWrap: 'wrap'
                }}>
                    {segments.map((segment, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px',
                            color: '#7f8c8d'
                        }}>
                            <span style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                borderRadius: '2px',
                                background: segment.color
                            }} />
                            {segment.label}: {segment.value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}