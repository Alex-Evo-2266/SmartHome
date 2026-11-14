import type {
  Automation,
  AutomationTrigger,
  ExpressionArg,
  RefArg,
  TimeTrigger,
} from "@src/entites/automation_v4";
import { DeviceSelectField } from "@src/entites/devices";
import { RoomObjectSelectField } from "@src/features/Room";
import { DateField, SelectField, TimeField } from "@src/shared";
import { numberToWeekday, weekdayToNumber } from "@src/shared/lib/helpers/dayOfWeekConverts";
import { toLocalDate, toLocalTime, updateDateTimeLocal } from "@src/shared/lib/helpers/timeFormat";
import { DayOfWeekField, MoreText, Typography } from "alex-evo-sh-ui-kit";
import { useState } from "react";

import { TriggerConditionField } from "./TriggerConditionField";
import type { TriggerKind } from "../../../../entites/automation_v4/helpers/editorTypes";
import {
  ExpressionBuilderModal,
  type ExpressionBuilderModalProps,
} from "../expressionBuilder/StartBlock";

interface TriggerFieldsProps {
  trigger: AutomationTrigger;
  onChange: (trigger: AutomationTrigger) => void;
  expressions: Automation["expressions"];
  onExpressionsChange: ExpressionBuilderModalProps["onExpressionsChange"];
  variables: ExpressionBuilderModalProps["variables"];
  capabilities: ExpressionBuilderModalProps["capabilities"];
  showTypeSelect?: boolean;
}

function createTrigger(kind: TriggerKind): AutomationTrigger {
  switch (kind) {
    case "device":
      return {
        type: "device",
        device: "",
        field: "",
        condition: null,
      };
    case "room":
      return {
        type: "room",
        room: "",
        device_type: "",
        field: "",
        condition: null,
      };
    case "time":
      return createTimeTrigger("weekly");
  }
}

function createTimeTrigger(
  kind: TimeTrigger["kind"],
  timezone?: string | null,
): TimeTrigger {
  switch (kind) {
    case "once":
      return {
        type: "time",
        kind,
        run_at: new Date(Date.now() + 60_000).toISOString(),
        ...(timezone !== undefined ? { timezone } : {}),
      };
    case "weekly":
      return {
        type: "time",
        kind,
        at: "08:00",
        weekdays: [0, 1, 2, 3, 4],
        ...(timezone !== undefined ? { timezone } : {}),
      };
    case "monthly":
      return {
        type: "time",
        kind,
        at: "08:00",
        month_days: [1],
        ...(timezone !== undefined ? { timezone } : {}),
      };
    case "interval":
      return {
        type: "time",
        kind,
        interval: 5,
        unit: "minutes",
        ...(timezone !== undefined ? { timezone } : {}),
      };
  }
}

function isRefArg(value: ExpressionArg): value is RefArg {
  return value.type === "ref";
}

