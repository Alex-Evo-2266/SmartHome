import {WidgetStoreItem } from "@src/entites/dashboard/types/typeData";
import { WidgetDefinition } from "alex-evo-web-constructor";
import { createContext, useContext, useSyncExternalStore } from "react";
// import { v4 as uuidv4 } from 'uuid';

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

    register(widget: WidgetStoreItem) {
        if(this.widgets.has(widget.id))
        {
            console.error(`alrady exist ${widget.id}`)
        }
        else{
            this.widgets.set(widget.id, {...widget});
            this.updateSnapshot()
            this.emit();
        }
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
            type: cond.id,
            component: cond.component
        }
    }

    all_widget_definition():WidgetDefinition[] {
        return this.all().map(item=>({
            type: item.id,
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