import { Box, Cog, Folder, GitFork, Group, Home, LucideIcon, Puzzle, Server, ServerCog, Settings, User, Users } from "lucide-react";

interface IIcons{
    [key:string]: LucideIcon
}

export const icons:IIcons = {
    home: Home,
    profile: User,
    group: Group,
    users: Users,
    room: Box,
    server: Server,
    serverConfig: ServerCog,
    folder: Folder,
    fork: GitFork,
    module: Puzzle,
    settings: Settings,
    cog: Cog
}