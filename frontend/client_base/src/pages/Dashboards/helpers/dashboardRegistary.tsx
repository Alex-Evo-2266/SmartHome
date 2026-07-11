import { DataStore, EventBus, LayoutRegistry, ModalManager, WidgetRegistry } from "alex-evo-web-constructor";
import { FlexLayout } from "../ui/components/layouts/FlexLayout";
import { GridLayout, Home } from "alex-evo-sh-ui-kit";
import { MasonryLayout } from "../ui/components/layouts/MasonryLayout";
import { DashboardLayout } from "../ui/components/layouts/DashboardLayout";
import { CardLayout } from "../ui/components/layouts/CardLayout";
import { StackLayout } from "../ui/components/layouts/StackLayout";
import { SideBySideLayout } from "../ui/components/layouts/SideBySideLayout";
import { WaterfallLayout } from "../ui/components/layouts/WaterfallLayout";
import { CenteredLayout } from "../ui/components/layouts/CenteredLayout";
import { MetricWidget } from "../ui/components/widgets/MetricWidget";
import { ProgressWidget } from "../ui/components/widgets/ProgressWidget";
import { StatusWidget } from "../ui/components/widgets/StatusWidget";
import { WidgetStore } from "./widgetsStore";
import { TypeDeviceField } from "@src/entites/devices";


function widgetRegistry(widgetsStore: WidgetStore){

    widgetsStore.register({ 
        type: "metric", 
        component: MetricWidget,
        name: "метрика",
        description: "metric",
        settings:[{
            data_name: "title",
            type: TypeDeviceField.TEXT,
            lable: "title",
            sourse: "manula",
            default: "test_title"
        },
        {
            data_name: "value",
            type: TypeDeviceField.TEXT,
            lable: "value",
            sourse: "manula"
        },
        {
            data_name: "subtitle",
            type: TypeDeviceField.TEXT,
            lable: "subtitle",
            sourse: "manula",
            default: "test_subtitle"
        }]
    })
    widgetsStore.register({ 
        type: "progress", 
        component: ProgressWidget,
        name: "прогрессбар",
    })
    widgetsStore.register({ 
        type: "status", 
        component: StatusWidget,
        name: "статус",
    })
    

    const registry = new WidgetRegistry();

    widgetsStore.all_widget_definition().forEach(item=>registry.register(item))

    return registry
}


function layoutRegistry(){
    const layouts = new LayoutRegistry();

    layouts.register({ type: "flex", component: FlexLayout });
    layouts.register({ type: "grid", component: GridLayout });
    layouts.register({ type: "masonry", component: MasonryLayout });
    layouts.register({ type: "dashboard", component: DashboardLayout });
    layouts.register({ type: "card", component: CardLayout });
    layouts.register({ type: "stack", component: StackLayout });
    layouts.register({ type: "side-by-side", component: SideBySideLayout });
    layouts.register({ type: "waterfall", component: WaterfallLayout });
    layouts.register({ type: "centered", component: CenteredLayout });

    return layouts
}



export function createRuntime(widgetsStore: WidgetStore) {

    const registry = widgetRegistry(widgetsStore)

    const layouts = layoutRegistry()

    const store = new DataStore();
    const events = new EventBus();
    const modals = new ModalManager();

    return {
        registry,
        store,
        events,
        modals,
        layouts,
        widgetsStore
    };
}