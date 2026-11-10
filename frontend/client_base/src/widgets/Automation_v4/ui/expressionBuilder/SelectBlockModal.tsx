import {
    ExpressionBlockSelection,
    ExpressionCapabilitiesResponse,
    ExpressionValueType,
    FunctionDefinition,
    OperatorCategory,
    OperatorDefinition,
    useAutomationAPI,
} from "@src/entites/automation_v4";
import { DialogPortal } from "@src/shared";
import { FullScreenTemplateDialog } from "alex-evo-sh-ui-kit";
import { useCallback, useEffect, useMemo, useState } from "react";

import "./SelectBlockModal.scss";

type SelectBlockModalProps = {
    onHide: () => void;
    onSelect: (selection: ExpressionBlockSelection) => void;
    allowedTypes: readonly ExpressionValueType[];
};

type SimpleBlockDefinition = {
    id: string;
    name: string;
    description: string;
};

const simpleBlocks: Record<"literal" | "path", SimpleBlockDefinition[]> = {
    literal: [
        {
            id: "literal",
            name: "Значение",
            description:
                "Постоянное значение: число, строка, логическое значение и т. д.",
        },
    ],
    path: [
        {
            id: "path",
            name: "Путь",
            description:
                "Ссылка на устройство, поле устройства или аргумент скрипта.",
        },
    ],
};

type CategoryKey = OperatorCategory | "functions" | "literal" | "path";



const categories: {
    id: CategoryKey;
    name: string;
    description: string;
}[] = [
    {
        id: "literal",
        name: "Значения",
        description: "Простые постоянные значения",
    },
    {
        id: "path",
        name: "Пути",
        description: "Ссылки на устройства и переменные",
    },
    {
        id: "binary",
        name: "Бинарные операции",
        description: "Операции с двумя аргументами",
    },
    {
        id: "unary",
        name: "Унарные операции",
        description: "Операции с одним аргументом",
    },
    {
        id: "group",
        name: "Групповые операции",
        description: "Операции с произвольным количеством аргументов",
    },
    {
        id: "functions",
        name: "Функции",
        description: "Встроенные функции Expression Engine",
    },
];

type SelectedBlock =
    | {
          kind: "operator";
          definition: OperatorDefinition;
      }
    | {
          kind: "function";
          definition: FunctionDefinition;
      }
    | {
          kind: "literal";
          definition: SimpleBlockDefinition;
      }
    | {
          kind: "path";
          definition: SimpleBlockDefinition;
      };

type DetailedBlock = Extract<
    SelectedBlock,
    { kind: "operator" | "function" }
>;

