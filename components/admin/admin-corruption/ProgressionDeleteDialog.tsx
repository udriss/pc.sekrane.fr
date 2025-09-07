// /components/admin/admin-corruption/ProgressionDeleteDialog.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProgressionDeleteDialogProps {
  progressionState: any;
  showSnackbar: (message: React.ReactNode, severity?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ProgressionDeleteDialog: React.FC<ProgressionDeleteDialogProps> = ({
  progressionState,
  showSnackbar
}) => {
  const {
    isDeleteAllModalOpen,
    setIsDeleteAllModalOpen,
    progressionsToDelete,
    setProgressionsToDelete,
    isDeletingAll,
    setIsDeletingAll,
    selectedClasseForProgression,
    selectedDate,
    setProgressions
  } = progressionState;

  // Load progressions function
  const loadProgressions = async (classeId: string) => {
    try {
      const response = await fetch(`/api/progressions?classeId=${classeId}`);
      if (response.ok) {
        const data = await response.json();
        setProgressions(data.progressions);
      }
    } catch (error) {
      console.error('Error loading progressions:', error);
    }
  };

  return (
    <Dialog modal={false} open={isDeleteAllModalOpen} onOpenChange={setIsDeleteAllModalOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression en masse</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de supprimer {progressionsToDelete.length} progression(s) pour le {selectedDate && format(selectedDate, 'dd MMMM yyyy', { locale: fr })}.
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Liste des progressions à supprimer */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Progressions à supprimer :</h4>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
              {progressionsToDelete.map((progression: any) => (
                <div key={progression.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{progression.title}</span>
                    <span className="text-xs text-gray-500">
                      ({format(new Date(progression.date), 'dd/MM/yyyy', { locale: fr })})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{progression.contentType}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Liste des fichiers à supprimer */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Fichiers qui seront supprimés :</h4>
            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
              {(() => {
                const filesToDelete = progressionsToDelete
                  .filter((p: any) => p.resourceUrl && (p.contentType === 'image' || p.contentType === 'pdf'))
                  .map((p: any) => ({
                    url: p.resourceUrl,
                    type: p.contentType,
                    title: p.title
                  }));

                if (filesToDelete.length === 0) {
                  return <p className="text-sm text-gray-500 italic">Aucun fichier à supprimer</p>;
                }

                return (
                  <div className="space-y-1">
                    {filesToDelete.map((file: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{file.title}</span>
                          <span className="text-xs text-gray-500 uppercase">({file.type})</span>
                        </div>
                        <span className="text-xs text-red-600">sera supprimé</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Avertissement */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Attention :</strong> Cette action supprimera définitivement toutes les progressions sélectionnées
              et leurs fichiers associés. Cette action ne peut pas être annulée.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="destructive"
              onClick={async () => {
                setIsDeletingAll(true);
                try {
                  // Supprimer chaque progression
                  const deletePromises = progressionsToDelete.map(async (progression: any) => {
                    const response = await fetch(`/api/progressions/${progression.id}`, {
                      method: 'DELETE'
                    });
                    if (!response.ok) {
                      throw new Error(`Erreur lors de la suppression de ${progression.title}`);
                    }
                    return progression;
                  });

                  await Promise.all(deletePromises);

                  // Recharger les progressions
                  loadProgressions(selectedClasseForProgression);

                  // Fermer le modal et afficher le succès
                  setIsDeleteAllModalOpen(false);
                  setProgressionsToDelete([]);
                  showSnackbar(`${progressionsToDelete.length} progression(s) supprimée(s) avec succès`, 'success');
                } catch (error) {
                  console.error('Error deleting progressions:', error);
                  showSnackbar('Erreur lors de la suppression des progressions', 'error');
                } finally {
                  setIsDeletingAll(false);
                }
              }}
              disabled={isDeletingAll}
              className="flex-1"
            >
              {isDeletingAll ? 'Suppression en cours...' : `Supprimer ${progressionsToDelete.length} progression(s)`}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteAllModalOpen(false);
                setProgressionsToDelete([]);
              }}
              disabled={isDeletingAll}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
