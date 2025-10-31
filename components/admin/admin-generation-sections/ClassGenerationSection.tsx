// /components/admin/admin-generation-sections/ClassGenerationSection.tsx

import { useState } from 'react';
import { Button, Box, TextField } from '@mui/material';
import React from 'react';
import { Classe } from '@/lib/data';
import { SuccessMessage, ErrorMessage, WarningMessage } from '@/components/message-display';

interface ClassGenerationSectionProps {
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (message: React.ReactNode, severity?: "success" | "error" | "info" | "warning") => void;
}

export function ClassGenerationSection({ classes, setClasses, showSnackbar }: ClassGenerationSectionProps) {
  const [newClasse, setNewClasse] = useState<string>('');
  const [errorAddClasse, setErrorAddClasse] = useState<string>('');
  const [successMessageAddClasse, setSuccessMessageAddClasse] = useState<string>('');
  const [warningAddClasse, setWarningAddClasse] = useState<string>('');

  const handleAddClasse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClasse) {
      setErrorAddClasse('Entrez le nom de la nouvelle classe !');
      setWarningAddClasse('');
      setSuccessMessageAddClasse('');
      return;
    }

    const res = await fetch('/api/addclasse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newClasse,
      }),
    });

    const data = await res.json();
    if (res.status === 200) {
      setClasses(data.classes);
      setNewClasse('');
      setErrorAddClasse('');
      setWarningAddClasse('');
      setSuccessMessageAddClasse(`Classe "${newClasse}" ajoutée avec succès.`);
    } else if (res.status === 400) {
      setErrorAddClasse('');
      setWarningAddClasse(data.warning);
      setSuccessMessageAddClasse('');
    } else {
      setErrorAddClasse('Échec de l\'ajout de la classe.');
      setWarningAddClasse('');
      setSuccessMessageAddClasse('');
    }
  };

  return (
    <Box component="form" onSubmit={handleAddClasse} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
      <TextField
        fullWidth
        label="Nom de la classe"
        value={newClasse}
        onChange={(e) => setNewClasse(e.target.value)}
        placeholder="Entrez le nom de la classe"
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: 'small',
              textTransform: 'uppercase',
            },
          },
          input: {
            sx: {
              '&::placeholder': {
                fontSize: 'small',
                textTransform: 'uppercase',
              },
            },
          },
        }}
      />

      {warningAddClasse && <WarningMessage message={warningAddClasse} />}
      {errorAddClasse && <ErrorMessage message={errorAddClasse} />}
      {successMessageAddClasse && <SuccessMessage message={successMessageAddClasse} />}

      <Button type="submit" variant="outlined" fullWidth sx={{ fontWeight: 700 }}>
        Ajouter la classe
      </Button>
    </Box>
  );
}
