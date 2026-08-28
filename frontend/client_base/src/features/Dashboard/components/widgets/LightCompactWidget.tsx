// widgets/light/LightCompactWidget.tsx

import {
    TypeFieldWidget,
    WidgetStoreItem,
} from '@src/entites/dashboard/types/typeData';

import {
    Card,
    Switch,
} from 'alex-evo-sh-ui-kit';

import {
    useResolvedData,
    WidgetProps,
} from 'alex-evo-web-constructor';
import { useLightData } from '../../hooks/useLightData';
import '../style.scss'


export function LightCompactWidget({
    widget,
}: WidgetProps) {

    const title =
        useResolvedData(widget.data?.title)
        ?? widget.props?.title;

    const {
        powerValue,
        updateFieldPower,
        brightnessValue,
    } = useLightData(widget.data?.dev);

    return (
        <Card>
            <div className="light-compact">

                <div className="light-compact__info">

                    <div className="light-compact__icon">
                        💡
                    </div>

                    <div>
                        <div className="light-compact__title">
                            {title}
                        </div>

                        <div className="light-compact__value">
                            {powerValue
                                ? `${Math.round(brightnessValue)}%`
                                : "Выкл."
                            }
                        </div>
                    </div>

                </div>

                <Switch
                    checked={powerValue}
                    onChange={e =>
                        updateFieldPower(
                            e.target.checked
                        )
                    }
                />

            </div>
        </Card>
    );
}


export const LightCompactWidgetData: WidgetStoreItem = {

    id: "lightCompact",

    component: LightCompactWidget,

    name: "Свет · компакт",

    description:
        "Компактная карточка управления светом",

    settings: [

        {
            data_name: "title",
            type: TypeFieldWidget.TEXT,
            sourse: "manula",
            readonly: true,
            lable: "Название",
            default: "Свет",
        },

        {
            data_name: "dev",
            type: TypeFieldWidget.FOR_DEVICE_TYPE,
            sourse: "device",
            device_type: "light",
            readonly: true,
            lable: "Устройство",
        },

    ],
};