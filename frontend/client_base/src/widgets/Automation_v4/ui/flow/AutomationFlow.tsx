import type {
  Automation,
  AutomationStep,
  ConditionStep,
} from "@src/entites/automation_v4";
import { Panel } from "alex-evo-sh-ui-kit";
import { useEffect, useMemo, useState } from "react";


import { AutomationStartNode } from "./AutomationStartNode";
import { AutomationStepNode } from "./AutomationStepNode";
import type {
  EditorSelection,
  StepEditorKind,
  StepInsertTarget,
} from "../../../../entites/automation_v4/helpers/editorTypes";
import { STEP_TITLES } from "../../../../entites/automation_v4/helpers/editorTypes";
import { getExpressionPreview } from "../shared/expressionPreview";


import "./styleFlow.scss";

type FlowPage =
  | { type: "main" }
  | {
      type: "branch";
      conditionId: string;
      branch: "true" | "false";
    };

const MAIN_PAGE: FlowPage = { type: "main" };

interface AutomationFlowProps {
  automation: Automation;
  selection: EditorSelection | null;
  onSelect: (selection: EditorSelection) => void;
  onAddStep: (kind: StepEditorKind, target: StepInsertTarget) => void;
}

const STEP_KINDS: StepEditorKind[] = [
  "action",
  "delay",
  "condition",
  "await",
  "script",
];

function getStepChain(
  steps: Automation["steps"],
  startId: string | null | undefined,
): [string, AutomationStep][] {
  const result: [string, AutomationStep][] = [];
  const visited = new Set<string>();
  let currentId = startId;

  while (currentId && !visited.has(currentId)) {
    const step = steps[currentId];
    if (!step) break;

    visited.add(currentId);
    result.push([currentId, step]);

    // The executor chooses a condition branch and does not follow condition.next.
    if (step.type === "condition") break;
    currentId = step.next;
  }

  return result;
}

function getReachableStepIds(
  steps: Automation["steps"],
  startId: string | null | undefined,
): Set<string> {
  const visited = new Set<string>();
  const pending = startId ? [startId] : [];

  while (pending.length > 0) {
    const id = pending.pop();
    if (!id || visited.has(id)) continue;

    const step = steps[id];
    if (!step) continue;

    visited.add(id);

    if (step.type === "condition") {
      if (step.on_true) pending.push(step.on_true);
      if (step.on_false) pending.push(step.on_false);
      continue;
    }

    if (step.next) pending.push(step.next);
    if (step.type === "await" && step.on_timeout) {
      pending.push(step.on_timeout);
    }
  }

  return visited;
}

function getBranchStepCount(
  steps: Automation["steps"],
  startId: string | null | undefined,
): number {
  return getReachableStepIds(steps, startId).size;
}

function formatStepCount(count: number): string {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${count} шагов`;
  }
  if (lastDigit === 1) return `${count} шаг`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} шага`;
  return `${count} шагов`;
}

