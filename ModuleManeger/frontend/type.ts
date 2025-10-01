
export interface ContainerConf{
    restart: string,
    ports: string[]
    volumes: string[]
    depends_on: string[]
    labels: string[]
}

export interface Container{
    name: string
    config: ContainerConf
}

export interface ModuleFile{
    name: string
    multiply: boolean
    containers: Container[]
}

export interface ConfigFile{
    name: string
    multiply: boolean
    exemple: {
        name: string
        containers: Container[]
    }[]
}