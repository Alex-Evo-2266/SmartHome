import { TypeDeviceField } from "@src/entites/devices";
import { WidgetDefinition } from "alex-evo-web-constructor";
import { createContext, useContext, useSyncExternalStore } from "react";
import { v4 as uuidv4 } from 'uuid';

export type WidgetStoreItemSettingsBase = {
    lable: string
    data_name: string
}

export type WidgetStoreItemSettingsNumber = WidgetStoreItemSettingsBase & {
    type: TypeDeviceField.NUMBER | TypeDeviceField.COUNTER
    sourse: "device" | "room" | "manula" | "binding" | "expression"
    default?: number
}

export type WidgetStoreItemSettingsBinary = WidgetStoreItemSettingsBase & {
    type: TypeDeviceField.BINARY
    sourse: "device" | "room" | "manula" | "binding"
    default?: boolean
}

export type WidgetStoreItemSettingsText = WidgetStoreItemSettingsBase & {
    type: TypeDeviceField.TEXT | TypeDeviceField.BASE
    sourse: "device" | "room" | "manula" | "binding"
    default?: string
}

export type WidgetStoreItemSettingsEnum = WidgetStoreItemSettingsBase &{
    type: TypeDeviceField.ENUM
    sourse: "device" | "room" | "manula" | "binding"
    default?: string
    enum_values?: string[]
}

export type WidgetStoreItemSettings = WidgetStoreItemSettingsNumber | WidgetStoreItemSettingsBinary | WidgetStoreItemSettingsText | WidgetStoreItemSettingsEnum

export interface WidgetStoreItem extends WidgetDefinition{
    id: string
    description?: string
    name: string
    icon?: React.ReactNode

    settings?: WidgetStoreItemSettings[]

}

export class WidgetStore {
    private widgets = new Map<string, WidgetStoreItem>();
    private listeners = new Set<() => void>();
    private snapshot: WidgetStoreItem[] = [];

    private emit() {
        this.listeners.forEach(listener => listener());
    }

    private updateSnapshot() {
        this.snapshot = [...this.widgets.values()];
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    register(widget: Omit<WidgetStoreItem, "id">) {
        this.widgets.set(widget.type, {...widget, id: uuidv4()});
        this.updateSnapshot()
        this.emit();
    }

    unregister(type: string) {
        this.widgets.delete(type);
        this.emit();
    }

    all(): WidgetStoreItem[] {
        return this.snapshot
    }

    get(type: string) {
        return this.widgets.get(type);
    }

    get_widget_definition(type: string):WidgetDefinition | undefined {
        const cond = this.widgets.get(type);
        if(!cond) return undefined
        return {
            type: cond.type,
            component: cond.component
        }
    }

    all_widget_definition():WidgetDefinition[] {
        return this.all().map(item=>({
            type: item.type,
            component: item.component
        }))
    }


}

export const WidgetsStoreContext = createContext<WidgetStore | null>(null)

export const useWidgetsStore = () => useContext(WidgetsStoreContext)


export function useWidgets() {
    const widgetsStore = useWidgetsStore()
    return useSyncExternalStore(
        (listener: () => void) => widgetsStore? widgetsStore.subscribe(listener): ()=>{},
        () => widgetsStore?.all()
    );
}