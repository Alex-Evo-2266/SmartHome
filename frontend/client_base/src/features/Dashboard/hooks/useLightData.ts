// widgets/light/useLightData.ts
import {
    useGetBinaryField,
    useGetNumberField,
} from '@src/entites/devices';

import { getDeviceInStore } from '@src/entites/devices/helpers/getDeviceInStore';
import { dashpoardDataNodeParse } from '@src/shared/lib/helpers/dashboardDataNodeParse';
import { useAppSelector } from '@src/shared/lib/hooks/redux';

import {
    DataNode,
} from 'alex-evo-web-constructor';

import { useMemo } from 'react';

export const useLightData = (node?: unknown) => {

    let key: DataNode | undefined;

    if (
        typeof node === 'object' &&
        node !== null &&
        'binding' in node
    ) {
        key = node.binding as DataNode;
    }

    const data = dashpoardDataNodeParse(key);

    const { devicesData } = useAppSelector(
        state => state.devices
    );

    const deviceId = data && data.length >= 2
        ? data[1]
        : undefined;

    const device = useMemo(
        () => getDeviceInStore(devicesData, deviceId),
        [devicesData, deviceId]
    );

    const {
        fieldValue: powerValue,
        updateFieldState: updateFieldPower,
    } = useGetBinaryField(
        device ?? null,
        "power"
    );

    const {
        fieldValue: brightnessValue,
        updateFieldState: updateBrightness,
    } = useGetNumberField(
        device ?? null,
        "brightness"
    );

    const {
        fieldValue: colorValue,
        updateFieldState: updateColor,
    } = useGetNumberField(
        device ?? null,
        "color"
    );

    const {
        fieldValue: temperatureValue,
        updateFieldState: updateTemperature,
    } = useGetNumberField(
        device ?? null,
        "color_temperature"
    );

    return {
        device,

        powerValue: !!powerValue,
        updateFieldPower,

        brightnessValue:
            typeof brightnessValue === "number"
                ? brightnessValue
                : 100,

        updateBrightness,

        colorValue:
            typeof colorValue === "number"
                ? colorValue
                : 30,

        updateColor,

        temperatureValue:
            typeof temperatureValue === "number"
                ? temperatureValue
                : 50,

        updateTemperature,
    };
};