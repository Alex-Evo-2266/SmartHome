import { BaseActionCard, BasicTemplateDialog, Button, Card, ContentBox, NumberField, TextField, Typography } from "alex-evo-sh-ui-kit";
import React, { useCallback, useEffect, useState } from "react";
import { useConfigAPI } from "../api/deviceServiceConfigAPI";
import { ConfigItem, ConfigItemType } from "../models/config";
import { groupByTag } from "../lib/helpers/groupByTag";
import { PasswordField } from "./passwordField";
import { Loading } from "../../../shared/ui/Loading";

export const SettingsEditor = () => {
  const [originalSettings, setOriginalSettings] = useState<ConfigItem[][]>([]);
  const [editedSettings, setEditedSettings] = useState<ConfigItem[][]>([]);
  const { getConfig, patchConfig, loading } = useConfigAPI();
  const [visibleChangeDialog, setVisibleChangeDialog] = useState(false)

  const loadConfig = useCallback(async () => {
    const settingsData = await getConfig();
    const grouped = groupByTag(settingsData);
    setOriginalSettings(grouped); // Сохраняем оригинальные настройки
    setEditedSettings(JSON.parse(JSON.stringify(grouped))); // Копируем в изменяемое состояние
  }, [getConfig]);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, tag: string) => {
    const { name, value } = e.target;
    setEditedSettings((prev) =>
      prev.map((group) =>
        group[0].tag === tag
          ? group.map((item) => (item.key === name ? { ...item, value } : item))
          : group
      )
    );
  };

  const handleChangeNumber = (value: number, name: string | undefined, tag: string) => {
    if (!name) return;
    setEditedSettings((prev) =>
      prev.map((group) =>
        group[0].tag === tag
          ? group.map((item) => (item.key === name ? { ...item, value: String(value) } : item))
          : group
      )
    );
  };

  const changePass = useCallback(async(data: string, name:string) => {
    await patchConfig({[name]: data})
    setTimeout(loadConfig, 500)
  },[patchConfig])

  // Функция для сравнения изменений
  const getChanges = useCallback(() => {
    const changes: { tag: string; key: string; oldValue: string; newValue: string }[] = [];

    editedSettings.forEach((group, index) => {
      group.forEach((item) => {
        const originalItem = originalSettings[index]?.find((orig) => orig.key === item.key);
        if (originalItem && originalItem.value !== item.value) {
          changes.push({
            tag: item.tag,
            key: item.key,
            oldValue: originalItem.value,
            newValue: item.value,
          });
        }
      });
    });

    return changes;
  },[editedSettings, originalSettings])

  const handleSave = useCallback(async() => {
    setVisibleChangeDialog(true)
    
  },[patchConfig])

  const saveSand = useCallback( async ()=>{
    const changes = getChanges();
    let data:{[key:string]:string} = {}
    for( let change of changes)
    {
      data[change.key] = change.newValue
    }
    await patchConfig(data)
    setVisibleChangeDialog(false)
    setTimeout(loadConfig, 500)
  },[patchConfig, getChanges])

  return (
    <Card header="Server settings">
      {
        loading?
        <Loading/>:
        null
      }
      {editedSettings.map((group, index) => (
        <ContentBox key={index} label={group[0].tag}>
          {group.map((item) => (
            item.type === ConfigItemType.NUMBER ? (
              <NumberField
                border
                placeholder={item.key}
                key={`${item.tag}-${item.key}`}
                name={item.key}
                value={Number(item.value)}
                onChange={(data, name) => handleChangeNumber(data, name, item.tag)}
              />
            ) : item.type === ConfigItemType.PASSWORD ? (
              <PasswordField
                border
                key={`${item.tag}-${item.key}`}
                value={item.value}
                tag={item.tag}
                name={item.key}
                onChange={changePass}
              />
            ) : (
              <TextField
                border
                placeholder={item.key}
                key={`${item.tag}-${item.key}`}
                name={item.key}
                value={item.value}
                onChange={(e) => handleChange(e, item.tag)}
              />
            )
          ))}
        </ContentBox>
      ))}

      <Button onClick={handleSave}>Сохранить</Button>
      {
        visibleChangeDialog?
        <BasicTemplateDialog 
          header="Change"
          action={
            <BaseActionCard>
              <Button styleType="text" onClick={()=>setVisibleChangeDialog(false)}>cancel</Button>
              <Button styleType="text" onClick={saveSand}>ok</Button>
            </BaseActionCard>
          }
          onHide={()=>setVisibleChangeDialog(false)}
        >
          {
            getChanges().map((item, index)=>(
              <Typography style={{display: "block"}} type="body" key={index}>
                {`${item.key}: ${item.oldValue} -> ${item.newValue}`}
              </Typography>
            ))
          }
        </BasicTemplateDialog>
        :null
      }
    </Card>
  );
};