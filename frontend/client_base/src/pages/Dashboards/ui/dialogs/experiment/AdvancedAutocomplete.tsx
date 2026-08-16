// AdvancedAutocomplete.tsx - расширенная версия
import { useState } from 'react';
import { AutocompleteField } from './AutocompleteField';

interface IAdvancedAutocompleteProps {
  // Поддержка вложенных объектов любой глубины
  data: Record<string, any>;
  onSelect: (path: string, value: any) => void;
}

export const AdvancedAutocomplete: React.FC<IAdvancedAutocompleteProps> = ({
  data,
  onSelect,
}) => {
  const [selectedPath, setSelectedPath] = useState('');

  // Функция для получения всех путей с типами
  const getAllPaths = (obj: any, prefix = ''): Array<{path: string, type: string, value: any}> => {
    const result: Array<{path: string, type: string, value: any}> = [];
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const path = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        const type = Array.isArray(value) ? 'array' : typeof value;
        
        result.push({ path, type, value });
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result.push(...getAllPaths(value, path));
        }
      }
    }
    
    return result;
  };

  const allPaths = getAllPaths(data);

  const getSuggestions = (input: string) => {
    if (!input) return allPaths.map(p => `${p.path} (${p.type})`);
    
    return allPaths
      .filter(p => p.path.toLowerCase().includes(input.toLowerCase()))
      .map(p => `${p.path} (${p.type})`)
      .slice(0, 20);
  };

  return (
    <div>
      <AutocompleteField
        value={selectedPath}
        onChange={setSelectedPath}
        placeholder="Поиск по всем свойствам..."
        options={getSuggestions}
        onSelect={(value) => {
          const cleanPath = value.replace(/\s*\(.*\)\s*$/, '');
          const selected = allPaths.find(p => p.path === cleanPath);
          if (selected) {
            onSelect(selected.path, selected.value);
          }
        }}
        highlightMatch={true}
        maxSuggestions={20}
      />
    </div>
  );
};