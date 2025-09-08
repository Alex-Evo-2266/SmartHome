import { createContext } from "react";
import { Room } from "../rooms";

export interface IDashboardPageContext{
    rooms: Room[]
}

export const DashboardPageContext = createContext<IDashboardPageContext>({rooms: []})
