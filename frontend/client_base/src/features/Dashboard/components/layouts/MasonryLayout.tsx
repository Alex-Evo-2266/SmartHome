// layouts/MasonryLayout.tsx

import { Children } from "react";


interface MasonryLayoutProps {
    children: React.ReactNode;
    columns?: number;
    gap?: string;
}

export const MasonryLayout = ({ 
    children, 
    columns = 3, 
    gap = '20px' 
}: MasonryLayoutProps) => {

    // Разбиваем детей по колонкам для Masonry эффекта
    const getColumnItems = () => {
        const items = Children.toArray(children);
        const columnsArray: React.ReactNode[][] = Array.from({ length: columns }, () => []);
        
        items.forEach((child, index) => {
            const columnIndex = index % columns;
            columnsArray[columnIndex].push(child);
        });

        return columnsArray;
    };

    const columnItems = getColumnItems();

    return (
        <div style={{
            display: 'flex',
            gap,
            padding: '20px',
            width: '100%',
            minHeight: '100vh',
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