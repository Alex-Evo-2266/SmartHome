// ExampleUsage.tsx
import React, { useState, useMemo } from 'react';
import { AutocompleteField } from './AutocompleteField';

// Интерфейс для объекта с данными
interface IBindingContext {
    [key: string]: any
  device: {
    id: string;
    name: string;
    type: string;
    properties: {
      temperature: number;
      humidity: number;
      status: string;
    };
    metadata: {
      location: string;
      floor: number;
    };
  };
  user: {
    name: string;
    role: string;
  };
  environment: {
    mode: string;
    settings: {
      auto: boolean;
      threshold: number;
    };
  };
}

// Компонент для работы с binding
const BindingEditor: React.FC = () => {
  const [binding, setBinding] = useState('');
  const [expression, setExpression] = useState('');

  // Функция для получения подсказок на основе контекста
  const getBindingSuggestions = useMemo(() => {
    // Создаем плоский объект со всеми путями
    const flattenObject = (obj: any, prefix = ''): string[] => {
      const result: string[] = [];
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const path = prefix ? `${prefix}.${key}` : key;
          result.push(path);
          
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            result.push(...flattenObject(obj[key], path));
          }
        }
      }
      
      return result;
    };

    // Контекст для примера
    const context: IBindingContext = {
      device: {
        id: 'dev-001',
        name: 'Sensor 1',
        type: 'temperature',
        properties: {
          temperature: 25.5,
          humidity: 60,
          status: 'active',
        },
        metadata: {
          location: 'Room 101',
          floor: 1,
        },
      },
      user: {
        name: 'John Doe',
        role: 'admin',
      },
      environment: {
        mode: 'auto',
        settings: {
          auto: true,
          threshold: 30,
        },
      },
    };

    const paths = flattenObject(context);
    
    // Функция для фильтрации и поиска
    return (input: string) => {
      if (!input) return [];
      
      const lowerInput = input.toLowerCase();
      const suggestions = paths.filter(path => 
        path.toLowerCase().includes(lowerInput)
      );
      
      // Добавляем подсказки с контекстом
      return suggestions.map(path => {
        const value = path.split('.').reduce((obj, key) => obj?.[key], context);
        const type = typeof value;
        return `${path} (${type})`;
      });
    };
  }, []);

  // Функция для выражения с поддержкой вложенных объектов
  const getExpressionSuggestions = useMemo(() => {
    const expressionContext: {
        [key: string]: any
    } = {
      device: {
        properties: {
          temperature: 25.5,
          humidity: 60,
        },
        metadata: {
          location: 'Room 101',
        },
      },
      user: {
        name: 'John',
        role: 'admin',
      },
    };

    const flattenObject = (obj: any, prefix = ''): string[] => {
      const result: string[] = [];
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const path = prefix ? `${prefix}.${key}` : key;
          result.push(path);
          
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            result.push(...flattenObject(obj[key], path));
          }
        }
      }
      
      return result;
    };

    const paths = flattenObject(expressionContext);
    
    return (input: string) => {
      if (!input) return [];
      
      const lowerInput = input.toLowerCase();
      
      // Ищем совпадения и добавляем контекст
      return paths
        .filter(path => path.toLowerCase().includes(lowerInput))
        .map(path => {
          const value = path.split('.').reduce((obj, key) => obj?.[key], expressionContext);
          const displayValue = typeof value === 'object' 
            ? JSON.stringify(value) 
            : String(value);
          return `${path} = ${displayValue}`;
        });
    };
  }, []);

  return (
    <div className="binding-editor">
      <h3>Binding Editor</h3>
      
      <div className="field-group">
        <label>Binding Path:</label>
        <AutocompleteField
          value={binding}
          onChange={setBinding}
          placeholder="Введите путь для binding..."
          options={getBindingSuggestions}
          helperText="Введите путь к свойству (например: device.properties.temperature)"
          className="binding-editor__field"
        />
      </div>

      <div className="field-group">
        <label>Expression:</label>
        <AutocompleteField
          value={expression}
          onChange={setExpression}
          placeholder="Введите выражение..."
          options={getExpressionSuggestions}
          helperText="Введите выражение с автодополнением"
          className="binding-editor__field"
        />
      </div>

      <div className="preview">
        <h4>Результат:</h4>
        <pre>
          {binding && `Binding: ${binding}`}
          {expression && `\nExpression: ${expression}`}
        </pre>
      </div>
    </div>
  );
};

export default BindingEditor;