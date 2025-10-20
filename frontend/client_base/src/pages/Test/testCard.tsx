// import "./DeviceCard.css";
import {DeviceSchema, DeviceSerializeFieldSchema} from '../../entites/devices/models/device'

const statusColors = {
  online: "green",
  offline: "red",
  not_supported: "gray",
  unlink: "yellow",
  unknown: "darkgray",
};

export default function DeviceCard({ device }:{device:DeviceSchema}) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="device-name">{device.name}</h3>
          <p className="device-system-name">{device.system_name}</p>
        </div>
        <span className="status-badge" style={{ backgroundColor: statusColors[device.status] }}>
          {device.status.toUpperCase()}
        </span>
      </div>
      <div className="card-content">
        {device.fields?.map((field) => (
          <div key={field.id} className="field-row">
            <span className="field-name">{field.name}</span>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
}

function renderField(field:DeviceSerializeFieldSchema) {
  if (field.read_only) {
    return <span className="field-value">{field.value ?? "-"}</span>;
  }
  switch (field.type) {
    case "binary":
      return <input type="checkbox" defaultChecked={field.value === "1"} />;
    case "number":
      return <input type="number" defaultValue={field.value ?? ""} className="input-field" />;
    case "text":
      return <input type="text" defaultValue={field.value ?? ""} className="input-field" />;
    case "enum":
      return (
        <select className="input-field">
          {field.enum_values?.split(",").map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    default:
      return <span className="field-value">{field.value ?? "-"}</span>;
  }
}
