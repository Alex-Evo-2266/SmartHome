// widgets/light/LightColorWidget.tsx

import {
    TypeFieldWidget,
    WidgetStoreItem,
} from '@src/entites/dashboard/types/typeData';

import {
    Panel,
    Switch,
} from 'alex-evo-sh-ui-kit';

import {
    useResolvedData,
    WidgetProps,
} from 'alex-evo-web-constructor';
import { useLightData } from '../../hooks/useLightData';
import '../style.scss'
import ColorWheel from '@src/shared/ui/Color/Palitra';
import { useCallback } from 'react';
import { hsvToHex } from '@src/shared/lib/helpers/colorHelper';
// import { RGBtoHEX } from 'alex-evo-sh-ui-kit/dist/lib/helpers/color/colorConvert';


// const colors = [
//     "#ff4d4d",
//     "#ff9138",
//     "#ffd34e",
//     "#65d96b",
//     "#43d7d0",
//     "#688cff",
//     "#b16aff",
//     "#ec68c8",
//     "#ffb0a0",
//     "#f5e6b5",
//     "#d6d8ff",
//     "#bcefff",
// ];


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
        colorValue,
        satValue,
        updateColor,
    updateSat
} = useLightData(widget.data?.dev);

    const setColor = useCallback((color: string, sat: string)=>{
        updateColor(Number(color))
        updateSat(Number(sat))
    },[updateColor, updateSat])

    const textColor = hsvToHex(colorValue, satValue)

    return (
        <Panel style={{minWidth: "250px"}}>

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
                        onChange={(e:React.ChangeEvent<HTMLInputElement>) =>
                            updateFieldPower(
                                e.target.checked
                            )
                        }
                    />

                </div>


                {/* <div className="light-color__wheel">

                    <div className="light-color__wheel-inner"/>

                    <div className="light-color__cursor"/>

                </div> */}
                <ColorWheel color={colorValue?.toString() ?? "0"} sat={satValue?.toString() ?? "0"} onChange={setColor}/>


                <div className="light-color__current">

                    <div
                        className="light-color__dot"
                        style={{
                            background: textColor
                        }}
                    />

                    <div>
                        {/* <b>
                            Тёплый янтарный
                        </b> */}

                        <div className="light-color__hex">
                            {textColor}
                        </div>
                    </div>

                </div>

{/* 
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

                </div> */}


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

        </Panel>
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