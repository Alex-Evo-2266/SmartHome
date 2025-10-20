export function kelvinToHex(tempKelvin: number): string {
    // Ограничиваем температуру в разумных пределах (1000K - 40000K)
    const temp = Math.max(1000, Math.min(tempKelvin, 40000));
    
    // Нормализуем температуру
    const normalizedTemp = temp / 100;
    
    // Вычисляем RGB каналы
    let red, green, blue;
    
    // Красный канал
    if (normalizedTemp <= 66) {
        red = 255;
    } else {
        red = normalizedTemp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);
        red = Math.max(0, Math.min(255, red));
    }
    
    // Зелёный канал
    if (normalizedTemp <= 66) {
        green = normalizedTemp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;
    } else {
        green = normalizedTemp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492);
    }
    green = Math.max(0, Math.min(255, green));
    
    // Синий канал
    if (normalizedTemp >= 66) {
        blue = 255;
    } else {
        if (normalizedTemp <= 19) {
            blue = 0;
        } else {
            blue = normalizedTemp - 10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
        }
        blue = Math.max(0, Math.min(255, blue));
    }
    
    // Преобразуем RGB в HEX
    const toHex = (value: number): string => {
        const hex = Math.round(value).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(red)}${toHex(green)}${toHex(blue)}`.toUpperCase();
}

export function kelvinGradient(startTemp: number, endTemp: number, steps: number = 10): string[] {
    // Проверка и корректировка входных значений
    const minTemp = Math.max(1000, Math.min(startTemp, endTemp));
    const maxTemp = Math.min(40000, Math.max(startTemp, endTemp));
    
    // Вычисляем шаг температуры
    const tempStep = (maxTemp - minTemp) / (steps - 1);
    
    // Генерируем массив цветов
    const gradient: string[] = [];
    for (let i = 0; i < steps; i++) {
        const currentTemp = minTemp + (i * tempStep);
        gradient.push(kelvinToHex(currentTemp));
    }
    
    return gradient;
}

export function kelvinCSSGradient(startTemp: number, endTemp: number, steps: number = 10, orientation: string = "to right"): string {
    const colors = kelvinGradient(startTemp, endTemp, steps);
    const percentageStep = 100 / (steps - 1);
    
    const colorStops = colors.map((color, index) => {
        const percent = Math.round(index * percentageStep);
        return `${color} ${percent}%`;
    }).join(', ');
    
    return `linear-gradient(${orientation}, ${colorStops})`;
}