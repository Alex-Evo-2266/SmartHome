// AutocompleteField.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import "./AutocompleteField.scss";
import { TextField } from "alex-evo-sh-ui-kit";

interface IAutocompleteFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  options: string[] | ((input: string) => string[] | Promise<string[]>);
  onSelect?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  errorText?: string;
  className?: string;
  minChars?: number;
  debounceDelay?: number;
  maxSuggestions?: number;
  highlightMatch?: boolean;
}

export const AutocompleteField: React.FC<IAutocompleteFieldProps> = ({
  value,
  onChange,
  placeholder = "Введите значение...",
  label,
  options,
  onSelect,
  disabled = false,
  error = false,
  helperText,
  errorText,
  className = "",
  minChars = 1,
  debounceDelay = 300,
  maxSuggestions = 10,
  highlightMatch = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<null | number>(null);
  const isNavigatingRef = useRef(false);

  // Функция для получения подсказок
  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.length < minChars) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      let results: string[];
      if (typeof options === 'function') {
        const result = options(input);
        results = result instanceof Promise ? await result : result;
      } else {
        results = options.filter(opt => 
          opt.toLowerCase().includes(input.toLowerCase())
        );
      }
      
      // Ограничиваем количество подсказок
      results = results.slice(0, maxSuggestions);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setActiveIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }, [options, minChars, maxSuggestions]);

  // Debounced поиск
  const debouncedFetch = useCallback((input: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(input);
    }, debounceDelay);
  }, [fetchSuggestions, debounceDelay]);

  // Обработчик изменения значения
  const handleChange = useCallback((newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    
    if (!isNavigatingRef.current) {
      debouncedFetch(newValue);
    }
  }, [onChange, debouncedFetch]);

  // Обработчик выбора подсказки
  const handleSelect = useCallback((suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(suggestion);
    inputRef.current?.focus();
  }, [onChange, onSelect]);

  // Обработчики клавиатуры
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        isNavigatingRef.current = true;
        setActiveIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        isNavigatingRef.current = true;
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : -1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
        }
        isNavigatingRef.current = false;
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        isNavigatingRef.current = false;
        break;
      
      default:
        isNavigatingRef.current = false;
    }
  }, [isOpen, suggestions, activeIndex, handleSelect]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Подсветка совпадений
  const highlightText = useCallback((text: string, query: string) => {
    if (!highlightMatch || !query) return text;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <span className="autocomplete__suggestion-highlight">
          {text.slice(index, index + query.length)}
        </span>
        {text.slice(index + query.length)}
      </>
    );
  }, [highlightMatch]);

  return (
    <div 
      ref={containerRef} 
      className={`autocomplete ${className}`}
    >
      <TextField
        ref={inputRef}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue.length >= minChars) {
            fetchSuggestions(inputValue);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        errorText={errorText}
        border
        type="text"
      />
      
      {isOpen && (
        <div className="autocomplete__dropdown">
          {loading ? (
            <div className="autocomplete__loading">Загрузка...</div>
          ) : (
            <ul className="autocomplete__list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={`autocomplete__item ${
                    index === activeIndex ? 'autocomplete__item_active' : ''
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                  onClick={() => handleSelect(suggestion)}
                >
                  {highlightText(suggestion, inputValue)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};