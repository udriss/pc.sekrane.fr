"use client";

// /components/admin/admin-corruption/ProgressionModificationCard.tsx

import React, { useState, useEffect } from "react";
import { SuccessMessage, ErrorMessage } from "@/components/message-display";
import { Course, Classe } from "@/lib/dataTemplate";
import { SortableProgression } from "@/components/admin/SortableProgression";
import { getApiFileUrl } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Switch from "@mui/material/Switch";
import {
  Box,
  Typography,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  LinearProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";
import { Calendar } from "@/components/ui/calendar";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { IconPicker } from "@/components/ui/icon-picker";
import { ColorPicker } from "@/components/ui/color-picker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Description,
  PictureAsPdf,
  VideoLibrary,
  PhotoCamera,
} from "@mui/icons-material";
import LinkIcon from "@mui/icons-material/Link";
import { SmartFileUploader } from "@/components/ui/smart-file-uploader";
import { ImagePreview } from "@/components/ui/image-preview";
import { PDFViewer } from "@/components/ui/pdf-viewer";
import { ProgressionContent } from "./types";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface Progression {
  id: string;
  date: string;
  title: string;
  content: string;
  icon?: string;
  iconColor?: string;
  contentType: string;
  resourceUrl?: string;
  imageSize?: number;
  activityId?: string;
}

interface ProgressionModificationCardProps {
  courses: Course[];
  classes: Classe[];
  setCourses: (courses: Course[]) => void;
  setClasses: (classes: Classe[]) => void;
  showSnackbar: (
    message: React.ReactNode,
    severity?: "success" | "error" | "info" | "warning"
  ) => void;
  progressionState: {
    selectedClasseForProgression: string;
    setSelectedClasseForProgression: React.Dispatch<
      React.SetStateAction<string>
    >;
    selectedDate: Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    showAllProgressions: boolean;
    setShowAllProgressions: React.Dispatch<React.SetStateAction<boolean>>;
    progressionContent: ProgressionContent;
    setProgressionContent: React.Dispatch<
      React.SetStateAction<ProgressionContent>
    >;
    selectedCourseForProgression: string;
    setSelectedCourseForProgression: React.Dispatch<
      React.SetStateAction<string>
    >;
    selectedActivityForProgression: string;
    setSelectedActivityForProgression: React.Dispatch<
      React.SetStateAction<string>
    >;
    contentPreset: string;
    setContentPreset: React.Dispatch<React.SetStateAction<string>>;
    progressions: Progression[];
    setProgressions: React.Dispatch<React.SetStateAction<Progression[]>>;
    successMessageProgression: string;
    setSuccessMessageProgression: React.Dispatch<React.SetStateAction<string>>;
    errorProgression: string;
    setErrorProgression: React.Dispatch<React.SetStateAction<string>>;
    setIsDeleteAllModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setProgressionsToDelete: React.Dispatch<
      React.SetStateAction<Progression[]>
    >;
    setEditingProgression: React.Dispatch<
      React.SetStateAction<Progression | null>
    >;
    setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditProgressionContent: React.Dispatch<
      React.SetStateAction<ProgressionContent>
    >;
    setEditContentPreset: (value: string) => void;
    setEditSelectedCourseForProgression: React.Dispatch<
      React.SetStateAction<string>
    >;
    setEditSelectedActivityForProgression: React.Dispatch<
      React.SetStateAction<string>
    >;
    setEditPresetCache: React.Dispatch<
      React.SetStateAction<Record<string, any>>
    >;
    selectedFile: File | null;
    setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
    filePreview: string | null;
    setFilePreview: React.Dispatch<React.SetStateAction<string | null>>;
    uploadingFile: boolean;
    setUploadingFile: React.Dispatch<React.SetStateAction<boolean>>;
    uploadProgress: number;
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
    rejectedFile: File | null;
    setRejectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  };
}

export const ProgressionModificationCard: React.FC<
  ProgressionModificationCardProps