function ConditionBranchCards({
  step,
  automation,
  onOpen,
}: {
  step: ConditionStep;
  automation: Automation;
  onOpen: (branch: "true" | "false") => void;
}) {
  const preview = getExpressionPreview(
    step.condition,
    automation.expressions,
    null,
  );

  return (
    <div className="automation-flow__branch-cards">
      {(["true", "false"] as const).map((branch) => {
        const startId =
          branch === "true" ? step.on_true : step.on_false;
        const label = branch === "true" ? "Да" : "Нет";

        return (
          <button
            type="button"
            key={branch}
            className={`automation-flow__branch-card automation-flow__branch-card--${branch}`}
            onClick={() => onOpen(branch)}
          >
            <span className="automation-flow__branch-title">
              <span>Ветка «{label}»</span>
              <span aria-hidden="true">›</span>
            </span>
            <span className="automation-flow__branch-count">
              {formatStepCount(getBranchStepCount(automation.steps, startId))}
            </span>
            <span className="automation-flow__branch-preview">
              Условие: {preview}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function AutomationFlow({
  automation,
  selection,
  onSelect,
  onAddStep,
}: AutomationFlowProps) {
  const [navigation, setNavigation] = useState<FlowPage[]>([
    { type: "main" },
  ]);
  const [addTarget, setAddTarget] = useState<StepInsertTarget | null>(null);

  const currentPage = navigation[navigation.length - 1] ?? MAIN_PAGE;
  const activeCondition =
    currentPage.type === "branch"
      ? automation.steps[currentPage.conditionId]
      : undefined;

  useEffect(() => {
    setNavigation((pages) => {
      const validLength = pages.findIndex((page) => {
        if (page.type === "main") return false;
        return automation.steps[page.conditionId]?.type !== "condition";
      });

      return validLength === -1
        ? pages
        : pages.slice(0, Math.max(validLength, 1));
    });
  }, [automation.steps]);

  const pageSteps = useMemo(() => {
    if (currentPage.type === "main") {
      return getStepChain(automation.steps, automation.entry);
    }

    const condition = automation.steps[currentPage.conditionId];
    if (condition?.type !== "condition") return [];

    const startId =
      currentPage.branch === "true"
        ? condition.on_true
        : condition.on_false;
    return getStepChain(automation.steps, startId);
  }, [automation.entry, automation.steps, currentPage]);

  const detachedSteps = useMemo(() => {
    if (currentPage.type !== "main") return [];

    const reachable = getReachableStepIds(
      automation.steps,
      automation.entry,
    );
    return Object.entries(automation.steps).filter(
      ([id]) => !reachable.has(id),
    );
  }, [automation.entry, automation.steps, currentPage.type]);

  const openBranch = (conditionId: string, branch: "true" | "false") => {
    const nextPage: FlowPage = { type: "branch", conditionId, branch };
    setNavigation((pages) => {
      const existingIndex = pages.findIndex(
        (page) =>
          page.type === "branch" &&
          page.conditionId === conditionId &&
          page.branch === branch,
      );

      return existingIndex === -1
        ? [...pages, nextPage]
        : pages.slice(0, existingIndex + 1);
    });
  };

  const handleAddStep = (kind: StepEditorKind) => {
    if (!addTarget) return;
    onAddStep(kind, addTarget);
    setAddTarget(null);
  };

  const renderStep = (
    id: string,
    step: AutomationStep,
    index: number,
    target: (stepId: string) => StepInsertTarget,
  ) => (
    <div className="automation-flow__item" key={id}>
      <AutomationStepNode
        id={id}
        step={step}
        index={index}
        selected={selection?.type === "step" && selection.id === id}
        onSelect={(stepId) => onSelect({ type: "step", id: stepId })}
      />

      {step.type === "condition" && (
        <ConditionBranchCards
          step={step}
          automation={automation}
          onOpen={(branch) => openBranch(id, branch)}
        />
      )}

      {step.type !== "condition" && (
        <button
          type="button"
          className="automation-flow__insert"
          aria-label={`Добавить шаг после шага ${index + 1}`}
          onClick={() => setAddTarget(target(id))}
        >
          <span>+</span>
        </button>
      )}
    </div>
  );

  const currentBranchLabel =
    currentPage.type === "branch"
      ? currentPage.branch === "true"
        ? "Да"
        : "Нет"
      : "";
  const parentCondition =
    activeCondition?.type === "condition" ? activeCondition : null;
  const parentConditionLabel =
    parentCondition?.label || "Условие";

  return (
    <main className="automation-editor__canvas">
      <Panel className="automation-editor__canvas-heading">
        <div>
          <h2>
            {currentPage.type === "main"
              ? "Последовательность"
              : `Ветка: ${currentBranchLabel}`}
          </h2>
          <p>
            {currentPage.type === "main"
              ? "Выберите шаг, чтобы открыть его настройки"
              : `Родительское условие: ${parentConditionLabel}`}
          </p>
        </div>
        <span className="automation-editor__step-count">
          {currentPage.type === "branch"
            ? formatStepCount(
                getBranchStepCount(
                  automation.steps,
                  parentCondition
                    ? currentPage.branch === "true"
                      ? parentCondition.on_true
                      : parentCondition.on_false
                    : null,
                ),
              )
            : formatStepCount(pageSteps.length + detachedSteps.length)}
        </span>
      </Panel>

      <nav className="automation-flow__breadcrumbs" aria-label="Навигация по ветвям">
        {navigation.map((page, index) => {
          const label =
            page.type === "main"
              ? "Последовательность"
              : `${automation.steps[page.conditionId]?.label || "Условие"} · ${
                  page.branch === "true" ? "Да" : "Нет"
                }`;

          return (
            <span className="automation-flow__breadcrumb" key={`${label}-${index}`}>
              {index > 0 && <span aria-hidden="true">/</span>}
              <button
                type="button"
                aria-current={index === navigation.length - 1 ? "page" : undefined}
                onClick={() =>
                  setNavigation((pages) => pages.slice(0, index + 1))
                }
              >
                {label}
              </button>
            </span>
          );
        })}
      </nav>

      {currentPage.type === "branch" && parentCondition && (
        <section className="automation-flow__branch-context">
          <div>
            <strong>{parentConditionLabel}</strong>
            <p>
              {getExpressionPreview(
                parentCondition.condition,
                automation.expressions,
                null,
              )}
            </p>
          </div>
          <div className="automation-flow__branch-switch" aria-label="Переключить ветку">
            {(["true", "false"] as const).map((branch) => (
              <button
                type="button"
                key={branch}
                className={
                  currentPage.branch === branch
                    ? "automation-flow__branch-switch-active"
                    : ""
                }
                aria-pressed={currentPage.branch === branch}
                onClick={() =>
                  setNavigation((pages) => [
                    ...pages.slice(0, -1),
                    {
                      type: "branch",
                      conditionId: currentPage.conditionId,
                      branch,
                    },
                  ])
                }
              >
                {branch === "true" ? "Да" : "Нет"}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="automation-flow">
        <div className="automation-flow__list">
          {currentPage.type === "main" ? (
            <>
              <AutomationStartNode
                automation={automation}
                selected={selection?.type === "start"}
                onSelect={() => onSelect({ type: "start" })}
              />
              <button
                type="button"
                className="automation-flow__insert"
                aria-label="Добавить шаг в начало последовательности"
                onClick={() => setAddTarget({ type: "start" })}
              >
                <span>+</span>
              </button>
              {pageSteps.map(([id, step], index) =>
                renderStep(
                  id,
                  step,
                  index,
                  (stepId) => ({ type: "next", stepId }),
                ),
              )}
              {detachedSteps.length > 0 && (
                <section className="automation-flow__detached">
                  <h3>Не подключённые шаги</h3>
                  {detachedSteps.map(([id, step], index) =>
                    renderStep(
                      id,
                      step,
                      pageSteps.length + index,
                      (stepId) => ({ type: "next", stepId }),
                    ),
                  )}
                </section>
              )}
            </>
          ) : pageSteps.length === 0 ? (
            <div className="automation-flow__empty">
              <p>Ветка пока не содержит шагов.</p>
              <button
                type="button"
                className="automation-flow__empty-add"
                onClick={() =>
                  setAddTarget({
                    type: "condition-branch",
                    stepId: currentPage.conditionId,
                    branch: currentPage.branch,
                  })
                }
              >
                + Добавить первый шаг
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="automation-flow__insert"
                aria-label="Добавить шаг в начало ветки"
                onClick={() =>
                  setAddTarget({
                    type: "condition-branch",
                    stepId: currentPage.conditionId,
                    branch: currentPage.branch,
                  })
                }
              >
                <span>+</span>
              </button>
              {pageSteps.map(([id, step], index) =>
                renderStep(
                  id,
                  step,
                  index,
                  (stepId) => ({ type: "next", stepId }),
                ),
              )}
            </>
          )}
        </div>
      </div>

      {addTarget && (
        <div
          className="automation-flow__modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAddTarget(null);
            }
          }}
        >
          <div
            className="automation-flow__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="automation-flow-modal-title"
          >
            <div className="automation-flow__modal-header">
              <h3 id="automation-flow-modal-title">Добавить шаг</h3>
              <button
                type="button"
                className="automation-flow__modal-close"
                onClick={() => setAddTarget(null)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="automation-flow__modal-options">
              {STEP_KINDS.map((kind) => (
                <button
                  key={kind}
                  type="button"
                  className="automation-flow__modal-option"
                  onClick={() => handleAddStep(kind)}
                >
                  {STEP_TITLES[kind]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
