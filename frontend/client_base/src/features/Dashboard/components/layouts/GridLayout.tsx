// layouts/GridLayout.tsx

import { GridLayout as GL, GridLayoutItem } from "alex-evo-sh-ui-kit";
import { Children } from "react";

interface GridLayoutProps {
    children: React.ReactNode;
    columns?: number;
    gap?: string;
    responsive?: boolean;
}

export const GridLayout = ({ 
    children
}: GridLayoutProps) => {

    return (
        <GL className="device-container" itemMaxWith="300px" itemMinWith="200px">
        {
            Children.map(children,(child)=>(
                <GridLayoutItem>
                    {child}
                </GridLayoutItem>
            ))
        }
        </GL>
    );
};