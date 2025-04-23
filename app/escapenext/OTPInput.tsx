import React, { useRef, useState } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  styled
} from '@mui/material';

interface OTPProps {
  separator?: React.ReactNode;
  length: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

// Composant stylisé pour les champs OTP
const OTPInput = styled(TextField)(({ theme }) => ({
  width: '3rem',
  '& .MuiOutlinedInput-root': {
    height: '3rem',
    width: '3rem',
    fontSize: '1.5rem',
    textAlign: 'center',
    padding: 0,
    '& input': {
      textAlign: 'center',
    }
  }
}));

const OTPSeparator = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1rem',
});

export const OTP: React.FC<OTPProps> = ({
  separator = <span>-</span>,
  length,
  value,
  onChange,
  disabled = false
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(length).fill(null));

  const focusInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) {
      targetInput.focus();
    }
  };

  const selectInput = (targetIndex: number) => {
    const targetInput = inputRefs.current[targetIndex];
    if (targetInput) {
      targetInput.select();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case ' ':
        event.preventDefault();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < length - 1) {
          focusInput(currentIndex + 1);
          selectInput(currentIndex + 1);
        }
        break;
      case 'Delete':
        event.preventDefault();
        const newValueDelete = value.slice(0, currentIndex) + value.slice(currentIndex + 1);
        onChange(newValueDelete);
        break;
      case 'Backspace':
        event.preventDefault();
        if (value[currentIndex]) {
          // Si le champ actuel contient une valeur, le vider
          const newValueBackspace = value.slice(0, currentIndex) + value.slice(currentIndex + 1);
          onChange(newValueBackspace);
        } else if (currentIndex > 0) {
          // Sinon, revenir au champ précédent
          focusInput(currentIndex - 1);
          selectInput(currentIndex - 1);
          
          // Et vider ce champ précédent
          const newValueBackspace = value.slice(0, currentIndex - 1) + value.slice(currentIndex);
          onChange(newValueBackspace);
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    const currentValue = event.target.value;
    // Ne prendre que le dernier caractère tapé
    const lastValue = currentValue.slice(-1);
    
    if (lastValue) {
      const newValue = value.slice(0, currentIndex) + lastValue + value.slice(currentIndex + 1);
      onChange(newValue);
      
      // Si on a ajouté un caractère et qu'on n'est pas au dernier input, passer au suivant
      if (currentIndex < length - 1) {
        focusInput(currentIndex + 1);
      }
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    selectInput(currentIndex);
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    currentIndex: number,
  ) => {
    event.preventDefault();
    const clipboardData = event.clipboardData;

    // Vérifier s'il y a du texte dans le presse-papiers
    if (clipboardData.types.includes('text/plain')) {
      let pastedText = clipboardData.getData('text/plain');
      pastedText = pastedText.substring(0, length - currentIndex).trim();
      
      if (pastedText) {
        // Construire la nouvelle valeur
        let newValue = value.slice(0, currentIndex);
        for (let i = 0; i < pastedText.length && currentIndex + i < length; i++) {
          newValue += pastedText[i];
        }
        newValue += value.slice(currentIndex + pastedText.length);
        
        // Mettre à jour la valeur
        onChange(newValue);
        
        // Déplacer le focus après les caractères collés
        const nextIndex = Math.min(currentIndex + pastedText.length, length - 1);
        focusInput(nextIndex);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
      {Array(length).fill(null).map((_, index) => (
        <React.Fragment key={index}>
          <OTPInput
            inputRef={(el) => (inputRefs.current[index] = el)}
            onKeyDown={(event) => handleKeyDown(event as React.KeyboardEvent<HTMLInputElement>, index)}
            onChange={(event) => handleChange(event as React.ChangeEvent<HTMLInputElement>, index)}
            onClick={(event) => handleClick(event as React.MouseEvent<HTMLInputElement>, index)}
            onPaste={(event) => handlePaste(event as React.ClipboardEvent<HTMLInputElement>, index)}
            value={value[index] || ''}
            disabled={disabled}
            variant="outlined"
            inputProps={{
              maxLength: 1,
              style: { textAlign: 'center' },
              'aria-label': `Digit ${index + 1} of OTP`
            }}
          />
          {index < length - 1 && <OTPSeparator>{separator}</OTPSeparator>}
        </React.Fragment>
      ))}
    </Box>
  );
};

// Composant d'exemple pour la démonstration du OTP
const OTPExample: React.FC = () => {
  const [otp, setOtp] = useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <OTP separator={<span>-</span>} value={otp} onChange={setOtp} length={5} />
      <Typography>Valeur saisie : {otp}</Typography>
    </Box>
  );
}

export default OTPExample;