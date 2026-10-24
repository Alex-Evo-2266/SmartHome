import { useCallback, useState } from "react";
import type { Automation } from "@src/entites/automation_v4";
import { DeviceSelectField } from "@src/entites/devices";
import { Button, ContentBox, DangerButton } from "alex-evo-sh-ui-kit";
import { MODAL_ROOT_ID } from "@src/const";
import { RoomObjectSelectField } from "@src/features/Room";
import { AddTrigger } from "./dialogs/AddTrigger";
import { TriggerKind } from "../model/editorTypes";

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
                <label>
                  Расписание
                  <select
                    value={trigger.kind}
                    onChange={(event) => {
                      const kind = event.target.value;

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
                    }}
                  >
                    <option value="weekly">По дням недели</option>
                    <option value="once">Один раз</option>
                    <option value="monthly">По дням месяца</option>
                    <option value="interval">Через интервал</option>
                  </select>
                </label>

                {trigger.kind === "weekly" && (
                  <>
                    <label>
                      Время
                      <input
                        type="time"
                        value={trigger.at}
                        onChange={(event) =>
                          updateTrigger(index, {
                            at: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      Дни недели (0 — понедельник, 6 — воскресенье)
                      <input
                        value={trigger.weekdays.join(",")}
                        onChange={(event) => {
                          const weekdays = event.target.value
                            .split(",")
                            .map((value) => Number(value.trim()))
                            .filter(
                              (value) =>
                                Number.isInteger(value) &&
                                value >= 0 &&
                                value <= 6,
                            );

                          updateTrigger(index, { weekdays });
                        }}
                        placeholder="0,1,2,3,4"
                      />
                    </label>
                  </>
                )}

                {trigger.kind === "once" && (
                  <label>
                    Дата и время
                    <input
                      type="datetime-local"
                      value={trigger.run_at.slice(0, 16)}
                      onChange={(event) => {
                        const value = event.target.value;

                        if (value) {
                          updateTrigger(index, {
                            run_at: new Date(value).toISOString(),
                          });
                        }
                      }}
                    />
                  </label>
                )}

                {trigger.kind === "monthly" && (
                  <>
                    <label>
                      Время
                      <input
                        type="time"
                        value={trigger.at}
                        onChange={(event) =>
                          updateTrigger(index, {
                            at: event.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      Дни месяца
                      <input
                        value={trigger.month_days.join(",")}
                        onChange={(event) => {
                          const month_days = event.target.value
                            .split(",")
                            .map((value) => Number(value.trim()))
                            .filter(
                              (value) =>
                                Number.isInteger(value) &&
                                value >= 1 &&
                                value <= 31,
                            );

                          updateTrigger(index, { month_days });
                        }}
                        placeholder="1,15"
                      />
                    </label>
                  </>
                )}

                {trigger.kind === "interval" && (
                  <>
                    <label>
                      Интервал
                      <input
                        type="number"
                        min={1}
                        value={trigger.interval}
                        onChange={(event) =>
                          updateTrigger(index, {
                            interval: Number(event.target.value),
                          })
                        }
                      />
                    </label>

                    <label>
                      Единица времени
                      <select
                        value={trigger.unit}
                        onChange={(event) =>
                          updateTrigger(index, {
                            unit: event.target.value,
                          })
                        }
                      >
                        <option value="seconds">Секунды</option>
                        <option value="minutes">Минуты</option>
                        <option value="hours">Часы</option>
                        <option value="days">Дни</option>
                      </select>
                    </label>
                  </>
                )}
              </>
            )}
                <DangerButton style={{background: "var(--Error-color)"}} container={document.getElementById(MODAL_ROOT_ID)} type="button" text="Вы уверены что хотите удалить триггер?" header="Удалить триггер" onClick={()=>removeTrigger(index)}>удалить</DangerButton>
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