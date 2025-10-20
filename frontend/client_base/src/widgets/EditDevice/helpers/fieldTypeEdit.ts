import { DeviceType, TypeFieldEditData } from "../models/type";
import { getFieldType } from "./filterFields";

/**
 * Редактирует поле в массиве fields или добавляет/удаляет его
 * @param fields - Массив полей для редактирования (может быть undefined/null)
 * @param name - Название поля для поиска
 * @param id - Новый ID поля (если null/undefined - поле будет удалено)
 * @param types - Типы устройств для поиска базовых данных поля
 * @param typeName - Имя типа устройства для поиска базового поля
 * @returns Новый массив полей с изменениями
 * @throws Ошибка, если базовое поле не найдено
 */
export function editField(
    fields: TypeFieldEditData[] | undefined | null,
    name: string,
    id: string | null | undefined,
    types: DeviceType[],
    typeName: string
  ): TypeFieldEditData[] {
    // Если fields не задан, возвращаем пустой массив
    if (!fields) return [];
    
    // Ищем все поля с указанным именем
    const existingFields = fields.filter(item => item.name_field_type === name);
    // Получаем базовое описание поля из types
    const baseField = getFieldType(types, typeName).find(item => item.name_field_type === name);
    
    if (!baseField) {
      throw new Error(`Базовое поле '${name}' не найдено для установки`);
    }
  
    // Случай 1: Поле с таким именем не существует в fields
    if (existingFields.length === 0) {
      // Если ID не задан - ничего не меняем
      if (!id || id === "") return fields;
      
      // Добавляем новое поле
      return [
        ...fields,
        {
          name_field_type: name,
          id_field_device: id,
          description: baseField.description,
          required: baseField.required,
          field_type: baseField.type_field
        }
      ];
    } 
    // Случай 2: Поле с таким именем уже существует
    else {
      // Если ID не задан - удаляем поле
      if (!id || id === "") {
        return fields.filter(item => item.name_field_type !== name);
      } 
      // Иначе обновляем ID поля
      else {
        return fields.map(item => {
          return item.name_field_type === name 
            ? { ...item, id_field_device: id }
            : item;
        });
      }
    }
  }