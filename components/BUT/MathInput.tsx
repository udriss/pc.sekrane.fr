import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import { Numbers } from '@mui/icons-material';
import { create, all } from 'mathjs';

// Create custom mathjs instance with configuration
const math = create(all);
const mathConfig: any = {
  number: 'number',
  precision: 64,
  triggerFunctions: {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan
  }
};
math.config(mathConfig);

// Convert degrees to radians manually in evaluation
const toRadians = (degrees: number) => degrees * (Math.PI / 180);

interface MathInputProps {
  value: string;
  onChange: (value: string, evaluatedValue: number) => void;
}

export const MathInput: React.FC<MathInputProps> = ({ value, onChange }) => {
  const [localError, setLocalError] = useState<string | null>(null);

  const evaluateExpression = (expr: string): number | null => {
    if (!expr.trim()) return 0;
    
    try {
      // Handle scientific notation and powers
      if (/^-?\d*\.?\d*e[+-]?\d+$/i.test(expr) || /^10\^-?\d+$/.test(expr)) {
        return Number(expr.includes('^') 
          ? Math.pow(10, parseInt(expr.split('^')[1])) 
          : expr);
      }

      // Handle trigonometric functions with degree conversion
      const trigPattern = /(sin|cos|tan)\(([^)]+)\)/g;
      const withRadians = expr.replace(trigPattern, (_, func, angle) => {
        try {
          const angleValue = math.evaluate(angle);
          return `${func}(${toRadians(angleValue)})`;
        } catch {
          return `${func}(${angle})`;
        }
      });

      // Evaluate expression
      if (/^[a-zA-Z0-9+\-*/.()^ ]*$/.test(withRadians)) {
        const result = math.evaluate(withRadians);
        return typeof result === 'number' ? result : null;
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const evaluated = evaluateExpression(newValue);
    
    if (newValue && evaluated === null && /^[a-zA-Z0-9+\-*/.()^ ]*$/.test(newValue)) {
      setLocalError(null);
    } else if (evaluated === null) {
      setLocalError('Expression invalide');
    } else {
      setLocalError(null);
    }

    onChange(newValue, evaluated ?? 0);
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      error={!!localError}
      helperText={localError}
      placeholder="ex: 10^-3, 1.23e-3, 3*sin(30)/sin(50)"
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Numbers />
            </InputAdornment>
          ),
        }
      }}
    />
  );
};