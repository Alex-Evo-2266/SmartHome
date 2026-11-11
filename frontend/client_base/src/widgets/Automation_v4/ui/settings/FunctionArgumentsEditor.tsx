import { useCallback, useState } from "react";
import type { Automation } from "@src/entites/automation_v4";
import {
  Button,
  ContentBox,
  DangerButton,
  NumberField,
  TextField,
} from "alex-evo-sh-ui-kit";
import { MODAL_ROOT_ID } from "@src/const";
import { SelectField, TimeField } from "@src/shared";
import { AddArgument, FormDataAddArgument } from "./dialogs/AddArgument";

// ─── Типы ──────────────────────────────────────────────────

type Parameters = Automation["parameters"];
type Parameter = Parameters[string];
type Definition = Parameter["definition"]
type DefinitionType = Exclude<Definition["type"], "enum" | "for_path">
type PathType = "string" | "number" | "boolean" | "any"

interface FunctionArgumentsEditorProps {
  parameters: Parameters;
  onChange: (parameters: Parameters) => void;
}

// ─── Константы ─────────────────────────────────────────────

const DEFINITION_TYPES: {
  value: DefinitionType;
  title: string;
}[] = [
  { value: "string", title: "Строка" },
  { value: "number", title: "Число" },
  { value: "boolean", title: "Логическое значение" },
  { value: "time", title: "Время" },
  { value: "path", title: "Путь" },
];

const PATH_TYPES: {
  value: PathType;
  title: string;
}[] = [
  { value: "any", title: "" },
  { value: "string", title: "Строка" },
  { value: "number", title: "Число" },
  { value: "boolean", title: "Логическое значение" },
];

// ─── Создание определения ──────────────────────────────────

function createDefinition(type: DefinitionType): Definition {
  switch (type) {
    case "string":
      return {
        type: "string",
        default: "",
      };

    case "number":
      return {
        type: "number",
        default: 0,
      };

    case "boolean":
      return {
        type: "boolean",
        default: false,
      };

    case "time":
      return {
        type: "time",
        default: "08:00",
      };

    case "path":
      return {
        type: "path",
        path_type: "any",
        default: "",
      };
  }
}

function createParameter(name: string, type: DefinitionType, description: string = ""): Parameter {
  return {
    title: name,
    description: description,
    required: false,
    definition: createDefinition(type),
  };
}

// ─── Компонент ─────────────────────────────────────────────

export function FunctionArgumentsEditor({
  parameters,
  onChange,
}: FunctionArgumentsEditorProps) {
  const [addDialogVisible, setAddDialogVisible] = useState(false);

  const entries = Object.entries(parameters ?? {});

  // Обновление параметра целиком.
  function updateParameter(
    key: string,
    parameter: Parameter,
  ) {
    onChange({
      ...parameters,
      [key]: parameter,
    });
  }

  // Обновление только определения параметра.
  function updateDefinition(
    key: string,
    definition: Definition,
  ) {
    const parameter = parameters[key];

    if (!parameter) return;

    updateParameter(key, {
      ...parameter,
      definition,
    });
  }

  // Добавление аргумента.
  const addParameter = useCallback((kind: FormDataAddArgument) => {

    console.log(":d")

    onChange({
      ...parameters,
      [kind.name]: createParameter(kind.name, kind.type, kind.discription),
    });

  },[parameters])

  // Удаление аргумента.
  function removeParameter(key: string) {
    const updated = { ...parameters };

    delete updated[key];

    onChange(updated);
  }

  // Переименование ключа аргумента.
  function renameParameter(oldKey: string, newName: string) {
    const key = newName.trim();

    if (
      !key ||
      key === oldKey ||
      Object.prototype.hasOwnProperty.call(parameters, key)
    ) {
      console.error("key allrady exist")
      return;
    }

    const updated: Parameters = {};

    for (const [currentKey, parameter] of Object.entries(parameters)) {
      updated[currentKey === oldKey ? key : currentKey] = parameter;
    }

    onChange(updated);
  }

  return (
    <section className="automation-settings__section">
      <div className="automation-settings__row">
        <label>Аргументы функции</label>

        <span className="automation-editor__step-count">
          {entries.length}
        </span>
      </div>

      {entries.length === 0 && (
        <div className="automation-settings__empty">
          <span>Аргументы не добавлены</span>
          <p>
            Добавьте аргумент, чтобы передавать значения
            в функцию сценария.
          </p>
        </div>
      )}

      <div className="automation-trigger-list">
        {entries.map(([key, parameter]) => {
          const definition = parameter.definition;

          return (
            <div
              className="automation-trigger-item"
              key={key}
            >
              <ContentBox
                label={`Аргумент: ${parameter.title || key}`}
                border
                collapsible
                defaultVisible
              >
                <TextField
                  border
                  disabled
                  placeholder="name"
                  value={key}
                  onChange={(data)=>{renameParameter(key, data)}}
                />


                <SelectField
                  border
                  placeholder="type"
                  items={DEFINITION_TYPES.map((item) => ({
                    value: item.value,
                    title: item.title,
                  }))}
                  value={definition.type}
                  onChange={(value) => {
                    updateDefinition(
                      key,
                      createDefinition(value as DefinitionType),
                    );
                  }}
                />

                {definition.type === "string" && (
                  <TextField
                    border
                    placeholder="default"
                    value={definition.default}
                    onChange={(value) => {
                        updateDefinition(key, {
                          type: "string",
                          default: value,
                        });
                      }}
                  />
                )}

                {definition.type === "number" && (
                  <NumberField
                    border
                    placeholder="default"
                    value={definition.default}
                    onChange={(value) => {
                        updateDefinition(key, {
                          type: "number",
                          default: value,
                        });
                      }}
                  />
                )}

                {definition.type === "boolean" && (
                    <SelectField items={[{
                      title: "true",
                      value: "true"
                    },{
                      title: "false",
                      value: "false"
                    }]}
                    border
                    placeholder="default"
                    value={String(Boolean(definition.default))}
                    onChange={(value) => {
                        updateDefinition(key, {
                          type: "boolean",
                          default:
                            value === ""
                              ? null
                              : value === "true",
                        });
                      }}
                    />
                )}

                {definition.type === "time" && (
                    <TimeField
                      border
                      value={
                        typeof definition.default === "string"
                          ? definition.default
                          : ""
                      }
                      onChange={(value) =>
                        updateDefinition(key, {
                          type: "time",
                          default: value,
                        })
                      }
                    />
                )}

                {definition.type === "path" && (
                  <>
                  <SelectField border items={PATH_TYPES} onChange={(value) =>
                        updateDefinition(key, {
                          type: "path",
                          path_type: value as PathType,
                          default: null,
                        })
                      }/>
                  </>
                  
                )}

                <DangerButton
                  style={{ background: "var(--Error-color)" }}
                  container={document.getElementById(MODAL_ROOT_ID)}
                  type="button"
                  text="Вы уверены, что хотите удалить аргумент?"
                  header="Удалить аргумент"
                  onClick={() => removeParameter(key)}
                >
                  Удалить аргумент
                </DangerButton>
              </ContentBox>
            </div>
          );
        })}
      </div>

      {/* Добавление аргумента */}

      <div className="automation-add-step">
        <Button
          onClick={()=>setAddDialogVisible(true)}
        >
          Добавить аргумент
        </Button>
      </div>
      {
        addDialogVisible && <AddArgument onHide={()=>setAddDialogVisible(false)} onSuccess={addParameter}/>
      }
    </section>
  );
}