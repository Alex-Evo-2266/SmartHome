import { useState } from "react";
import type { Automation } from "@src/entites/automation_v4";

type Parameters = Automation["parameters"];
type Parameter = Parameters[string];
type Definition = Parameter["definition"];
type DefinitionType = Definition["type"];
type LiteralType = Extract<Definition, { type: "value" }>["data_type"];

interface FunctionArgumentsEditorProps {
  parameters: Parameters;
  onChange: (parameters: Parameters) => void;
}

const LITERAL_TYPES: { value: LiteralType; label: string }[] = [
  { value: "string", label: "Строка" },
  { value: "number", label: "Число" },
  { value: "boolean", label: "Булево значение" },
  { value: "duration", label: "Длительность" },
  { value: "time", label: "Время" },
];

const DEFINITION_TYPES: {
  value: DefinitionType;
  label: string;
}[] = [
  { value: "value", label: "Значение" },
  { value: "device", label: "Устройство" },
  { value: "room_device", label: "Устройство в комнате" },
];

/**
 * Создаёт новое определение с учётом его конкретного типа.
 *
 * data_type и default существуют только у value.
 * device_type у device может быть null или отсутствовать.
 * device_type у room_device обязателен и должен быть строкой.
 */
function createDefinition(type: DefinitionType): Definition {
  switch (type) {
    case "value":
      return {
        type: "value",
        data_type: "string",
        default: "",
      };

    case "device":
      return {
        type: "device",
        device_type: null,
      };

    case "room_device":
      return {
        type: "room_device",
        device_type: "LIGHT",
      };
  }
}

function createParameter(): Parameter {
  return {
    title: "Новый параметр",
    description: "",
    required: false,
    definition: createDefinition("value"),
  };
}

function getDefaultInputValue(
  value: number | string | boolean | null | undefined,
): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function parseDefaultValue(
  value: string,
  dataType: LiteralType,
): number | string | boolean | null {
  if (value === "") {
    return "";
  }

  switch (dataType) {
    case "number": {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }

    case "boolean":
      return value === "true";

    case "string":
    case "duration":
    case "time":
      return value;
  }
}