export function TriggerFields({
  trigger,
  onChange,
  expressions,
  onExpressionsChange,
  variables,
  capabilities,
  showTypeSelect = false,
}: TriggerFieldsProps) {
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [conditionError, setConditionError] = useState(false);

  function changeKind(kind: TriggerKind) {
    const timezone = trigger.type === "time" ? trigger.timezone : undefined;
    onChange(
      kind === "time"
        ? createTimeTrigger("weekly", timezone)
        : createTrigger(kind),
    );
    setIsConditionOpen(false);
    setConditionError(false);
  }

  function updateTimeTrigger(next: TimeTrigger) {
    onChange(next);
  }

  function updateCondition(value: ExpressionArg) {
    if (!isRefArg(value)) {
      setConditionError(true);
      return;
    }

    if (trigger.type === "device" || trigger.type === "room") {
      onChange({ ...trigger, condition: value });
      setConditionError(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {showTypeSelect && (
        <SelectField
          border
          items={[
            { value: "device", title: "Событие устройства" },
            { value: "room", title: "Событие комнаты" },
            { value: "time", title: "Временное событие" },
          ]}
          value={trigger.type}
          onChange={(value) => {
            if (value === "device" || value === "room" || value === "time") {
              changeKind(value);
            }
          }}
        />
      )}

      {trigger.type === "device" && (
        <DeviceSelectField
          value={`${trigger.device}.${trigger.field}`}
          onChange={(data: { binding: string }) => {
            const segments = data.binding.split(".");
            if (segments.length >= 3 && segments[1] && segments[2]) {
              onChange({
                ...trigger,
                device: segments[1],
                field: segments[2],
              });
            }
          }}
        />
      )}

      {trigger.type === "room" && (
        <RoomObjectSelectField
          value={`${trigger.room}.${trigger.device_type}.${trigger.field}`}
          onChange={(value: string) => {
            const segments = value.split(".");
            if (
              segments.length >= 4 &&
              segments[1] &&
              segments[2] &&
              segments[3]
            ) {
              onChange({
                ...trigger,
                room: segments[1],
                device_type: segments[2],
                field: segments[3],
              });
            }
          }}
        />
      )}

      {trigger.type === "time" && (
        <>
          <SelectField
            border
            items={[
              { value: "weekly", title: "По дням недели" },
              { value: "once", title: "Один раз" },
              { value: "monthly", title: "По дням месяца" },
              { value: "interval", title: "Через интервал" },
            ]}
            value={trigger.kind}
            onChange={(value) => {
              if (
                value === "weekly" ||
                value === "once" ||
                value === "monthly" ||
                value === "interval"
              ) {
                updateTimeTrigger(
                  createTimeTrigger(value, trigger.timezone),
                );
              }
            }}
          />

          {trigger.kind === "weekly" && (
            <>
              <TimeField
                border
                value={trigger.at}
                onChange={(at) =>
                  updateTimeTrigger({ ...trigger, at })
                }
              />
              <DayOfWeekField
                value={trigger.weekdays
                  .map(numberToWeekday)
                  .filter((weekday) => weekday !== undefined)}
                onChange={(weekdays) => {
                  const converted = weekdays
                    .map(weekdayToNumber)
                    .filter((day): day is number => day !== undefined);
                  updateTimeTrigger({ ...trigger, weekdays: converted });
                }}
              />
            </>
          )}

          {trigger.kind === "once" && (
            <>
              <Typography type="body">Выберите дату и время</Typography>
              <DateField
                border
                value={toLocalDate(trigger.run_at)}
                onChange={(value) =>
                  updateTimeTrigger({
                    ...trigger,
                    run_at: updateDateTimeLocal(trigger.run_at, "date", value),
                  })
                }
              />
              <TimeField
                border
                value={toLocalTime(trigger.run_at)}
                onChange={(value) =>
                  updateTimeTrigger({
                    ...trigger,
                    run_at: updateDateTimeLocal(trigger.run_at, "time", value),
                  })
                }
              />
            </>
          )}

          {trigger.kind === "monthly" && (
            <>
              <TimeField
                border
                value={trigger.at}
                onChange={(at) =>
                  updateTimeTrigger({ ...trigger, at })
                }
              />
              <MoreText
                border
                value={trigger.month_days.join(",")}
                onChange={(value) => {
                  const month_days = value
                    .split(",")
                    .map((day) => Number(day.trim()))
                    .filter(
                      (day) =>
                        Number.isInteger(day) && day >= 1 && day <= 31,
                    );
                  updateTimeTrigger({ ...trigger, month_days });
                }}
              />
            </>
          )}

          {trigger.kind === "interval" && (
            <>
              <MoreText
                border
                value={String(trigger.interval)}
                onChange={(value) => {
                  const interval = Number(value);
                  if (Number.isFinite(interval) && interval > 0) {
                    updateTimeTrigger({ ...trigger, interval });
                  }
                }}
              />
              <SelectField
                border
                items={[
                  { value: "seconds", title: "Секунд" },
                  { value: "minutes", title: "Минут" },
                  { value: "hours", title: "Часов" },
                  { value: "days", title: "Дней" },
                ]}
                value={trigger.unit}
                onChange={(value) => {
                  if (
                    value === "seconds" ||
                    value === "minutes" ||
                    value === "hours" ||
                    value === "days"
                  ) {
                    updateTimeTrigger({ ...trigger, unit: value });
                  }
                }}
              />
            </>
          )}
        </>
      )}

      {(trigger.type === "device" || trigger.type === "room") && (
        <>
          <TriggerConditionField
            value={trigger.condition ?? null}
            onEdit={() => setIsConditionOpen(true)}
            onRemove={() => {
              onChange({ ...trigger, condition: null });
              setConditionError(false);
            }}
          />
          {conditionError && (
            <div role="alert">
              Условие триггера должно быть ссылкой на булево выражение.
            </div>
          )}
        </>
      )}

      {isConditionOpen &&
        (trigger.type === "device" || trigger.type === "room") && (
          <ExpressionBuilderModal
            type="boolean"
            value={trigger.condition ?? { type: "ref", ref: null }}
            expressions={expressions}
            onExpressionsChange={onExpressionsChange}
            variables={variables}
            capabilities={capabilities}
            onChange={updateCondition}
            onClose={() => setIsConditionOpen(false)}
          />
        )}
    </div>
  );
}
