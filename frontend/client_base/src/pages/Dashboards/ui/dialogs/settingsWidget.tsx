import './widgetConfigDialog.scss'
import { useCallback, useMemo, useState } from "react"
import { useWidgets } from "../../../../features/Dashboard/helpers/widgetsStore"
import { WidgetStepDialogProps } from "./types"
import { SettingsField } from './fields'
import { JsonContainer, JsonData } from 'alex-evo-sh-ui-kit'
import { useDataStore } from 'alex-evo-web-constructor'
import { DialogPortal } from '@src/shared'
import { LayoutConfigDialog } from './baseDialogLayout'
/**
 * Проверяет, является ли значение валидным JsonData
 */
function isValidJsonData(value: unknown): value is JsonData {
  // null или undefined не валидны
  if (value === null || value === undefined) {
    return false;
  }

  // Проверка примитивных типов
  if (typeof value === 'string' || 
      typeof value === 'number' || 
      typeof value === 'boolean') {
    return true;
  }

  // Проверка массива
  if (Array.isArray(value)) {
    return value.every(item => isValidJsonData(item));
  }

  // Проверка объекта
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Проверяем все значения в объекте
    for (const key in obj) {
      if (!isValidJsonData(obj[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
}

function jsonStringifyWithNullUndefined(value: unknown) {
  // Рекурсивная функция для преобразования
  function convert(val: unknown): any {
    // null и undefined преобразуем в строки
    if (val === null) {
      return 'null';
    }
    if (val === undefined) {
      return 'undefined';
    }

    // Примитивные типы оставляем как есть
    if (typeof val === 'string' || 
        typeof val === 'number' || 
        typeof val === 'boolean') {
      return val;
    }

    // Массивы обрабатываем рекурсивно
    if (Array.isArray(val)) {
      return val.map(item => convert(item));
    }

    // Объекты обрабатываем рекурсивно
    if (typeof val === 'object') {
      const result: Record<string, any> = {};
      const obj = val as Record<string, unknown>;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result[key] = convert(obj[key]);
        }
      }
      return result;
    }

    return val;
  }

  const converted = convert(value);
  //return JSON.stringify(converted);
  return converted
}

export const WidgetSettingsDialog:React.FC<WidgetStepDialogProps> = ({setCondidat, condidat}) => {

    const widgets = useWidgets()
    const data = useDataStore()
    const store_dump = useMemo(() => {
        const typeData = {
            data: data.data as Record<string, unknown>,
            computed: data.computed as Record<string, unknown>,
            deps: data.deps as Record<string, string[]>
        };
        return jsonStringifyWithNullUndefined(typeData)
    }, [data]);

    const settings = useMemo(() => {
        if (!widgets) return widgets;
        
        return widgets.find(item=>condidat?.type === item.id)?.settings
    }, [condidat, widgets]);


    const fieldHandler = useCallback((value:any, name?: string)=>{
        if(!name)return;
        setCondidat(prev=>prev?({...prev, data: {...prev?.data, [name]: value}}):null)
    },[])

    return(
        <>
          {
            settings?.map(item=>{
              return (<SettingsField key={item.data_name} settings={item} value={condidat?.data?.[item.data_name] ?? ""} onChange={fieldHandler}/>)
            })
          }
          <JsonContainer name="data" readonly data={isValidJsonData(store_dump)?store_dump:{}}/>
        
        </>
                    
    )
}