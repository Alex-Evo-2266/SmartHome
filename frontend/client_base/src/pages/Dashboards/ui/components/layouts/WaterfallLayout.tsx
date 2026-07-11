// layouts/WaterfallLayout.tsx
import React, { useEffect, useRef, useState } from 'react';

interface WaterfallLayoutProps {
    children: React.ReactNode;
    columns?: number;
    gap?: string;
}

export const WaterfallLayout = ({
    children,
    columns = 3,
    gap = '16px'
}: WaterfallLayoutProps) => {
    const [columnItems, setColumnItems] = useState<React.ReactNode[][]>([]);

    useEffect(() => {
        const items = React.Children.toArray(children);
        const columnsArray: React.ReactNode[][] = Array.from({ length: columns }, () => []);
        
        // Распределяем элементы по колонкам с учетом высоты
        // (в реальном приложении здесь бы измерялась высота элементов)
        items.forEach((item, index) => {
            const columnIndex = index % columns;
            columnsArray[columnIndex].push(item);
        });

        setColumnItems(columnsArray);
    }, [children, columns]);

    return (
        <div style={{
            display: 'flex',
            gap,
            padding: '20px',
            width: 'calc(100% - 40px)',
            minHeight: 'calc(100vh - 40px)',
            background: '#f0f2f5'
        }}>
            {columnItems.map((column, index) => (
                <div
                    key={index}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap,
                    }}
                >
                    {column}
                </div>
            ))}
        </div>
    );
};