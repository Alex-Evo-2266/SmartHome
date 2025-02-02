
import React, { useState } from 'react';


// Стили для поля
const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        maxWidth: '400px',
        backgroundColor: '#f9f9f9',
      },
      title: {
        marginBottom: '12px',
        fontSize: '20px',
        fontWeight: 'bold',
      },
      detail: {
        marginBottom: '8px',
        fontSize: '16px',
      },
      fields: {
        marginTop: '16px',
        fontSize: '14px',
      },
  field: {
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  input: {
    fontSize: '16px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginTop: '4px',
  },
  unit: {
    fontSize: '14px',
    color: '#888',
    marginTop: '4px',
  },
};

// Тип для поля устройства
interface DeviceField {
  id: string;
  name: string;
  value: number;
  unit?: string;
}

// Компонент для поля типа number
const DeviceNumberField: React.FC<{ field: DeviceField; onChange: (id: string, value: number) => void }> = ({ field, onChange }) => {
  const [value, setValue] = useState(field.value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setValue(newValue);
    onChange(field.id, newValue); // Отправляем обновленное значение родителю
  };

  return (
    <div style={styles.field}>
      <label style={styles.label}>{field.name}</label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        style={styles.input}
      />
      {field.unit && <span style={styles.unit}>{field.unit}</span>}
    </div>
  );
};


// Пример использования компонента поля
const DeviceCard: React.FC<{ fields: DeviceField[]; onFieldChange: (id: string, value: number) => void }> = ({ fields, onFieldChange }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Device Information</h3>
      {fields.map((field) => (
        <DeviceNumberField key={field.id} field={field} onChange={onFieldChange} />
      ))}
    </div>
  );
};

// Пример использования компонента DeviceCard
const Example = () => {
  const [fields, setFields] = useState<DeviceField[]>([
    { id: '1', name: 'Temperature', value: 22, unit: '°C' },
    { id: '2', name: 'Humidity', value: 55, unit: '%' },
  ]);

  const handleFieldChange = (id: string, value: number) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, value } : field))
    );
  };

  return <DeviceCard fields={fields} onFieldChange={handleFieldChange} />;
};

export default Example;