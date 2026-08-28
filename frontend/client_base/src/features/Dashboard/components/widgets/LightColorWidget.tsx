// widgets/light/LightColorWidget.tsx

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


const colors = [
    "#ff4d4d",
    "#ff9138",
    "#ffd34e",
    "#65d96b",
    "#43d7d0",
    "#688cff",
    "#b16aff",
    "#ec68c8",
    "#ffb0a0",
    "#f5e6b5",
    "#d6d8ff",
    "#bcefff",
];


export function LightColorWidget({
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

            <div className="light-color">

                <div className="light-color__header">

                    <div>
                        <div className="light-color__title">
                            {title}
                        </div>

                        <div className="light-color__status">
                            RGB · {powerValue
                                ? "Включена"
                                : "Выключена"
                            }
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


                <div className="light-color__wheel">

                    <div className="light-color__wheel-inner"/>

                    <div className="light-color__cursor"/>

                </div>


                <div className="light-color__current">

                    <div
                        className="light-color__dot"
                        style={{
                            background: "#ffb347"
                        }}
                    />

                    <div>
                        <b>
                            Тёплый янтарный
                        </b>

                        <div className="light-color__hex">
                            #FFB347
                        </div>
                    </div>

                </div>


                <div className="light-color__palette">

                    {colors.map(color => (

                        <button
                            key={color}
                            className="light-color__swatch"
                            style={{
                                background: color
                            }}
                        />

                    ))}

                </div>


                <div className="light-color__slider">

                    <div className="light-color__slider-header">
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


export const LightColorWidgetData: WidgetStoreItem = {

    id: "lightColor",

    component: LightColorWidget,

    name: "Свет · цвет",

    description:
        "RGB-карточка с выбором цвета",

    settings: [

        {
            data_name: "title",
            type: TypeFieldWidget.TEXT,
            sourse: "manula",
            readonly: true,
            lable: "Название",
            default: "RGB лампа",
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