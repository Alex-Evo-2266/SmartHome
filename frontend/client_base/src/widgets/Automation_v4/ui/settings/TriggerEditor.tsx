import { useCallback, useState } from "react";
import type { Automation } from "@src/entites/automation_v4";
import { DeviceSelectField } from "@src/entites/devices";
import { Button, ContentBox, DayOfWeekField, MoreText, Typography } from "alex-evo-sh-ui-kit";
import { RoomObjectSelectField } from "@src/features/Room";
import { AddTrigger } from "./dialogs/AddTrigger";
import { TriggerKind } from "../model/editorTypes";
import { DateField, SelectField, TimeField } from "@src/shared";
import { numberToWeekday, weekdayToNumber } from "@src/shared/lib/helpers/dayOfWeekConverts";
import { toLocalDate, toLocalTime, updateDateTimeLocal } from "@src/shared/lib/helpers/timeFormat";

type Trigger = Automation["trigger"][number];


interface TriggerEditorProps {
  triggers: Automation["trigger"];
  onChange: (triggers: Automation["trigger"]) => void;
}

function createTrigger(kind: TriggerKind): Trigger {
  if (kind === "device") {
    return {
      type: "device",
      device: "",
      field: "",
      condition: null,
    } as Trigger;
  }

  if (kind === "room") {
    return {
      type: "room",
      room: "",
      device_type: "",
      field: "",
      condition: null,
    } as Trigger;
  }

  return {
    type: "time",
    kind: "weekly",
    at: "08:00",
    weekdays: [0, 1, 2, 3, 4],
  } as Trigger;
}