> = ({ courses, classes, setCourses, setClasses, showSnackbar, progressionState }) => {
  const {
    selectedClasseForProgression,
    setSelectedClasseForProgression,
    selectedDate,
    setSelectedDate,
    showAllProgressions,
    setShowAllProgressions,
    progressionContent,
    setProgressionContent,
    selectedCourseForProgression,
    setSelectedCourseForProgression,
    selectedActivityForProgression,
    setSelectedActivityForProgression,
    contentPreset,
    setContentPreset,
    progressions,
    setProgressions,
    successMessageProgression,
    setSuccessMessageProgression,
    errorProgression,
    setErrorProgression,
    setIsDeleteAllModalOpen,
    setProgressionsToDelete,
    setEditingProgression,
    setIsEditDialogOpen,
    setEditProgressionContent,
    setEditContentPreset,
    setEditSelectedCourseForProgression,
    setEditSelectedActivityForProgression,
    setEditPresetCache,
    selectedFile,
    setSelectedFile,
    filePreview,
    setFilePreview,
    uploadingFile,
    setUploadingFile,
    rejectedFile,
    setRejectedFile,
    uploadProgress,
    setUploadProgress,
  } = progressionState;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'move' | 'copy'>('move');
  const [selectedProgressions, setSelectedProgressions] = useState<Progression[]>([]);
  const [selectedProgressionIds, setSelectedProgressionIds] = useState<string[]>([]);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [existingProgressionsForDate, setExistingProgressionsForDate] = useState<Progression[]>([]);

  // Mettre à jour les progressions existantes quand la date cible change
  useEffect(() => {
    if (targetDate) {
      const filtered = progressions.filter((p) => {
        const progressionDate = new Date(p.date);
        const targetDateOnly = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          targetDate.getDate()
        );
        const progressionDateOnly = new Date(
          progressionDate.getFullYear(),
          progressionDate.getMonth(),
          progressionDate.getDate()
        );
        return (
          targetDateOnly.getTime() === progressionDateOnly.getTime()
        );
      });
      setExistingProgressionsForDate(filtered);
    } else {
      setExistingProgressionsForDate([]);
    }
  }, [targetDate, progressions]);

  const naturalSort = (a: string, b: string) => {
    const regex = /(\d+|\D+)/g;
    const aParts = a.match(regex) || [];
    const bParts = b.match(regex) || [];
    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const aPart = aParts[i];
      const bPart = bParts[i];
      if (aPart !== bPart) {
        const aNum = parseInt(aPart, 10);
        const bNum = parseInt(bPart, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return aPart.localeCompare(bPart);
      }
    }
    return aParts.length - bParts.length;
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fonctions pour la gestion des progressions
  const loadProgressions = async (classeId: string) => {
    try {
      const response = await fetch(`/api/progressions?classeId=${classeId}`);
      if (response.ok) {
        const data = await response.json();
        setProgressions(data.progressions);
      }
    } catch (error) {
      console.error("Error loading progressions:", error);
    }
  };

  const getDatesWithProgression = () => {
    return progressions.map((p) => new Date(p.date));
  };

  const handleSaveProgression = async () => {
    if (
      !selectedClasseForProgression ||
      !selectedDate ||
      !progressionContent.title
    ) {
      setErrorProgression("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch("/api/progressions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classeId: selectedClasseForProgression,
          date: selectedDate.toISOString(),
          ...progressionContent,
          ...(contentPreset === "existing-activity" &&
          selectedActivityForProgression !== "none"
            ? { activityId: selectedActivityForProgression }
            : {}),
          ...(contentPreset === "file-drop" &&
          selectedActivityForProgression !== "none"
            ? { activityId: selectedActivityForProgression }
            : {}),
        }),
      });

      if (response.ok) {
        setSuccessMessageProgression("Progression ajoutée avec succès");
        setErrorProgression("");
        // Recharger les progressions
        loadProgressions(selectedClasseForProgression);
        // Réinitialiser le formulaire
        const newContentType = contentPreset === "existing-activity" || contentPreset === "file-drop" ? "activity" : "text";
        setProgressionContent({
          title: "",
          content: "",
          icon: "none",
          iconColor: "#3f51b5",
          contentType: newContentType,
          resourceUrl: "",
          imageSize: 60,
          linkedActivityId: "",
          linkedCourseId: "",
        });
        setSelectedFile(null);
        setFilePreview(null);
        if (contentPreset === "existing-activity" || contentPreset === "file-drop") {
          setSelectedActivityForProgression("none");
        } else {
          setContentPreset("text");
          setSelectedCourseForProgression("all");
          setSelectedActivityForProgression("none");
        }
      } else {
        setErrorProgression("Erreur lors de l'ajout de la progression");
      }
    } catch (error) {
      setErrorProgression("Erreur serveur");
    }
  };

  // Fonctions pour gérer le drag & drop des progressions
  const handleDragEndProgression = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = progressions.findIndex((p) => p.id === active.id);
      const newIndex = progressions.findIndex((p) => p.id === over?.id);

      const newProgressions = [...progressions];
      const [movedItem] = newProgressions.splice(oldIndex, 1);
      newProgressions.splice(newIndex, 0, movedItem);
      setProgressions(newProgressions);

      // Mise à jour de l'ordre en base de données
      try {
        const response = await fetch("/api/progressions/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            progressions: newProgressions.map((p, index) => ({
              id: p.id,
              order: index,
            })),
          }),
        });

        if (response.ok) {
          showSnackbar("Ordre des progressions mis à jour", "success");
        }
      } catch (error) {
        console.error("Error reordering progressions:", error);
        // Revenir à l'ordre précédent en cas d'erreur
        loadProgressions(selectedClasseForProgression);
      }
    }
  };

  // Fonction pour éditer une progression
  const handleEditProgression = (progression: any) => {
    setEditingProgression(progression);
    // Isoler l'état du dialog
    // Try to preselect the course containing this activity (for linkedCourseId)
    const foundCourse = courses.find((c) =>
      (c.activities || []).some((a) => a && a.id === progression.activityId)
    );
    setEditProgressionContent({
      title: progression.title,
      content: progression.content,
      icon: progression.icon, // Keep null if no icon
      iconColor: progression.iconColor || "#3f51b5",
      contentType: progression.contentType,
      resourceUrl: progression.resourceUrl || "",
      imageSize: progression.imageSize || 60,
      linkedActivityId: progression.activityId || "",
      linkedCourseId: foundCourse?.id || "",
    });
    // If this progression is linked to an activity, switch edit preset accordingly
    if (progression.activityId) {
      // Find the activity to check if it's a file drop
      const foundActivity = courses.flatMap(c => c.activities || []).find(a => a.id === progression.activityId);
      if (foundActivity?.isFileDrop) {
        setEditContentPreset("file-drop");
      } else {
        setEditContentPreset("existing-activity");
      }
      setEditSelectedActivityForProgression(progression.activityId);
      // Try to preselect the course containing this activity
      setEditSelectedCourseForProgression(foundCourse?.id || "all");
    } else {
      setEditContentPreset(progression.contentType);
      setEditSelectedActivityForProgression("none");
      setEditSelectedCourseForProgression("all");
    }
    setIsEditDialogOpen(true);

    // Initialize cache for current progression types
    setEditPresetCache((prev) => ({
      ...prev,
      [progression.contentType as "text" | "video" | "image" | "pdf"]: {
        resourceUrl: progression.resourceUrl || "",
        title: progression.title,
        content: progression.content,
      },
    }));
  };

  // Fonctions de gestion des fichiers
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setRejectedFile(null); // Réinitialiser le fichier rejeté

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleFileReject = (file: File) => {
    setRejectedFile(file);
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleRejectedFileRemove = () => {
    setRejectedFile(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setRejectedFile(null);
    setProgressionContent((prev) => ({ ...prev, resourceUrl: "" }));
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !selectedClasseForProgression) return;

    setUploadingFile(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("classeId", selectedClasseForProgression);
      formData.append("fileType", contentPreset);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/progressions/upload");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percent);
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              setProgressionContent((prev) => ({
                ...prev,
                resourceUrl: data.fileUrl,
              }));
              setSuccessMessageProgression("Fichier uploadé avec succès");
              // Nettoyage
              setSelectedFile(null);
              setFilePreview(null);
              setUploadProgress(0);
              resolve();
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`HTTP ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
    } catch (error) {
      setErrorProgression("Erreur serveur lors de l'upload");
    } finally {
      setUploadingFile(false);
    }
  };

  // Fonction pour déplacer une progression
  const handleMoveProgression = async (progression: Progression, targetDate: Date) => {
    try {
      const response = await fetch(`/api/progressions/${progression.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: targetDate.toISOString(),
        }),
      });

      if (response.ok) {
        setSuccessMessageProgression("Progression déplacée avec succès");
        setErrorProgression("");
        // Recharger les progressions
        loadProgressions(selectedClasseForProgression);
      } else {
        setErrorProgression("Erreur lors du déplacement de la progression");
      }
    } catch (error) {
      setErrorProgression("Erreur serveur");
    }
  };

  // Fonction pour déplacer plusieurs progressions
  const handleMoveMultipleProgressions = async () => {
    const progressionsToMove = selectedProgressions.filter(p => selectedProgressionIds.includes(p.id));
    if (!targetDate || progressionsToMove.length === 0) {
      setErrorProgression("Veuillez sélectionner une date cible et au moins une progression");
      return;
    }

    try {
      const promises = progressionsToMove.map(progression =>
        fetch(`/api/progressions/${progression.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: targetDate.toISOString(),
          }),
        })
      );

      const results = await Promise.all(promises);
      const failedCount = results.filter(r => !r.ok).length;

      if (failedCount === 0) {
        setSuccessMessageProgression(
          progressionsToMove.length === 1
            ? "1 progression déplacée avec succès"
            : `${progressionsToMove.length} progressions déplacées avec succès`
        );
        setErrorProgression("");
        // Recharger les progressions
        loadProgressions(selectedClasseForProgression);
        // Fermer le modal
        setIsDialogOpen(false);
        setSelectedProgressions([]);
        setSelectedProgressionIds([]);
        setTargetDate(undefined);
      } else {
        setErrorProgression(
          failedCount === 1
            ? "1 progression n'a pas pu être déplacée"
            : `${failedCount} progressions n'ont pas pu être déplacées`
        );
      }
    } catch (error) {
      setErrorProgression("Erreur serveur");
    }
  };

  // Fonction pour ouvrir le modal de déplacement
  const openMoveDialog = () => {
    if (selectedDate && !showAllProgressions) {
      const filteredProgressions = progressions.filter((p) => {
        const progressionDate = new Date(p.date);
        const selectedDateOnly = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        const progressionDateOnly = new Date(
          progressionDate.getFullYear(),
          progressionDate.getMonth(),
          progressionDate.getDate()
        );
        return (
          selectedDateOnly.getTime() ===
          progressionDateOnly.getTime()
        );
      });
      setSelectedProgressions(filteredProgressions);
      setSelectedProgressionIds(filteredProgressions.map(p => p.id));
      setDialogMode('move');
      setIsDialogOpen(true);
    }
  };

  // Fonction pour copier une progression
  const handleCopyProgression = async (progression: Progression, targetDate: Date) => {
    try {
      const { id, ...progressionData } = progression; // Omit id for new copy
      const response = await fetch("/api/progressions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...progressionData,
          date: targetDate.toISOString(),
          classeId: selectedClasseForProgression,
        }),
      });

      if (response.ok) {
        setSuccessMessageProgression("Progression copiée avec succès");
        setErrorProgression("");
        // Recharger les progressions
        loadProgressions(selectedClasseForProgression);
      } else {
        setErrorProgression("Erreur lors de la copie de la progression");
      }
    } catch (error) {
      setErrorProgression("Erreur serveur");
    }
  };

  // Fonction pour copier plusieurs progressions
  const handleCopyMultipleProgressions = async () => {
    const progressionsToCopy = selectedProgressions.filter(p => selectedProgressionIds.includes(p.id));
    if (!targetDate || progressionsToCopy.length === 0) {
      setErrorProgression("Veuillez sélectionner une date cible et au moins une progression");
      return;
    }

    try {
      const promises = progressionsToCopy.map(progression => {
        const { id, ...progressionData } = progression;
        return fetch("/api/progressions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...progressionData,
            date: targetDate.toISOString(),
            classeId: selectedClasseForProgression,
          }),
        });
      });

      const results = await Promise.all(promises);
      const failedCount = results.filter(r => !r.ok).length;

      if (failedCount === 0) {
        setSuccessMessageProgression(
          progressionsToCopy.length === 1
            ? "1 progression copiée avec succès"
            : `${progressionsToCopy.length} progressions copiées avec succès`
        );
        setErrorProgression("");
        // Recharger les progressions
        loadProgressions(selectedClasseForProgression);
        // Fermer le modal
        setIsDialogOpen(false);
        setSelectedProgressions([]);
        setSelectedProgressionIds([]);
        setTargetDate(undefined);
      } else {
        setErrorProgression(
          failedCount === 1
            ? "1 progression n'a pas pu être copiée"
            : `${failedCount} progressions n'ont pas pu être copiées`
        );
      }
    } catch (error) {
      setErrorProgression("Erreur serveur");
    }
  };

  // Fonction pour ouvrir le modal de copie
  const openCopyDialog = () => {
    if (selectedDate && !showAllProgressions) {
      const filteredProgressions = progressions.filter((p) => {
        const progressionDate = new Date(p.date);
        const selectedDateOnly = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate()
        );
        const progressionDateOnly = new Date(
          progressionDate.getFullYear(),
          progressionDate.getMonth(),
          progressionDate.getDate()
        );
        return (
          selectedDateOnly.getTime() ===
          progressionDateOnly.getTime()
        );
      });
      setSelectedProgressions(filteredProgressions);
      setSelectedProgressionIds(filteredProgressions.map(p => p.id));
      setDialogMode('copy');
      setIsDialogOpen(true);
    }
  };

  // Fonctions utilitaires pour les boutons
  const getFilteredProgressionsForSelectedDate = () => {
    if (!selectedDate || showAllProgressions) return [];
    return progressions.filter((p) => {
      const progressionDate = new Date(p.date);
      const selectedDateOnly = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      const progressionDateOnly = new Date(
        progressionDate.getFullYear(),
        progressionDate.getMonth(),
        progressionDate.getDate()
      );
      return (
        selectedDateOnly.getTime() === progressionDateOnly.getTime()
      );
    });
  };

  const isMoveOrCopyDisabled = () => {
    if (!selectedDate || showAllProgressions) return true;
    const filteredProgressions = getFilteredProgressionsForSelectedDate();
    return filteredProgressions.length === 0;
  };

  const handleMoveClick = () => {
    const filteredProgressions = getFilteredProgressionsForSelectedDate();
    if (filteredProgressions.length >= 1) {
      openMoveDialog();
    }
  };

  const handleCopyClick = () => {
    const filteredProgressions = getFilteredProgressionsForSelectedDate();
    if (filteredProgressions.length >= 1) {
      openCopyDialog();
    }
  };

  const handleDeleteAllClick = () => {
    const filteredProgressions = getFilteredProgressionsForSelectedDate();
    if (filteredProgressions.length > 0) {
      setProgressionsToDelete(filteredProgressions);
      setIsDeleteAllModalOpen(true);
    }
  };

  const handleToggleShowAll = () => {
    setShowAllProgressions(!showAllProgressions);
  };

  const handleCopyProgressionUrl = async () => {
    if (!selectedClasseForProgression || !selectedDate) {
      showSnackbar("Veuillez sélectionner une classe et une date", "warning");
      return;
    }

    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear().toString();
    const formattedDate = day + month + year;

    const url = `${window.location.origin}/classes/${selectedClasseForProgression}?date=${formattedDate}`;

    try {
      await navigator.clipboard.writeText(url);
      showSnackbar("URL copiée dans le presse-papiers", "success");
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
      showSnackbar("Erreur lors de la copie de l'URL", "error");
    }
  };

  return (
    <Box sx={{ "& > * + *": { mt: 3 }, position: "relative", width: "100%" }}>
      {/* Sélection de la classe */}
      <FormControl fullWidth>
            <InputLabel sx={{ fontSize: "small", textTransform: "uppercase" }}>
              Sélectionner une classe
            </InputLabel>
            <MuiSelect
              value={selectedClasseForProgression}
              onChange={(e) => {
                setSelectedClasseForProgression(e.target.value);
                loadProgressions(e.target.value);
              }}
              label="Sélectionner une classe"
            >
              {classes && Array.isArray(classes)
                ? classes
                    .sort((a, b) => naturalSort(a.name, b.name))
                    .map((classe) => (
                      <MenuItem key={classe.id} value={classe.id}>
                        {classe.name}
                      </MenuItem>
                    ))
                : null}
            </MuiSelect>
          </FormControl>

          {/* Activer/Désactiver la progression pour cette classe */}
          {selectedClasseForProgression && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                position: "relative",
              }}
            >
              <Switch
                checked={
                  classes.find((c) => c.id === selectedClasseForProgression)
                    ?.hasProgression || false
                }
                onChange={async (e) => {
                  console.log("Switch clicked, new value:", e.target.checked);
                  console.log("Selected class:", selectedClasseForProgression);
                  console.log("Current classes:", classes);
                  console.log(
                    "Current class hasProgression:",
                    classes.find((c) => c.id === selectedClasseForProgression)
                      ?.hasProgression
                  );

                  try {
                    const response = await fetch(
                      `/api/classes/${selectedClasseForProgression}/progression`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          hasProgression: e.target.checked,
                        }),
                      }
                    );

                    if (response.ok) {
                      const data = await response.json();
                      console.log("API response data:", data);
                      setClasses(data.classes);

                      // Force refresh des données
                      const fetchRes = await fetch("/api/courses");
                      const freshData = await fetchRes.json();
                      console.log("Fresh data from /api/courses:", freshData);
                      setClasses(freshData.classes);

                      showSnackbar(
                        "Statut de progression mis à jour",
                        "success"
                      );
                    } else {
                      console.error(
                        "API response error:",
                        response.status,
                        response.statusText
                      );
                      showSnackbar("Erreur lors de la mise à jour", "error");
                    }
                  } catch (error) {
                    console.error("Error:", error);
                    showSnackbar("Erreur serveur", "error");
                  }
                }}
              />
              <FormLabel>Activer la progression pour cette classe</FormLabel>
              {/* Icon button for redirect */}
              <Stack
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              >
                <Tooltip title="Page de la classe">
                  <IconButton
                    onClick={() => {
                      if (selectedClasseForProgression) {
                        const url = selectedDate
                          ? (() => {
                              const day = selectedDate.getDate().toString().padStart(2, '0');
                              const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                              const year = selectedDate.getFullYear().toString();
                              const formattedDate = day + month + year;
                              return `/classes/${selectedClasseForProgression}?date=${formattedDate}`;
                            })()
                          : `/classes/${selectedClasseForProgression}`;
                        window.open(url, "_blank");
                      }
                    }}
                    disabled={!selectedClasseForProgression}
                  >
                    <OpenInNewIcon color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Copier l'URL directe vers cette progression">
                  <IconButton
                    onClick={handleCopyProgressionUrl}
                    disabled={!selectedClasseForProgression || !selectedDate}
                    sx={{
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          )}

          {/* Calendrier */}
          {selectedClasseForProgression && (
            <Box sx={{ border: 1, borderRadius: 2, p: 2 }}>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  // Activer automatiquement le filtrage par date si une date est sélectionnée
                  if (date) {
                    setShowAllProgressions(false);
                  }
                }}
                locale={fr}
                className="rounded-md border"
                modifiers={{
                  hasProgression: getDatesWithProgression(),
                  selectedHasProgression: selectedDate
                    ? getDatesWithProgression().filter(
                        (d) => d.toDateString() === selectedDate.toDateString()
                      )
                    : [],
                }}
                modifiersStyles={{
                  hasProgression: {
                    backgroundColor: "#9fcbf8ff",
                    color: "#111827",
                    fontWeight: "bold",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  selectedHasProgression: {
                    border: "2px solid #1e40af",
                    borderRadius: "4px",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              />
            </Box>
          )}

          {/* Formulaire de contenu si une date est sélectionnée */}
          {selectedDate && (
            <Box
              sx={{
                "& > * + *": { mt: 2 },
                borderTop: "1px solid",
                borderColor: "divider",
                pt: 2,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Ajouter du contenu pour le{" "}
                {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
              </Typography>

              {/* Presets de type de contenu */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "repeat(3, auto)",
                  gap: 1,
                  mb: 2,
                }}
              >
                <Button
                  type="button"
                  variant={contentPreset === "text" ? "contained" : "outlined"}
                  size="medium"
                  onClick={() => {
                    setContentPreset("text");
                    setProgressionContent((prev) => ({
                      ...prev,
                      contentType: "text",
                      title: "Note du jour",
                    }));
                    handleFileRemove();
                  }}
                  sx={{ width: "100%" }}
                >
                  <Description className="mr-2 h-4 w-4" />
                  Texte
                </Button>
                <Button
                  type="button"
                  variant={contentPreset === "video" ? "contained" : "outlined"}
                  size="medium"
                  onClick={() => {
                    setContentPreset("video");
                    setProgressionContent((prev) => ({
                      ...prev,
                      contentType: "video",
                      title: "Vidéo du jour",
                    }));
                    handleFileRemove();
                  }}
                  sx={{ width: "100%" }}
                >
                  <VideoLibrary className="mr-2 h-4 w-4" />
                  Vidéo
                </Button>
                <Button
                  type="button"
                  variant={contentPreset === "image" ? "contained" : "outlined"}
                  size="medium"
                  onClick={() => {
                    setContentPreset("image");
                    setProgressionContent((prev) => ({
                      ...prev,
                      contentType: "image",
                      title: "Image du jour",
                      resourceUrl: "",
                    }));
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  sx={{ width: "100%" }}
                >
                  <PhotoCamera className="mr-2 h-4 w-4" />
                  Image
                </Button>
                <Button
                  type="button"
                  variant={contentPreset === "pdf" ? "contained" : "outlined"}
                  size="medium"
                  onClick={() => {
                    setContentPreset("pdf");
                    setProgressionContent((prev) => ({
                      ...prev,
                      contentType: "pdf",
                      title: "Document PDF",
                      resourceUrl: "",
                    }));
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  sx={{ width: "100%" }}
                >
                  <PictureAsPdf className="mr-2 h-4 w-4" />
                  PDF
                </Button>
                <Button
                  type="button"
                  variant={
                    contentPreset === "existing-activity"
                      ? "contained"
                      : "outlined"
                  }
                  size="medium"
                  onClick={() => {
                    setContentPreset("existing-activity" as any);
                    setSelectedActivityForProgression("none");
                    setSelectedCourseForProgression("all");
                    // Clear file/url fields when switching to existing activity
                    setSelectedFile(null);
                    setFilePreview(null);
                    setProgressionContent((prev) => ({
                      ...prev,
                      contentType: "activity",
                      resourceUrl: "",
                    }));
                  }}
                  sx={{ width: "100%" }}
                >
                  Activité existante
                </Button>
                <Button
                  type="button"
                  variant={contentPreset === "file-drop" ? "contained" : "outlined"}
                  size="medium"
                  onClick={() => {
                    setContentPreset("file-drop" as any);
                    setSelectedActivityForProgression("none");
                    setSelectedCourseForProgression("all");
                    // Clear file/url fields when switching to file drop
                    setSelectedFile(null);
                    setFilePreview(null);
                    setProgressionContent((prev) => ({
                      ...prev,
                      contentType: "file-drop",
                      resourceUrl: "",
                    }));
                  }}
                  sx={{ width: "100%" }}
                >
                  Zone de dépôt
                </Button>
                <Button
                  type="button"
                  variant={contentPreset === "url" ? "contained" : "outlined"}
                  size="medium"
                  onClick={() => {
                    setContentPreset("url");
                    setProgressionContent((prev) => ({
                      ...prev,
                      contentType: "url",
                      title: "Lien externe",
                      resourceUrl: "",
                    }));
                    setSelectedFile(null);
                    setFilePreview(null);
                  }}
                  sx={{ width: "100%" }}
                >
                  <LinkIcon className="mr-2 h-4 w-4" /> URL
                </Button>
              </Box>

              {/* Titre */}
              <TextField
                fullWidth
                label="Titre"
                value={progressionContent.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProgressionContent((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Titre"
              />

              {/* Gestion des fichiers pour image et PDF */}
              {contentPreset === "image" && (
                <Box sx={{ "& > * + *": { mt: 2 } }}>
                  <FormLabel sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
                    Image
                  </FormLabel>
                  {selectedFile && filePreview ? (
                    <ImagePreview
                      src={filePreview}
                      alt="Preview"
                      filename={selectedFile.name}
                      onRemove={handleFileRemove}
                      initialImageSize={progressionContent.imageSize}
                      onImageSizeChange={(size) =>
                        setProgressionContent((prev) => ({
                          ...prev,
                          imageSize: size,
                        }))
                      }
                    />
                  ) : progressionContent.resourceUrl ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <ImagePreview
                        src={getApiFileUrl(progressionContent.resourceUrl)}
                        alt="Current image"
                        onRemove={() =>
                          setProgressionContent((prev) => ({
                            ...prev,
                            resourceUrl: "",
                          }))
                        }
                        initialImageSize={progressionContent.imageSize}
                        onImageSizeChange={(size) =>
                          setProgressionContent((prev) => ({
                            ...prev,
                            imageSize: size,
                          }))
                        }
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Ou ajoutez une nouvelle image :
                      </Typography>
                      <SmartFileUploader
                        onFileSelect={handleFileSelect}
                        onFileReject={handleFileReject}
                        fileType="image"
                        className="border-blue-200 bg-blue-50"
                        existingFileUrl={getApiFileUrl(progressionContent.resourceUrl)}
                      />
                    </Box>
                  ) : (
                    <SmartFileUploader
                      onFileSelect={handleFileSelect}
                      onFileReject={handleFileReject}
                      fileType="image"
                      className="border-blue-200 bg-blue-50"
                      existingFileUrl={getApiFileUrl(progressionContent.resourceUrl)}
                    />
                  )}
                  {uploadingFile && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                    />
                  )}
                  {selectedFile && (
                    <Button
                      onClick={handleFileUpload}
                      disabled={uploadingFile}
                      className="w-full"
                    >
                      {uploadingFile
                        ? "Upload en cours..."
                        : "Uploader l'image"}
                    </Button>
                  )}
                </Box>
              )}

              {contentPreset === "pdf" && (
                <Box sx={{ "& > * + *": { mt: 2 } }}>
                  <FormLabel component="legend">Document PDF</FormLabel>
                  {selectedFile ? (
                    <PDFViewer
                      src={URL.createObjectURL(selectedFile)}
                      filename={selectedFile.name}
                      onRemove={handleFileRemove}
                      showControls={false}
                    />
                  ) : progressionContent.resourceUrl ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <PDFViewer
                        src={getApiFileUrl(progressionContent.resourceUrl)}
                        filename="Document actuel"
                        onRemove={() =>
                          setProgressionContent((prev) => ({
                            ...prev,
                            resourceUrl: "",
                          }))
                        }
                        isEmbedded={true}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        Ou ajoutez un nouveau PDF :
                      </Typography>
                      <SmartFileUploader
                        onFileSelect={handleFileSelect}
                        onFileReject={handleFileReject}
                        fileType="pdf"
                        className="border-red-200 bg-red-50"
                        existingFileUrl={getApiFileUrl(progressionContent.resourceUrl)}
                      />
                    </Box>
                  ) : (
                    <SmartFileUploader
                      onFileSelect={handleFileSelect}
                      onFileReject={handleFileReject}
                      fileType="pdf"
                      className="border-red-200 bg-red-50"
                      existingFileUrl={getApiFileUrl(progressionContent.resourceUrl)}
                    />
                  )}
                  {uploadingFile && (
                    <LinearProgress
                      variant="determinate"
                      value={uploadProgress}
                    />
                  )}
                  {selectedFile && (
                    <Button
                      onClick={handleFileUpload}
                      disabled={uploadingFile}
                      className="w-full"
                    >
                      {uploadingFile ? "Upload en cours..." : "Uploader le PDF"}
                    </Button>
                  )}
                </Box>
              )}

              {/* URL de ressource pour vidéo ou comme alternative pour image/PDF */}
              {(contentPreset === "video" ||
                contentPreset === "url" ||
                ((contentPreset === "image" || contentPreset === "pdf") &&
                  !selectedFile)) && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {contentPreset !== "video" && (
                    <FormLabel
                      sx={{ fontSize: "0.75rem", color: "text.secondary" }}
                    >
                      Ou utilisez une URL externe :
                    </FormLabel>
                  )}
                  <TextField
                    fullWidth
                    type="url"
                    label={`URL ${
                      contentPreset === "video"
                        ? "de la vidéo"
                        : contentPreset === "image"
                        ? "de l'image"
                        : contentPreset === "pdf"
                        ? "du PDF"
                        : "externe"
                    }`}
                    value={progressionContent.resourceUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProgressionContent((prev) => ({
                        ...prev,
                        resourceUrl: e.target.value,
                      }))
                    }
                    placeholder={`URL ${
                      contentPreset === "video"
                        ? "de la vidéo"
                        : contentPreset === "image"
                        ? "de l'image"
                        : contentPreset === "pdf"
                        ? "du PDF"
                        : "externe"
                    }`}
                  />
                </Box>
              )}

              {/* Éditeur de texte enrichi */}
              <Box sx={{ border: 1, borderRadius: 1, p: 1 }}>
                <RichTextEditor
                  value={progressionContent.content}
                  onChange={(value) =>
                    setProgressionContent((prev) => ({
                      ...prev,
                      content: value,
                    }))
                  }
                  placeholder="Contenu de la progression..."
                />
              </Box>

              {/* Activité existante - crée une progression dédiée */}
              {contentPreset === "existing-activity" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    borderTop: 1,
                    borderColor: "divider",
                    pt: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Associer une activité existante
                  </Typography>

                  {/* Sélection du cours */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{ fontSize: "small", textTransform: "uppercase" }}
                      >
                        Sélectionner un cours
                      </InputLabel>
                      <MuiSelect
                        value={selectedCourseForProgression}
                        onChange={(e) => {
                          setSelectedCourseForProgression(e.target.value);
                          setSelectedActivityForProgression("none");
                        }}
                        label="Sélectionner un cours"
                      >
                        <MenuItem value="all">Tous les cours</MenuItem>
                        {courses
                          .filter(
                            (course) =>
                              course.theClasseId ===
                              selectedClasseForProgression
                          )
                          .sort((a, b) => naturalSort(a.title, b.title))
                          .map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                              {course.title}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </Box>

                  {/* Sélection de l'activité */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{ fontSize: "small", textTransform: "uppercase" }}
                      >
                        Sélectionner une activité
                      </InputLabel>
                      <MuiSelect
                        value={selectedActivityForProgression}
                        onChange={(e) => {
                          setSelectedActivityForProgression(e.target.value);
                          if (e.target.value === "none") {
                            setProgressionContent((prev) => ({
                              ...prev,
                              title: prev.title,
                            }));
                            return;
                          }
                          const filteredCourses =
                            selectedCourseForProgression &&
                            selectedCourseForProgression !== "all"
                              ? courses.filter(
                                  (c) => c.id === selectedCourseForProgression
                                )
                              : courses.filter(
                                  (c) =>
                                    c.theClasseId ===
                                    selectedClasseForProgression
                                );
                          const withCourse = filteredCourses.flatMap((course) =>
                            (course.activities || []).map((a) => ({
                              a,
                              course,
                            }))
                          );
                          const found = withCourse.find(
                            (x) => x.a && x.a.id === e.target.value
                          );
                          if (found) {
                            setProgressionContent((prev) => ({
                              ...prev,
                              title: found.a.title || prev.title,
                            }));
                          }
                        }}
                        label="Sélectionner une activité"
                      >
                        <MenuItem value="none">Aucune activité</MenuItem>
                        {(() => {
                          const filteredCourses =
                            selectedCourseForProgression &&
                            selectedCourseForProgression !== "all"
                              ? courses.filter(
                                  (c) => c.id === selectedCourseForProgression
                                )
                              : courses.filter(
                                  (c) =>
                                    c.theClasseId ===
                                    selectedClasseForProgression
                                );
                          return filteredCourses
                            .flatMap((course) =>
                              (course.activities || []).map((activity) => ({
                                ...activity,
                                courseName: course.title,
                              }))
                            )
                            .filter(
                              (activity) =>
                                activity &&
                                activity.id &&
                                activity.id.trim() !== ""
                            )
                            .sort((a, b) =>
                              naturalSort(a.title || "", b.title || "")
                            )
                            .map((activity) => {
                              const fileUrl = activity.fileUrl ? `/api/files${activity.fileUrl}` : null;
                              return (
                                <MenuItem key={activity.id} value={activity.id}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <span>
                                      {activity.title}{" "}
                                      {selectedCourseForProgression === "all" &&
                                        `(${activity.courseName})`}
                                    </span>
                                    {fileUrl && (
                                      <Tooltip title="Ouvrir le fichier dans un nouvel onglet">
                                        <IconButton
                                          size="small"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(fileUrl, '_blank', 'noopener,noreferrer');
                                          }}
                                        >
                                          <OpenInNewIcon fontSize="inherit" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                  </Box>
                                </MenuItem>
                              );
                            });
                        })()}
                      </MuiSelect>
                    </FormControl>
                  </Box>

                  {/* <Button
            onClick={handleSaveProgression}
            className="w-full"
            disabled={selectedActivityForProgression === 'none'}
            >
            Ajouter la progression avec l&apos;activité sélectionnée
            </Button> */}
                </Box>
              )}

              {/* Zone de dépôt - crée une progression dédiée */}
              {contentPreset === "file-drop" && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    borderTop: 1,
                    borderColor: "divider",
                    pt: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Associer une zone de dépôt
                  </Typography>

                  {/* Sélection du cours */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{ fontSize: "small", textTransform: "uppercase" }}
                      >
                        Sélectionner un cours
                      </InputLabel>
                      <MuiSelect
                        value={selectedCourseForProgression}
                        onChange={(e) => {
                          setSelectedCourseForProgression(e.target.value);
                          setSelectedActivityForProgression("none");
                        }}
                        label="Sélectionner un cours"
                      >
                        <MenuItem value="all">Tous les cours</MenuItem>
                        {courses
                          .filter(
                            (course) =>
                              course.theClasseId ===
                              selectedClasseForProgression
                          )
                          .sort((a, b) => naturalSort(a.title, b.title))
                          .map((course) => (
                            <MenuItem key={course.id} value={course.id}>
                              {course.title}
                            </MenuItem>
                          ))}
                      </MuiSelect>
                    </FormControl>
                  </Box>

                  {/* Sélection de la zone de dépôt */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <FormControl fullWidth>
                      <InputLabel
                        sx={{ fontSize: "small", textTransform: "uppercase" }}
                      >
                        Sélectionner une zone de dépôt
                      </InputLabel>
                      <MuiSelect
                        value={selectedActivityForProgression}
                        onChange={(e) => {
                          setSelectedActivityForProgression(e.target.value);
                          if (e.target.value === "none") {
                            setProgressionContent((prev) => ({
                              ...prev,
                              title: prev.title,
                            }));
                            return;
                          }
                          const filteredCourses =
                            selectedCourseForProgression &&
                            selectedCourseForProgression !== "all"
                              ? courses.filter(
                                  (c) => c.id === selectedCourseForProgression
                                )
                              : courses.filter(
                                  (c) =>
                                    c.theClasseId ===
                                    selectedClasseForProgression
                                );
                          const withCourse = filteredCourses.flatMap((course) =>
                            (course.activities || []).filter(a => a.isFileDrop).map((a) => ({
                              a,
                              course,
                            }))
                          );
                          const found = withCourse.find(
                            (x) => x.a && x.a.id === e.target.value
                          );
                          if (found) {
                            setProgressionContent((prev) => ({
                              ...prev,
                              title: found.a.title || prev.title,
                            }));
                          }
                        }}
                        label="Sélectionner une zone de dépôt"
                      >
                        <MenuItem value="none">Aucune zone de dépôt</MenuItem>
                        {(() => {
                          const filteredCourses =
                            selectedCourseForProgression &&
                            selectedCourseForProgression !== "all"
                              ? courses.filter(
                                  (c) => c.id === selectedCourseForProgression
                                )
                              : courses.filter(
                                  (c) =>
                                    c.theClasseId ===
                                    selectedClasseForProgression
                                );
                          return filteredCourses
                            .flatMap((course) =>
                              (course.activities || []).filter(a => a.isFileDrop).map((activity) => ({
                                ...activity,
                                courseName: course.title,
                              }))
                            )
                            .filter(
                              (activity) =>
                                activity &&
                                activity.id &&
                                activity.id.trim() !== ""
                            )
                            .sort((a, b) =>
                              naturalSort(a.title || "", b.title || "")
                            )
                            .map((activity) => (
                              <MenuItem key={activity.id} value={activity.id}>
                                {activity.title}{" "}
                                {selectedCourseForProgression === "all" &&
                                  `(${activity.courseName})`}
                              </MenuItem>
                            ));
                        })()}
                      </MuiSelect>
                    </FormControl>
                  </Box>
                </Box>
              )}

              {/* Sélection d'icône et couleur */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                <Box sx={{ flex: 1 }}>
                  <IconPicker
                    value={progressionContent.icon}
                    onChange={(icon) => {
                      setProgressionContent((prev) => ({ ...prev, icon }));
                    }}
                  />
                </Box>
                <Box>
                  <FormLabel sx={{ fontSize: "0.75rem", fontWeight: 500, textTransform: 'uppercase' }}>
                    Couleur de l&apos;icône
                  </FormLabel>
                  <ColorPicker
                    value={progressionContent.iconColor}
                    onChange={(color) =>
                      setProgressionContent((prev) => ({
                        ...prev,
                        iconColor: color,
                      }))
                    }
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
                <Button
                  onClick={handleSaveProgression}
                  className="flex-1"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                >
                  Ajouter la progression
                </Button>
                <Tooltip title="Copier l'URL directe vers cette progression">
                  <IconButton
                    onClick={handleCopyProgressionUrl}
                    disabled={!selectedClasseForProgression || !selectedDate}
                    sx={{
                      border: '1px solid',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          )}

          {/* Liste des progressions existantes */}
          {progressions.length > 0 && (
            <Box sx={{ "& > * + *": { mt: 1 } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                {/* <Typography variant="h5" sx={{ fontWeight: 600 }}>Progressions existantes</Typography> */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: 'column',
                    justifyContent: "space-between",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  {selectedDate && !showAllProgressions && (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Filtré par :{" "}
                      {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
                    </Typography>
                  )}
                  <Stack
                  sx = {{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%',
                    mb: 1,
                  }}
                  >
                    {/* Stack pour Déplacer et Copier - toujours en row */}
                    <Stack
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Button
                        fullWidth
                        size="medium"
                        variant="outlined"
                        color="primary"
                        onClick={handleMoveClick}
                        disabled={isMoveOrCopyDisabled()}
                        sx={{
                          display: { xs: 'none', md: 'flex' },
                        }}
                      >
                        Déplacer progression
                      </Button>
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={handleMoveClick}
                        disabled={isMoveOrCopyDisabled()}
                        sx={{
                          display: { xs: 'flex', md: 'none' },
                          border: '1px solid',
                          borderColor: 'primary.main',
                          borderRadius: 1,
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                      <Button
                        fullWidth
                        size="medium"
                        variant="outlined"
                        color="primary"
                        onClick={handleCopyClick}
                        disabled={isMoveOrCopyDisabled()}
                        sx={{
                          display: { xs: 'none', md: 'flex' },
                        }}
                      >
                        Copier progression
                      </Button>
                      <IconButton
                        size="medium"
                        color="primary"
                        onClick={handleCopyClick}
                        disabled={isMoveOrCopyDisabled()}
                        sx={{
                          display: { xs: 'flex', md: 'none' },
                          border: '1px solid',
                          borderColor: 'primary.main',
                          borderRadius: 1,
                        }}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Stack>

                    {/* Stack pour Supprimer tout et Tout afficher - toujours en row */}
                    <Stack
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {selectedDate &&
                        !showAllProgressions &&
                        (() => {
                          const filteredProgressions = progressions.filter((p) => {
                            const progressionDate = new Date(p.date);
                            const selectedDateOnly = new Date(
                              selectedDate.getFullYear(),
                              selectedDate.getMonth(),
                              selectedDate.getDate()
                            );
                            const progressionDateOnly = new Date(
                              progressionDate.getFullYear(),
                              progressionDate.getMonth(),
                              progressionDate.getDate()
                            );
                            return (
                              selectedDateOnly.getTime() ===
                              progressionDateOnly.getTime()
                            );
                          });
                          return filteredProgressions.length > 0 ? (
                            <Button
                            fullWidth
                              size="medium"
                              variant="outlined"
                              color="error"
                              onClick={handleDeleteAllClick}
                            >
                              Supprimer tout ({filteredProgressions.length})
                            </Button>
                          ) : null;
                        })()}
                      <Button
                      fullWidth
                        size="medium"
                        variant={showAllProgressions ? "contained" : "outlined"}
                        color="secondary"
                        onClick={handleToggleShowAll}
                      >
                        {showAllProgressions ? "Filtrer par date" : "Tout afficher"}
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Box>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEndProgression}
              >
                <SortableContext
                  items={(showAllProgressions || !selectedDate
                    ? progressions
                    : progressions.filter((p) => {
                        const progressionDate = new Date(p.date);
                        const selectedDateOnly = new Date(
                          selectedDate.getFullYear(),
                          selectedDate.getMonth(),
                          selectedDate.getDate()
                        );
                        const progressionDateOnly = new Date(
                          progressionDate.getFullYear(),
                          progressionDate.getMonth(),
                          progressionDate.getDate()
                        );
                        return (
                          selectedDateOnly.getTime() ===
                          progressionDateOnly.getTime()
                        );
                      })
                  ).map((p) => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <List sx={{ maxHeight: 384, overflowY: "auto", gap: 1 }}>
                    {(() => {
                      const filteredProgressions =
                        showAllProgressions || !selectedDate
                          ? progressions
                          : progressions.filter((p) => {
                              const progressionDate = new Date(p.date);
                              const selectedDateOnly = new Date(
                                selectedDate.getFullYear(),
                                selectedDate.getMonth(),
                                selectedDate.getDate()
                              );
                              const progressionDateOnly = new Date(
                                progressionDate.getFullYear(),
                                progressionDate.getMonth(),
                                progressionDate.getDate()
                              );
                              return (
                                selectedDateOnly.getTime() ===
                                progressionDateOnly.getTime()
                              );
                            });

                      if (
                        filteredProgressions.length === 0 &&
                        !showAllProgressions &&
                        selectedDate
                      ) {
                        return (
                          <ListItem
                            sx={{
                              justifyContent: "center",
                              bgcolor: "grey.50",
                              borderRadius: 1,
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: "text.secondary",
                                textAlign: "center",
                              }}
                            >
                              Aucune progression trouvée pour le{" "}
                              {format(selectedDate, "dd MMMM yyyy", {
                                locale: fr,
                              })}
                            </Typography>
                          </ListItem>
                        );
                      }

                      return filteredProgressions.map((progression) => (
                        <SortableProgression
                          key={progression.id}
                          progression={progression}
                          onEdit={handleEditProgression}
                          onDelete={async (id) => {
                            const response = await fetch(
                              `/api/progressions/${id}`,
                              {
                                method: "DELETE",
                              }
                            );
                            if (response.ok) {
                              loadProgressions(selectedClasseForProgression);
                              showSnackbar("Progression supprimée", "success");
                            }
                          }}
                        />
                      ));
                    })()}
                  </List>
                </SortableContext>
              </DndContext>
            </Box>
          )}

          {errorProgression && <ErrorMessage message={errorProgression} />}
          {successMessageProgression && (
            <SuccessMessage message={successMessageProgression} />
          )}

          {/* Modal commun pour déplacer/copier les progressions */}
          <Dialog
            open={isDialogOpen}
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedProgressions([]);
              setSelectedProgressionIds([]);
              setTargetDate(undefined);
            }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {dialogMode === 'move' ? 'Déplacer' : 'Copier'} {selectedProgressions.length === 1 ? 'la progression' : 'les progressions'}
            </DialogTitle>
            <DialogContent>
        <Box sx={{ pt: 1 }}>
          {selectedProgressions.length === 1 ? (
            <Typography variant="body2" sx={{ mb: 2 }}>
              {dialogMode === 'move' ? 'Déplacer' : 'Copier'} &quot;{selectedProgressions[0].title}&quot; du{" "}
              {format(new Date(selectedProgressions[0].date), "dd MMMM yyyy", { locale: fr })}
            </Typography>
          ) : (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Sélectionnez les progressions à {dialogMode === 'move' ? 'déplacer' : 'copier'} :
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Tout sélectionner">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedProgressionIds(selectedProgressions.map(p => p.id))}
                      disabled={selectedProgressionIds.length === selectedProgressions.length}
                    >
                      <CheckBoxIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Tout désélectionner">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedProgressionIds([])}
                      disabled={selectedProgressionIds.length === 0}
                    >
                      <CheckBoxOutlineBlankIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <List dense>
                {selectedProgressions.map((progression) => (
                  <ListItem key={progression.id} sx={{ px: 0 }}>
                    <Checkbox
                      checked={selectedProgressionIds.includes(progression.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProgressionIds(prev => [...prev, progression.id]);
                        } else {
                          setSelectedProgressionIds(prev => prev.filter(id => id !== progression.id));
                        }
                      }}
                      size="small"
                    />
                    <ListItemText
                      primary={progression.title}
                      secondary={format(new Date(progression.date), "dd MMMM yyyy", { locale: fr })}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Sélectionnez la nouvelle date :
          </Typography>
          <Calendar
            mode="single"
            selected={targetDate}
            onSelect={setTargetDate}
            locale={fr}
            className="rounded-md border"
            modifiers={{
              hasProgression: getDatesWithProgression(),
              currentDate: selectedProgressions.length === 1 ? [new Date(selectedProgressions[0].date)] : [],
            }}
            modifiersStyles={{
              hasProgression: {
                backgroundColor: "#9fcbf8ff",
                color: "#111827",
                fontWeight: "bold",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              currentDate: {
                backgroundColor: "#fbbf24",
                color: "#111827",
                fontWeight: "bold",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />
          {existingProgressionsForDate.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Progressions déjà présentes pour cette date :
              </Typography>
              <List sx={{ maxHeight: 200, overflowY: "auto", gap: 1 }}>
                {existingProgressionsForDate.map((progression) => (
                  <SortableProgression
                    key={progression.id}
                    progression={progression}
                    onEdit={handleEditProgression}
                    onDelete={async (id) => {
                      const response = await fetch(
                        `/api/progressions/${id}`,
                        {
                          method: "DELETE",
                        }
                      );
                      if (response.ok) {
                        loadProgressions(selectedClasseForProgression);
                        showSnackbar("Progression supprimée", "success");
                      }
                    }}
                  />
                ))}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsDialogOpen(false);
            setSelectedProgressions([]);
            setSelectedProgressionIds([]);
            setTargetDate(undefined);
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={() => {
            if (selectedProgressions.length === 1) {
              if (dialogMode === 'move') {
                handleMoveProgression(selectedProgressions[0], targetDate!);
              } else {
                handleCopyProgression(selectedProgressions[0], targetDate!);
              }
            } else {
              if (dialogMode === 'move') {
                handleMoveMultipleProgressions();
              } else {
                handleCopyMultipleProgressions();
              }
            }
          }}
          variant="contained"
          disabled={!targetDate || (selectedProgressions.length > 1 && selectedProgressionIds.length === 0)}
        >
          {dialogMode === 'move' ? 'Déplacer' : 'Copier'}
        </Button>
      </DialogActions>
    </Dialog>
    </Box>
  );
};
