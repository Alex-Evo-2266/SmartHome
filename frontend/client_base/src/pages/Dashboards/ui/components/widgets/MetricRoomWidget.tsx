// widgets/MetricWidget.tsx
import { WidgetStoreItem } from '@src/entites/dashboard/types/typeData';
import { TypeDeviceField } from '@src/entites/devices';
import { useResolvedData, WidgetProps } from 'alex-evo-web-constructor';

export interface MetricWidgetProps {
    title?: string;
    icon?: string;
    color?: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'stable';
    trendValue?: string;
}

export function MetricRoomWidget({ widget }: WidgetProps) {
    
    const title = useResolvedData(widget.data?.title) ?? widget.props?.title;
    const icon = useResolvedData(widget.data?.icon) ?? widget.props?.icon;
    const value = useResolvedData(widget.data?.value) ?? widget.props?.value;
    const subtitle = useResolvedData(widget.data?.subtitle) ?? widget.props?.subtitle;
    const color = widget.props?.color || '#667eea';
    const trend = widget.props?.trend;
    const trendValue = widget.props?.trendValue;

    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    const trendColor = trend === 'up' ? '#2ecc71' : trend === 'down' ? '#e74c3c' : '#f39c12';

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            borderLeft: `4px solid ${color}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
            }}>
                <div>
                    {icon && (
                        <span style={{
                            fontSize: '24px',
                            marginRight: '8px'
                        }}>
                            {icon}
                        </span>
                    )}
                    <span style={{
                        fontSize: '14px',
                        color: '#7f8c8d',
                        fontWeight: '500'
                    }}>
                        {title}
                    </span>
                </div>
                {trend && (
                    <span style={{
                        fontSize: '12px',
                        color: trendColor,
                        fontWeight: '600',
                        background: `${trendColor}15`,
                        padding: '2px 8px',
                        borderRadius: '12px'
                    }}>
                        {trendIcon} {trendValue}
                    </span>
                )}
            </div>
            
            <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '4px'
            }}>
                {value}
            </div>
            
            {subtitle && (
                <div style={{
                    fontSize: '13px',
                    color: '#95a5a6'
                }}>
                    {subtitle}
                </div>
            )}
        </div>
    );
}


export const MetricRoomWidgetData: WidgetStoreItem = { 
    id: "metricroom", 
    component: MetricRoomWidget,
    name: "метрика комнаты",
    description: "metricroom",
    settings:[{
        data_name: "title",
        type: TypeDeviceField.TEXT,
        readonly: true,
        lable: "title",
        sourse: "manula",
        default: "test_title"
    },
    {
        data_name: "value",
        type: TypeDeviceField.NUMBER,
        readonly: true,
        lable: "value",
        sourse: "room"
    },
    {
        data_name: "subtitle",
        type: TypeDeviceField.TEXT,
        readonly: true,
        lable: "subtitle",
        sourse: "manula",
        default: "test_subtitle"
    }]
}