// widgets/MetricWidget.tsx
import { TypeFieldWidget, WidgetStoreItem } from '@src/entites/dashboard/types/typeData';
import { Panel, Typography } from 'alex-evo-sh-ui-kit';
import { useResolvedData, WidgetProps } from 'alex-evo-web-constructor';
import { ReactNode } from 'react';

export interface CardWidgetProps {
    title?: string;
    children: ReactNode
}
const CARD_MIN_WIDTH = 240;
const CARD_MAX_WIDTH = 500;
const CARD_GAP = 8;

export function CardWidget({ widget, children }: WidgetProps) {
    const title = useResolvedData(widget.data?.title) ?? widget.props?.title;

    return (
        <Panel
            style={{
                minWidth: `${CARD_MIN_WIDTH}px`,
                maxWidth: `${CARD_MAX_WIDTH}px`,
                width: 'fit-content',
                boxSizing: 'border-box',
            }}
            shadow={12}
        >
            <Typography type="title">
                {title}
            </Typography>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start', // главное
                    gap: `${CARD_GAP}px`,
                }}
            >
                {children}
            </div>
        </Panel>
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