export function TriggerEditor({
  triggers,
  onChange,
}: TriggerEditorProps) {
  const [addTriggerDialogVisible, setAddTriggerDialogVisible] =
    useState<boolean>(false);


  function addTrigger(kindToAdd: TriggerKind) {
    onChange([...triggers, createTrigger(kindToAdd)]);
  }

  function updateTrigger(index: number, patch: Record<string, unknown>) {
    onChange(
      triggers.map((trigger, currentIndex) =>
        currentIndex === index
          ? ({ ...trigger, ...patch } as Trigger)
          : trigger,
      ),
    );
  }

  function removeTrigger(index: number) {
    onChange(
      triggers.filter((_, currentIndex) => currentIndex !== index),
    );
  }


  console.log(triggers)

  return (
    <section className="automation-settings__section">
      <div className="automation-settings__row">
        <label>Триггеры запуска</label>

        <span className="automation-editor__step-count">
          {triggers.length}
        </span>
      </div>

      {triggers.length === 0 && (
        <div className="automation-settings__empty">
          <span>Триггеры не добавлены</span>
          <p>
            Добавьте событие устройства, комнаты или расписание.
          </p>
        </div>
      )}

      <div className="automation-trigger-list">
        {triggers.map((trigger, index) => (
          <div
            className="automation-trigger-item"
            key={`${trigger.type}-${index}`}
          >
                <ContentBox 
                label={
                    trigger.type === "device"? "Триггер устройства":
                    trigger.type === "room"? "Триггер комнаты":
                    trigger.type === "time"? "Временной триггер":""}
                border collapsible defaultVisible={false}
                >

            {trigger.type === "device" && (
                <>
                    <DeviceSelectField onChange={(data:string)=>{
                        const segments = data.split(".")
                        updateTrigger(index, {
                            device: segments[0],
                            field: segments[1]
                    })}} value={`${trigger.device}.${trigger.field}`}/>
                </>
            )}

            {trigger.type === "room" && (
              <>
                    <RoomObjectSelectField onChange={(data:string)=>{
                        console.log(data)
                        const segments = data.split(".")
                        updateTrigger(index, {
                            room: segments[0],
                            device_type: segments[1],
                            field: segments[2]
                    })}} value={`${trigger.room}.${trigger.device_type}.${trigger.field}`}/>
              </>
            )}

            {trigger.type === "time" && (
              <>
                <SelectField border items={[
                    {
                        value: "weekly",
                        title: "По дням недели"
                    },
                    {
                        title: "Один раз",
                        value: "once"
                    },
                    {
                        value: "monthly",
                        title: "По дням месяца"
                    }
                ]} value={trigger.kind} onChange={(value) => {
                      const kind = value;

                      if (kind === "weekly") {
                        updateTrigger(index, {
                          kind: "weekly",
                          at: "08:00",
                          weekdays: [0, 1, 2, 3, 4],
                          run_at: undefined,
                          month_days: undefined,
                          interval: undefined,
                          unit: undefined,
                        });
                      } else if (kind === "once") {
                        updateTrigger(index, {
                          kind: "once",
                          run_at: new Date(Date.now() + 60_000)
                            .toISOString(),
                          at: undefined,
                          weekdays: undefined,
                          month_days: undefined,
                          interval: undefined,
                          unit: undefined,
                        });
                      } else if (kind === "monthly") {
                        updateTrigger(index, {
                          kind: "monthly",
                          at: "08:00",
                          month_days: [1],
                          run_at: undefined,
                          weekdays: undefined,
                          interval: undefined,
                          unit: undefined,
                        });
                      } else if (kind === "interval") {
                        updateTrigger(index, {
                          kind: "interval",
                          interval: 5,
                          unit: "minutes",
                          run_at: undefined,
                          at: undefined,
                          weekdays: undefined,
                          month_days: undefined,
                        });
                      }
                    }}/>

                {trigger.kind === "weekly" && (
                  <>
                        <TimeField border value={trigger.at} onChange={(value) =>
                            updateTrigger(index, {
                                at: value,
                            })
                        }/>
                        <DayOfWeekField
                        value={trigger.weekdays.map(numberToWeekday).filter(v=>v!==undefined)}
                        onChange={(value) => {
                            const converts = value.map(weekdayToNumber).filter(v=>v!==undefined)
                            updateTrigger(index, { weekdays: converts });
                        }}
                        />
                  </>
                )}

                {trigger.kind === "once" && (
                    
                    <TriggerTimeOnce date={trigger.run_at} onChange={(value)=>{
                        updateTrigger(index, {
                            run_at: new Date(value).toISOString(),
                        });
                    }}/>

                )}

                {trigger.kind === "monthly" && (
                  <>
                  <TimeField border value={trigger.at}
                        onChange={(value) =>
                          updateTrigger(index, {
                            at: value,
                          })
                        }/>
                   <MoreText border value={trigger.month_days.join(",")}
                        onChange={(value) => {
                          const month_days = value
                            .split(",")
                            .map((value) => Number(value.trim()))
                            .filter(
                              (value) =>
                                Number.isInteger(value) &&
                                value >= 1 &&
                                value <= 31,
                            );

                          updateTrigger(index, { month_days });
                        }}/>
                  </>
                )}
              </>
            )}
                <Button type="button" onClick={()=>removeTrigger(index)}>удалить</Button>
            </ContentBox>

          </div>
        ))}
      </div>

      <div className="automation-add-step">
        <Button onClick={()=>setAddTriggerDialogVisible(true)}>добавить триггер</Button>
      </div>
      {
        addTriggerDialogVisible && 
            <AddTrigger onHide={()=>setAddTriggerDialogVisible(false)} onSuccess={addTrigger}/>
      }
    </section>
  );
}

type DateTimePart = "date" | "time";


const TriggerTimeOnce = ({onChange, date}:{onChange:(date:string)=>void, date:string}) => {

    const updateDateTime = useCallback((
        datetimeLocal: string,
        type: DateTimePart,
        data: string,
    ) => {

        const dataOut = updateDateTimeLocal(datetimeLocal, type, data)
        console.log(dataOut)
        onChange(dataOut)
    },[onChange])

    

    return(
        <>
            <Typography type="body">Введине дату и время</Typography>
            <DateField border value={toLocalDate(date)} onChange={value => updateDateTime(date, "date", value)}/>
            <TimeField border value={toLocalTime(date)} onChange={value => updateDateTime(date, "time", value)}/>
        </>
    )

}