// widgets/MetricWidget.tsx
import { TypeFieldWidget, WidgetStoreItem } from '@src/entites/dashboard/types/typeData';
import { Card } from 'alex-evo-sh-ui-kit';
import { useResolvedData, WidgetProps } from 'alex-evo-web-constructor';
import { ReactNode } from 'react';

export interface CardWidgetProps {
    title?: string;
    children: ReactNode
}

export function CardWidget({ widget, children }: WidgetProps) {
    
    const title = useResolvedData(widget.data?.title) ?? widget.props?.title;

    return (
        <Card header={title}>
            {children}
        </Card>
    );
}


export const CardWidgetData: WidgetStoreItem = { 
    id: "cardBase", 
    component: CardWidget,
    name: "базовая карточка",
    description: "карточка",
    children: true,
    settings:[{
        data_name: "title",
        type: TypeFieldWidget.TEXT,
        readonly: true,
        lable: "title",
        sourse: "manula",
        default: "test_title"
    }]
}