import { LayoutSchemaID, WidgetSchema } from "alex-evo-web-constructor";

export interface WidgetStepDialogProps{
    condidat: WidgetSchema | null
    setCondidat: React.Dispatch<React.SetStateAction<WidgetSchema<Record<string, unknown>> | null>>
}

export interface LayoutStepDialogProps{
    condidat: LayoutSchemaID | null
    setCondidat: React.Dispatch<React.SetStateAction<LayoutSchemaID | null>>
}