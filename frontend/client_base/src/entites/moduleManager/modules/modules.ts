
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

export interface ModuleData{
    name: string
    name_module: string
    multiply: boolean
    containers: Containers[]
    load: boolean
    repo?: string
    local: boolean
    load_module_name: {
        name: string
        path: string
        status?: {
            continers: unknown[],
            all_running: boolean
        }
    }[]
}

export type AllModulesData = {
    data: ModuleData[]
}