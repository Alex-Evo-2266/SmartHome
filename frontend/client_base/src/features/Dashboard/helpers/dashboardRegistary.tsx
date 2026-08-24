import { DataStore, EventBus, LayoutRegistry, ModalManager, WidgetRegistry } from "alex-evo-web-constructor";
import { FlexLayout } from "../components/layouts/FlexLayout";
import { GridLayout } from "alex-evo-sh-ui-kit";
import { MasonryLayout } from "../components/layouts/MasonryLayout";
import { DashboardLayout } from "../components/layouts/DashboardLayout";
import { CardLayout } from "../components/layouts/CardLayout";
import { StackLayout } from "../components/layouts/StackLayout";
import { SideBySideLayout } from "../components/layouts/SideBySideLayout";
import { WaterfallLayout } from "../components/layouts/WaterfallLayout";
import { CenteredLayout } from "../components/layouts/CenteredLayout";
import { MetricWidgetData } from "../components/widgets/MetricWidget";
import { ProgressWidget } from "../components/widgets/ProgressWidget";
import { StatusWidget } from "../components/widgets/StatusWidget";
import { WidgetStore } from "./widgetsStore";
import { MetricRoomWidgetData } from "../components/widgets/MetricRoomWidget";
import { CardWidgetData } from "../components/widgets/CardWidget";


function widgetRegistry(widgetsStore: WidgetStore){

    widgetsStore.register(MetricWidgetData)
    widgetsStore.register(MetricRoomWidgetData)
    widgetsStore.register(CardWidgetData)
    widgetsStore.register({ 
        id: "progress", 
        component: ProgressWidget,
        name: "прогрессбар",
    })
    widgetsStore.register({ 
        id: "status", 
        component: StatusWidget,
        name: "статус",
    })
    

    const registry = new WidgetRegistry();

    console.log(widgetsStore.all(), "p0")

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
    layouts.register({ type: "base", component: WaterfallLayout });
    layouts.register({ type: "centered", component: CenteredLayout });

    return layouts
}

export interface IcreateRuntime{
    registry: WidgetRegistry,
    store: DataStore,
    events: EventBus,
    modals: ModalManager,
    layouts: LayoutRegistry,
    widgetsStore: WidgetStore
}

export function createRuntime(widgetsStore: WidgetStore):IcreateRuntime {

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