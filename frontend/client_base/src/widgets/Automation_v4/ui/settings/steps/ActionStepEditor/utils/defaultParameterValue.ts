import type {
  DeviceCommandParameter,
  ExpressionArg,
  LiteralDataType,
} from "@src/entites/automation_v4";

export function defaultParameterValue(
  parameter: DeviceCommandParameter,
): ExpressionArg {
  switch (parameter.data_type) {
    case "number":
      return {
        type: "literal",
        value: 0,
        data_type: "number",
      };

    case "boolean":
      return {
        type: "literal",
        value: false,
        data_type: "boolean",
      };

    case "path":
      return {
        type: "path",
        path: "device",
      };

    default: {
      const dataType: LiteralDataType =
        parameter.data_type === "any" || parameter.data_type === "for_path"
          ? "string"
          : parameter.data_type;

      return {
        type: "literal",
        value: "",
        data_type: dataType,
      };
    }
  }
}