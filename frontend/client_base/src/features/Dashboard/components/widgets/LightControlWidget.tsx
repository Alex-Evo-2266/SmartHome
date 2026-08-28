// widgets/light/LightControlWidget.tsx

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


export function LightControlWidget({
    widget,
}: WidgetProps) {

    const title =
        useResolvedData(widget.data?.title)
        ?? widget.props?.title;

    const {
        powerValue,
        updateFieldPower,
        brightnessValue,
        updateBrightness,
    } = useLightData(widget.data?.dev);

    return (
        <Card>

            <div className="light-control">

                <div className="light-control__header">

                    <div className="light-control__device">

                        <div className="light-control__icon">
                            💡
                        </div>

                        <div>
                            <div className="light-control__title">
                                {title}
                            </div>

                            <div className="light-control__status">
                                {powerValue
                                    ? "● Включено"
                                    : "● Выключено"
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


                <div className="light-control__brightness">

                    <div className="light-control__brightness-header">
                        <span>
                            Яркость
                        </span>

                        <b>
                            {Math.round(brightnessValue)}%
                        </b>
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={brightnessValue}
                        disabled={!powerValue}
                        onChange={e =>
                            updateBrightness(
                                Number(e.target.value)
                            )
                        }
                    />

                </div>

            </div>

        </Card>
    );
}


export const LightControlWidgetData: WidgetStoreItem = {

    id: "lightControl",

    component: LightControlWidget,

    name: "Свет · управление",

    description:
        "Карточка света с яркостью",

    settings: [

        {
            data_name: "title",
            type: TypeFieldWidget.TEXT,
            sourse: "manula",
            readonly: true,
            lable: "Название",
            default: "Основной свет",
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