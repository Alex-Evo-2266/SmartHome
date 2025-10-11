
export interface ContainerConfig{
    restart: string
    ports: string[]
    volumes: string[]
    labels: string[]
    depends_on: string[]
}

export interface Containers{
    name: string
    confog: ContainerConfig
}

export interface ModuleData{
    name: string
    multiply: boolean
    containers: Containers[]
    load: boolean
    load_module_name: {
        name: string
        path: string
    }[]
}

export type AllModulesData = Record<string, ModuleData>