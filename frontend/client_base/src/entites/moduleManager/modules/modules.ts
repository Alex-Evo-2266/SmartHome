
export interface ContainerConfig{
    build?: Record<string, unknown>
	command: string
	restart: string
	environment: Record<string, unknown>
	labels: string[]
	volumes: string[]
}

export interface Containers{
    name: string
    confog: ContainerConfig
}

export interface Exemple{
    name: string
    path: string
    status?: {
        containers: {
            name: string
            state: string
            status: string
        }[],
        all_running: boolean
    }
}

export interface ModuleData{
    name: string
    name_module: string
    multiply: boolean
    containers: Containers[]
    load: boolean
    repo?: string
    local: boolean
    load_module_name: Exemple[]
}

export type AllModulesData = {
    data: ModuleData[]
}

export interface CoreContainerId{
    container_id: string
    name: string
    service: string
}

export type CoreContainerData = {
    data: CoreContainerId[]
}