export const SelectBlockModal = ({
    onHide,
    onSelect,
    allowedTypes,
}: SelectBlockModalProps) => {
    const { getExpressionCapabilities } = useAutomationAPI();

    const [data, setData] = useState<ExpressionCapabilitiesResponse | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [category, setCategory] = useState<CategoryKey>(
        allowedTypes.length === 1 && allowedTypes[0] === "path"
            ? "path"
            : "binary",
    );
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const allowedTypesSet = useMemo(
        () => new Set<ExpressionValueType>(allowedTypes),
        [allowedTypes],
    );

    const isLiteralAllowed = allowedTypes.some((type) =>
        ["number", "string", "boolean", "time", "duration", "ISO-время", "datetime", "enum"].includes(type),
    );

    const isPathAllowed = allowedTypesSet.has("path");

    // Проверка типа результата, полученного от backend
    const isAllowedResultType = useCallback(
        (resultType: string): boolean => {
            const validTypes: ExpressionValueType[] = [
                "number",
                "string",
                "boolean",
                "time",
                "duration",
                "path",
                "ISO-время",
                "datetime",
                "enum",
            ];

            return (
                validTypes.includes(resultType as ExpressionValueType) &&
                allowedTypesSet.has(resultType as ExpressionValueType)
            );
        },
        [allowedTypesSet],
    );

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await getExpressionCapabilities();

            setData(result as ExpressionCapabilitiesResponse);
        } catch (e) {
            console.error(e);
            setError("Не удалось загрузить список блоков");
        } finally {
            setLoading(false);
        }
    }, [getExpressionCapabilities]);

    useEffect(() => {
        load();
    }, [load]);

    // Получаем блоки выбранной категории
    const blocks = useMemo((): SelectedBlock[] => {
        if (!data) return [];

        if (category === "literal") {
            if (!isLiteralAllowed) return [];

            return simpleBlocks.literal.map((definition) => ({
                kind: "literal" as const,
                definition,
            }));
        }

        if (category === "path") {
            if (!isPathAllowed) return [];

            return simpleBlocks.path.map((definition) => ({
                kind: "path" as const,
                definition,
            }));
        }

        if (category === "functions") {
            return data.functions
                .filter((definition) =>
                    isAllowedResultType(definition.result_type),
                )
                .map((definition) => ({
                    kind: "function" as const,
                    definition,
                }));
        }

        return data.operators[category]
            .filter((definition) =>
                isAllowedResultType(definition.result_type),
            )
            .map((definition) => ({
                kind: "operator" as const,
                definition,
            }));
    }, [
        data,
        category,
        isAllowedResultType,
        isLiteralAllowed,
        isPathAllowed,
    ]);

    // Поиск по доступным блокам
    const filteredBlocks = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return blocks;

        return blocks.filter(({ definition }) =>
            [
                definition.id,
                definition.name,
                definition.description,
            ].some((item) => item.toLowerCase().includes(value)),
        );
    }, [blocks, search]);

    // Текущий выбранный блок
    const selectedBlock = useMemo(() => {
        return (
            filteredBlocks.find(
                (block) => block.definition.id === selectedId,
            ) ?? null
        );
    }, [filteredBlocks, selectedId]);

    // Переключение категории
    const selectCategory = (value: CategoryKey) => {
        setCategory(value);
        setSelectedId(null);
        setSearch("");
    };

    // Подсчёт количества доступных блоков
    const getCategoryCount = (categoryKey: CategoryKey): number => {
        if (!data) return 0;

        if (categoryKey === "literal") {
            return isLiteralAllowed ? simpleBlocks.literal.length : 0;
        }

        if (categoryKey === "path") {
            return isPathAllowed ? simpleBlocks.path.length : 0;
        }

        if (categoryKey === "functions") {
            return data.functions.filter((definition) =>
                isAllowedResultType(definition.result_type),
            ).length;
        }

        return data.operators[categoryKey].filter((definition) =>
            isAllowedResultType(definition.result_type),
        ).length;
    };

    // Выбор блока
    const saveVariant = () => {
        if (!selectedBlock) return;

        if (selectedBlock.kind === "literal") {
            onSelect({
                kind: "literal",
                expressionType: "literal",
            });
        } else if (selectedBlock.kind === "path") {
            onSelect({
                kind: "path",
                expressionType: "path",
            });
        } else if (selectedBlock.kind === "function") {
            const { definition } = selectedBlock;

            onSelect({
                kind: "function",
                expressionType: "call",
                fn: definition.id,
                definition,
            });
        } else {
            const { definition } = selectedBlock;

            onSelect({
                kind: "operator",
                expressionType: definition.category,
                op: definition.id,
                definition,
            });
        }

        onHide();
    };

    // Количество аргументов
    const getArgumentCount = (block: DetailedBlock): string => {
        if (block.kind === "function") {
            const definition = block.definition;

            if (definition.min_args === definition.max_args) {
                return `${definition.min_args}`;
            }

            return definition.max_args === null
                ? `${definition.min_args}..N`
                : `${definition.min_args}..${definition.max_args}`;
        }

        const definition = block.definition;

        if (typeof definition.argument_count === "number") {
            return `${definition.argument_count}`;
        }

        return definition.argument_count.maximum === null
            ? `${definition.argument_count.minimum}..N`
            : `${definition.argument_count.minimum}..${definition.argument_count.maximum}`;
    };

    const getArguments = (block: DetailedBlock) => {
        return block.definition.arguments;
    };

    // Автоматический выбор первого доступного блока
    useEffect(() => {
        if (filteredBlocks.length === 0) {
            setSelectedId(null);
            return;
        }

        const selectedExists = filteredBlocks.some(
            (block) => block.definition.id === selectedId,
        );

        if (!selectedExists) {
            setSelectedId(filteredBlocks[0].definition.id);
        }
    }, [filteredBlocks, selectedId]);

    return (
        <DialogPortal>
            <FullScreenTemplateDialog
                maxWidth={800}
                onHide={onHide}
                onSave={saveVariant}
                header="Select expression block"
            >
                <div className="select-block-modal">
                    {loading && (
                        <div className="select-block-modal__message">
                            Загрузка блоков...
                        </div>
                    )}

                    {error && (
                        <div className="select-block-modal__message select-block-modal__message--error">
                            {error}
                            <button type="button" onClick={load}>
                                Повторить
                            </button>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            {/* Категории */}
                            <aside className="select-block-modal__categories">
                                <div className="select-block-modal__section-title">
                                    Категории
                                </div>

                                {categories.map((item) => {
                                    const count = getCategoryCount(item.id);

                                    return (
                                        <button
                                            type="button"
                                            key={item.id}
                                            className={`select-block-modal__category ${
                                                category === item.id
                                                    ? "select-block-modal__category--active"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                selectCategory(item.id)
                                            }
                                        >
                                            <span>{item.name}</span>
                                            <small>{count}</small>
                                        </button>
                                    );
                                })}
                            </aside>

                            {/* Список блоков */}
                            <section className="select-block-modal__list">
                                <div className="select-block-modal__list-header">
                                    <div>
                                        <h3>
                                            {
                                                categories.find(
                                                    (item) =>
                                                        item.id === category,
                                                )?.name
                                            }
                                        </h3>

                                        <span>
                                            {
                                                categories.find(
                                                    (item) =>
                                                        item.id === category,
                                                )?.description
                                            }
                                        </span>
                                    </div>

                                    <input
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Поиск блока..."
                                    />
                                </div>

                                <div className="select-block-modal__items">
                                    {filteredBlocks.map((block) => {
                                        const { definition } = block;
                                        const active =
                                            selectedId === definition.id;

                                        return (
                                            <button
                                                type="button"
                                                key={definition.id}
                                                className={`select-block-modal__item ${
                                                    active
                                                        ? "select-block-modal__item--active"
                                                        : ""
                                                }`}
                                                aria-pressed={active}
                                                onClick={() =>
                                                    setSelectedId(definition.id)
                                                }
                                            >
                                                <div>
                                                    <strong>
                                                        {definition.name}
                                                    </strong>

                                                    <small>
                                                        {definition.id}
                                                    </small>
                                                </div>

                                                <span>
                                                    {block.kind === "literal"
                                                        ? "literal"
                                                        : block.kind === "path"
                                                          ? "path"
                                                          : block.definition.result_type}
                                                </span>
                                            </button>
                                        );
                                    })}

                                    {filteredBlocks.length === 0 && (
                                        <div className="select-block-modal__empty">
                                            Блоки не найдены
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Информация о выбранном блоке */}
                            <aside className="select-block-modal__details">
                                {selectedBlock ? (
                                    <>
                                        <div className="select-block-modal__details-header">
                                            <h3>
                                                {selectedBlock.definition.name}
                                            </h3>

                                            <code>
                                                {selectedBlock.definition.id}
                                            </code>
                                        </div>

                                        <p>
                                            {
                                                selectedBlock.definition
                                                    .description
                                            }
                                        </p>

                                        <div className="select-block-modal__meta">
                                            <div>
                                                <span>Результат</span>
                                                <strong>
                                                    {selectedBlock.kind ===
                                                    "literal"
                                                        ? "Значение определяется при вводе"
                                                        : selectedBlock.kind ===
                                                            "path"
                                                          ? "Значение по выбранному пути"
                                                          : selectedBlock.definition.result_type}
                                                </strong>
                                            </div>

                                            {(selectedBlock.kind ===
                                                "operator" ||
                                                selectedBlock.kind ===
                                                    "function") && (
                                                <div>
                                                    <span>
                                                        Количество аргументов
                                                    </span>
                                                    <strong>
                                                        {getArgumentCount(
                                                            selectedBlock,
                                                        )}
                                                    </strong>
                                                </div>
                                            )}

                                            {selectedBlock.kind ===
                                                "function" && (
                                                <div>
                                                    <span>Вычисление</span>
                                                    <strong>
                                                        {
                                                            selectedBlock
                                                                .definition
                                                                .evaluation
                                                        }
                                                    </strong>
                                                </div>
                                            )}
                                        </div>

                                        {(selectedBlock.kind === "operator" ||
                                            selectedBlock.kind ===
                                                "function") && (
                                            <>
                                                <div className="select-block-modal__arguments">
                                                    <h4>Аргументы</h4>

                                                    {getArguments(
                                                        selectedBlock,
                                                    ).length ? (
                                                        getArguments(
                                                            selectedBlock,
                                                        ).map((arg) => (
                                                            <div
                                                                key={arg.name}
                                                                className="select-block-modal__argument"
                                                            >
                                                                <strong>
                                                                    {arg.name}
                                                                </strong>

                                                                <span>
                                                                    {arg.value_types.join(
                                                                        ", ",
                                                                    )}
                                                                </span>

                                                                <small>
                                                                    {arg.required
                                                                        ? "Обязательный"
                                                                        : "Необязательный"}
                                                                </small>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span>
                                                            Аргументы
                                                            отсутствуют
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="select-block-modal__validation">
                                                    <h4>
                                                        Правила вычисления
                                                    </h4>

                                                    <p>
                                                        {
                                                            selectedBlock
                                                                .definition
                                                                .validation
                                                        }
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {selectedBlock.kind === "literal" && (
                                            <div className="select-block-modal__arguments">
                                                <h4>Настройка значения</h4>
                                                <p>
                                                    После добавления блока
                                                    можно будет указать
                                                    конкретное значение и его
                                                    тип.
                                                </p>
                                            </div>
                                        )}

                                        {selectedBlock.kind === "path" && (
                                            <div className="select-block-modal__arguments">
                                                <h4>Настройка пути</h4>
                                                <p>
                                                    После добавления блока
                                                    можно будет выбрать
                                                    устройство, поле устройства
                                                    или переменную скрипта.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="select-block-modal__placeholder">
                                        Выберите блок, чтобы посмотреть его
                                        описание
                                    </div>
                                )}
                            </aside>
                        </>
                    )}
                </div>
            </FullScreenTemplateDialog>
        </DialogPortal>
    );
};