export default function FunctionArgumentsEditor({
  parameters,
  onChange,
}: FunctionArgumentsEditorProps) {
  const [newKey, setNewKey] = useState("");

  const entries = Object.entries(parameters ?? {});

  const updateParameter = (
    key: string,
    updatedParameter: Parameter,
  ) => {
    onChange({
      ...parameters,
      [key]: updatedParameter,
    });
  };

  const updateDefinition = (
    key: string,
    definition: Definition,
  ) => {
    const parameter = parameters[key];

    if (!parameter) {
      return;
    }

    updateParameter(key, {
      ...parameter,
      definition,
    });
  };

  const addParameter = () => {
    const key = newKey.trim();

    if (!key || Object.prototype.hasOwnProperty.call(parameters, key)) {
      return;
    }

    onChange({
      ...parameters,
      [key]: createParameter(),
    });

    setNewKey("");
  };

  const removeParameter = (key: string) => {
    const updated = { ...parameters };
    delete updated[key];
    onChange(updated);
  };

  const renameParameter = (oldKey: string, newName: string) => {
    const key = newName.trim();

    if (
      !key ||
      key === oldKey ||
      Object.prototype.hasOwnProperty.call(parameters, key)
    ) {
      return;
    }

    const updated: Parameters = {};

    for (const [currentKey, parameter] of Object.entries(parameters)) {
      updated[currentKey === oldKey ? key : currentKey] = parameter;
    }

    onChange(updated);
  };

  return (
    <section className="automation-arguments">
      <div className="automation-arguments__header">
        <h3>Аргументы функции</h3>
      </div>

      <div className="automation-arguments__add">
        <input
          type="text"
          value={newKey}
          placeholder="Имя нового параметра"
          onChange={(event) => setNewKey(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addParameter();
            }
          }}
        />

        <button
          type="button"
          onClick={addParameter}
          disabled={
            !newKey.trim() ||
            Object.prototype.hasOwnProperty.call(parameters, newKey.trim())
          }
        >
          Добавить
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="automation-arguments__empty">
          Аргументы не добавлены.
        </p>
      ) : (
        <div className="automation-arguments__list">
          {entries.map(([key, parameter]) => {
            const definition = parameter.definition;

            return (
              <article
                className="automation-arguments__item"
                key={key}
              >
                <div className="automation-arguments__item-header">
                  <label className="automation-arguments__field">
                    <span>Имя параметра</span>
                    <input
                      type="text"
                      defaultValue={key}
                      onBlur={(event) => {
                        renameParameter(key, event.currentTarget.value);
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => removeParameter(key)}
                    aria-label={`Удалить параметр ${key}`}
                  >
                    Удалить
                  </button>
                </div>

                <label className="automation-arguments__field">
                  <span>Название</span>
                  <input
                    type="text"
                    value={parameter.title}
                    onChange={(event) =>
                      updateParameter(key, {
                        ...parameter,
                        title: event.target.value,
                      })
                    }
                  />
                </label>

                <label className="automation-arguments__field">
                  <span>Описание</span>
                  <textarea
                    value={parameter.description ?? ""}
                    onChange={(event) =>
                      updateParameter(key, {
                        ...parameter,
                        description: event.target.value,
                      })
                    }
                    rows={2}
                  />
                </label>

                <label className="automation-arguments__checkbox">
                  <input
                    type="checkbox"
                    checked={parameter.required}
                    onChange={(event) =>
                      updateParameter(key, {
                        ...parameter,
                        required: event.target.checked,
                      })
                    }
                  />
                  Обязательный параметр
                </label>

                <label className="automation-arguments__field">
                  <span>Тип определения</span>
                  <select
                    value={definition.type}
                    onChange={(event) => {
                      updateDefinition(
                        key,
                        createDefinition(event.target.value as DefinitionType),
                      );
                    }}
                  >
                    {DEFINITION_TYPES.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                {definition.type === "value" && (
                  <>
                    <label className="automation-arguments__field">
                      <span>Тип значения</span>
                      <select
                        value={definition.data_type}
                        onChange={(event) => {
                          const dataType = event.target.value as LiteralType;

                          updateDefinition(key, {
                            ...definition,
                            data_type: dataType,
                            default:
                              dataType === "boolean"
                                ? false
                                : dataType === "number"
                                  ? 0
                                  : "",
                          });
                        }}
                      >
                        {LITERAL_TYPES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="automation-arguments__field">
                      <span>Значение по умолчанию</span>

                      {definition.data_type === "boolean" ? (
                        <select
                          value={getDefaultInputValue(definition.default)}
                          onChange={(event) =>
                            updateDefinition(key, {
                              ...definition,
                              default: parseDefaultValue(
                                event.target.value,
                                definition.data_type,
                              ),
                            })
                          }
                        >
                          <option value="">Не задано</option>
                          <option value="true">Да</option>
                          <option value="false">Нет</option>
                        </select>
                      ) : (
                        <input
                          type={
                            definition.data_type === "number"
                              ? "number"
                              : "text"
                          }
                          value={getDefaultInputValue(definition.default)}
                          onChange={(event) =>
                            updateDefinition(key, {
                              ...definition,
                              default: parseDefaultValue(
                                event.target.value,
                                definition.data_type,
                              ),
                            })
                          }
                        />
                      )}
                    </label>
                  </>
                )}

                {definition.type === "device" && (
                  <label className="automation-arguments__field">
                    <span>Тип устройства (необязательно)</span>
                    <input
                      type="text"
                      value={definition.device_type ?? ""}
                      placeholder="Например, LIGHT"
                      onChange={(event) =>
                        updateDefinition(key, {
                          type: "device",
                          device_type: event.target.value || null,
                        })
                      }
                    />
                  </label>
                )}

                {definition.type === "room_device" && (
                  <label className="automation-arguments__field">
                    <span>Тип устройства</span>
                    <input
                      type="text"
                      required
                      value={definition.device_type}
                      placeholder="Например, LIGHT"
                      onChange={(event) =>
                        updateDefinition(key, {
                          type: "room_device",
                          device_type: event.target.value,
                        })
                      }
                    />
                  </label>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
