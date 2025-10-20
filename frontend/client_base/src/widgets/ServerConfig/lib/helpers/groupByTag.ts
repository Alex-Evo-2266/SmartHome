import { ConfigItem } from "../../models/config";

// Функция группировки по `tag`
export const groupByTag = (arr: ConfigItem[]) => {
  return Object.values(
    arr.reduce((acc, obj) => {
      if (!acc[obj.tag]) acc[obj.tag] = [];
      acc[obj.tag].push(obj);
      return acc;
    }, {} as { [key: string]: ConfigItem[] })
  );
};