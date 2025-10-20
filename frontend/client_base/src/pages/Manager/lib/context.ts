import { CoreContainerId, ModuleData } from "@src/entites/moduleManager/modules/modules";
import { createContext } from "react";

export interface IManagerContext{
    dockerModules: ModuleData[]
    coreModuler: ModuleData[]
    core: CoreContainerId[]
}

const initManager:IManagerContext = {
    dockerModules: [],
    core: [],
    coreModuler: []
}

export const ManagerContext = createContext<IManagerContext>(initManager)