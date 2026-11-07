import { useAutomationAPI } from "@src/entites/automation_v4";
import type {
  DeviceCommand,
} from "@src/entites/automation_v4";
import { useEffect, useState } from "react";

export function useActionCommands() {
  const {
    getActionCommands,
    getExpressionCapabilities,
  } = useAutomationAPI();

  const [commands, setCommands] = useState<DeviceCommand[]>([]);
  const [capabilities, setCapabilities] = useState<
    Awaited<ReturnType<typeof getExpressionCapabilities>> | null
  >(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [availableCommands, availableCapabilities] =
          await Promise.all([
            getActionCommands(),
            getExpressionCapabilities(),
          ]);

        if (!active) return;

        setCommands(availableCommands ?? []);
        setCapabilities(availableCapabilities ?? null);
      } catch (error) {
        if (!active) return;

        setError(error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [getActionCommands, getExpressionCapabilities]);

  return {
    commands,
    capabilities,
    loading,
    error,
  };
}