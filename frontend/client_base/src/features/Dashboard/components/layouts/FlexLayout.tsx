// layouts/FlexLayout.tsx (улучшенная версия)

interface FlexLayoutProps {
    children: React.ReactNode;
    direction?: 'row' | 'column';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    gap?: string;
    padding?: string;
    background?: string;
}

export const FlexLayout = ({
    children,
    direction = 'row',
    wrap = 'wrap',
    justifyContent = 'center',
    alignItems = 'stretch',
    gap = '16px',
    padding = '20px',
    background = 'transperent'
}: FlexLayoutProps) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: direction,
            flexWrap: wrap,
            justifyContent,
            alignItems,
            gap,
            padding,
            background,
            width: '100%',
            // minHeight: '100vh'
        }}>
            {children}
        </div>
    );
};