import { Automation, useAutomationAPI } from "@src/entites/automation_v4";
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook";
import { AutomationEditor } from "@src/widgets/Automation_v4/ui/AutomationEditor";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

type EditorMode = "create" | "edit";

function createEmptyAutomation(): Automation {
    return {
        schema_version: "1.0",
        id: uuidv4(),
        name: "Новый сценарий",
        description: null,
        trigger: [],
        parameters: {},
        entry: "",
        steps: {},
        expressions: {},
        is_enabled: false,
    };
}

interface AutomationEditorPageProps {
    isCreateRoute?: boolean;
}

export function AutomationEditorPage({ isCreateRoute = false }: AutomationEditorPageProps) {

    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();
    const {getAutomation, addAutomation, editAutomation, deleteAutomation} = useAutomationAPI();
    const {showSnackbar} = useSnackbar();
    const [automation, setAutomation] = useState<null | Automation>(null)
    const [mode, setMode] = useState<EditorMode>(isCreateRoute ? "create" : "edit");
    const [editingId, setEditingId] = useState<string | null>(isCreateRoute ? null : id ?? null);
    const [saving, setSaving] = useState(false);
    const [creating, setCreating] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const savedSnapshot = useRef<string | null>(null);
    const automationRef = useRef<Automation | null>(automation);
    const requestInProgress = useRef(false);
    const skipLoadId = useRef<string | null>(null);

    useLayoutEffect(() => {
        automationRef.current = automation;
    }, [automation]);

    useEffect(() => {
        if (isCreateRoute) {
            const initialAutomation = createEmptyAutomation();
            setMode("create");
            setEditingId(null);
            setLoadError(false);
            setAutomation(initialAutomation);
            savedSnapshot.current = JSON.stringify(initialAutomation);
            return;
        }

        if (!id) return;
        if (skipLoadId.current === id) {
            skipLoadId.current = null;
            return;
        }

        let isCurrent = true;
        setMode("edit");
        setEditingId(id);
        setAutomation(null);
        setLoadError(false);
        savedSnapshot.current = null;

        void getAutomation(id).then((automationData) => {
            if (!isCurrent) return;
            setAutomation(automationData);
            savedSnapshot.current = JSON.stringify(automationData);
        }).catch(() => {
            if (isCurrent) setLoadError(true);
        });

        return () => {
            isCurrent = false;
        };
    }, [id, isCreateRoute, getAutomation]);

    const isDirty = automation !== null
        && savedSnapshot.current !== JSON.stringify(automation);
    const routeReady = isCreateRoute
        ? mode === "create" && editingId === null
        : mode === "edit" && editingId === id;

    const save = useCallback(async () => {
        if (requestInProgress.current) return;

        const currentAutomation = automationRef.current;
        if (!currentAutomation) return;
        if (!currentAutomation.name.trim()) {
            showSnackbar("Укажите название сценария");
            return;
        }
        if (!currentAutomation.id.trim()) {
            showSnackbar("Не удалось определить идентификатор сценария");
            return;
        }

        const snapshot: Automation = {
            ...currentAutomation,
            name: currentAutomation.name.trim(),
        };

        requestInProgress.current = true;
        if (mode === "create") {
            setCreating(true);
        } else {
            if (!editingId || editingId !== snapshot.id) {
                requestInProgress.current = false;
                showSnackbar("Не удалось определить сценарий для сохранения");
                return;
            }
            setSaving(true);
        }

        try {
            if (mode === "create") {
                const createdAutomation = await addAutomation(snapshot);
                const createdId = createdAutomation?.id?.trim();
                if (!createdId) {
                    showSnackbar("Сценарий создан, но сервер не вернул его идентификатор");
                    return;
                }

                const latestAutomation = automationRef.current;
                const nextAutomation = latestAutomation
                    && JSON.stringify(latestAutomation) !== JSON.stringify(currentAutomation)
                    ? {...latestAutomation, id: createdId}
                    : createdAutomation;

                setAutomation(nextAutomation);
                savedSnapshot.current = JSON.stringify(createdAutomation);
                setEditingId(createdId);
                setMode("edit");
                skipLoadId.current = createdId;
                showSnackbar("Сценарий создан");
                navigate(`/automation/${encodeURIComponent(createdId)}`, {replace: true});
            } else {
                const updatedAutomation = await editAutomation(snapshot.id, snapshot);
                savedSnapshot.current = JSON.stringify(snapshot);

                if (
                    automationRef.current
                    && JSON.stringify(automationRef.current) === JSON.stringify(currentAutomation)
                ) {
                    setAutomation(updatedAutomation);
                    savedSnapshot.current = JSON.stringify(updatedAutomation);
                }

                showSnackbar("Сценарий сохранён");
            }
        } catch {
            // useAutomationAPI reports request failures through the existing snackbar.
        } finally {
            requestInProgress.current = false;
            setSaving(false);
            setCreating(false);
        }
    }, [addAutomation, editAutomation, editingId, mode, navigate, showSnackbar]);

    const createNew = useCallback(() => {
        navigate("/automation/new");
    }, [navigate]);

    const deleteAutomationHandler = useCallback((automation: Automation)=>{
        deleteAutomation(automation.id)
    },[deleteAutomation])

    if (!routeReady) return <p>Загрузка сценария…</p>;

    if (loadError) {
        return <p>Не удалось загрузить сценарий. Проверьте подключение и повторите попытку.</p>;
    }

    if (!automation) return <p>Загрузка сценария…</p>;

    return(
        <AutomationEditor
            key={`${mode}:${editingId ?? automation.id}`}
            automation={automation}
            onChange={setAutomation}
            onDelete={mode === "edit" ?()=>deleteAutomationHandler(automation): undefined}
            mode={mode}
            dirty={isDirty}
            saving={saving}
            creating={creating}
            onSave={save}
            onCreateNew={createNew}
        />
    )
}