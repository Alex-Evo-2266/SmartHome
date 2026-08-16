// layouts/SideBySideLayout.tsx

interface SideBySideLayoutProps {
    children: [React.ReactNode, React.ReactNode];
    ratio?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1';
    gap?: string;
}

const ratioMap = {
    '1:1': ['1fr', '1fr'],
    '1:2': ['1fr', '2fr'],
    '2:1': ['2fr', '1fr'],
    '1:3': ['1fr', '3fr'],
    '3:1': ['3fr', '1fr']
};

export const SideBySideLayout = ({
    children,
    ratio = '1:1',
    gap = '24px'
}: SideBySideLayoutProps) => {
    const [left, right] = children;
    const [leftRatio, rightRatio] = ratioMap[ratio];

    return (
        <div style={{
            display: 'flex',
            gap,
            padding: '20px',
            width: '100%',
            minHeight: '100vh',
            background: '#f5f7fa'
        }}>
            <div style={{
                flex: leftRatio,
                minWidth: 0
            }}>
                {left}
            </div>
            <div style={{
                flex: rightRatio,
                minWidth: 0
            }}>
                {right}
            </div>
        </div>
    );
};