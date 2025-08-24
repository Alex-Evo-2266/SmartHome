import { createContext } from "react";
import { Room } from "../../entites/rooms";

export interface HomePageContext{
    rooms: Room[]
}

export const HomePageContext = createContext<HomePageContext>({rooms: []})
