'use client';

import React, { useState, useEffect } from 'react';
import QuestionDisplay from '@/app/escapenext/start/QuestionDisplay';
import IndiceDisplay from '@/app/escapenext/IndiceDisplay';
import IndiceTimeline from '@/app/escapenext/IndiceTimeline';
import EnigmeDisplay from '@/app/escapenext/EnigmeDisplay';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Card, 
  CardContent,
  Button,
  Typography,
  Box,
  LinearProgress,
  Modal,
  Paper,
  Grid,
  Chip,
  TextField,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Save as SaveIcon, 
  CheckCircle as CheckCircleIcon, 
  Error as ErrorIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface Question {
  ID: number;
  question?: string;
  reponse: string;
}

interface StartPageProps {
  gameId: number;
  sessionData: {
    passSession: string;
    scores: { S: number; C: number; R: number; E: number };
    questions: {
      conquete: Question[];
      structure: Question[];
      rebus: Question[];
      enigmes: Question[];
    };
    answeredQuestionsS: string;
    answeredQuestionsC: string;
    answeredQuestionsR: string;
    updated_at?: string;
  };
}

interface AnsweredQuestions {
  S: number[];  // storing indexes instead of IDs
  C: number[];
  R: number[];
}

const StartPageClient: React.FC<StartPageProps> = ({ 
  sessionData,
  gameId
}) => {
  const [questions] = useState(sessionData?.questions ?? {
    conquete: [],
    structure: [],
    rebus: [],
    enigmes: []
  });


  
  const [currentQuestion, setCurrentQuestion] = useState<{
    type: 'structure' | 'conquete' | 'rebus';
    index: number;
    questionID: number;
    content?: Question;
    imagePath?: string;
  } | null>(null);
  
  const [answer, setAnswer] = useState('');
  const [verificationMessage, setVerificationMessage] = useState<{
    isSuccess: boolean;
    message: string;
  } | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestions>({
    S: sessionData.answeredQuestionsS ? sessionData.answeredQuestionsS.split(',').map(Number) : [],
    C: sessionData.answeredQuestionsC ? sessionData.answeredQuestionsC.split(',').map(Number) : [],
    R: sessionData.answeredQuestionsR ? sessionData.answeredQuestionsR.split(',').map(Number) : []
  });

  // Add state for scores initialized from sessionData
  const [scores, setScores] = useState<{ S: number; C: number; R: number; E: number }>(sessionData.scores);
  
  // État pour les énigmes
  const [completedEnigmes, setCompletedEnigmes] = useState<number[]>([]);
  
  // Calculer le nombre d'indices débloqués
  const getUnlockedIndicesCount = (): number => {
    let count = 0;
    
    // Définition des critères de déblocage pour chaque indice
    const indiceRequirements = [
      { level: 1, requirements: { S: 2, C: 2, R: 2 } },
      { level: 2, requirements: { S: 3, C: 3, R: 3 } },
      { level: 3, requirements: { S: 6, C: 4, R: 4 } },
      { level: 4, requirements: { S: 6, C: 5, R: 4 } },
      { level: 5, requirements: { S: 8, C: 5, R: 4 } },
      { level: 6, requirements: { S: 10, C: 5, R: 4 } },
      { level: 7, requirements: { S: 10, C: 6, R: 5 } }
    ];
    
    for (const indice of indiceRequirements) {
      if (
        scores.S >= indice.requirements.S && 
        scores.C >= indice.requirements.C && 
        scores.R >= indice.requirements.R
      ) {
        count = indice.level;
      } else {
        break;
      }
    }
    
    return count;
  };

  // Gérer la soumission d'une réponse à une énigme
  const handleEnigmeSubmit = async (enigmeId: number, answer: string): Promise<boolean> => {
    try {
      // Envoyer la réponse à l'API pour vérification
      const response = await fetch('/api/verify-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionID: enigmeId,
          userAnswer: answer,
          type: 'enigme',
          gameId
        })
      });

      const result = await response.json();

      if (result.correct) {
        // Si la réponse est correcte, mettre à jour l'état des énigmes complétées
        const updatedCompletedEnigmes = [...completedEnigmes, enigmeId];
        setCompletedEnigmes(updatedCompletedEnigmes);
        
        // Mettre à jour le score des énigmes
        const updatedScores = {
          ...scores,
          E: scores.E + 5 // Ajouter 5 points pour chaque énigme résolue
        };
        
        setScores(updatedScores);
        
        // Sauvegarder les progrès
        saveGameProgressWithData(answeredQuestions, updatedScores);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error submitting enigme answer:', error);
      return false;
    }
  };

  // Gérer la complétion d'une énigme
  const handleEnigmeComplete = (enigmeId: number) => {
    console.log(`Énigme ${enigmeId} completed!`);
  };
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(sessionData.updated_at || null);
  const [isSaving, setIsSaving] = useState(false);
  const [totalScore, setTotalScore] = useState<number>(
    sessionData.scores.S + sessionData.scores.C + sessionData.scores.R + sessionData.scores.E
  );

  // Calculate progress based on answered questions
  const calculateProgress = () => {
    const totalAnswered = answeredQuestions.S.length + answeredQuestions.C.length + answeredQuestions.R.length;
    const totalQuestions = questions.structure.length + questions.conquete.length + questions.rebus.length;
    return totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
  };
  
  const [progress, setProgress] = useState<number>(calculateProgress());

  useEffect(() => {
    // Update progress when answered questions change
    setProgress(calculateProgress());
    setTotalScore(scores.S + scores.C + scores.R + scores.E);
  }, [answeredQuestions, scores]);

  // Function to save game progress with updated data
  const saveGameProgressWithData = async (updatedAnsweredQuestions: AnsweredQuestions, updatedScores: { S: number; C: number; R: number; E: number }) => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/update-escape-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          gameId,
          scores: updatedScores,
          answeredQuestions: updatedAnsweredQuestions
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setLastSavedAt(result.updatedAt || new Date().toISOString());
      } else {
        setFeedback('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      setFeedback(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  // Existing save game progress function that uses current state
  const saveGameProgress = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/update-escape-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          gameId,
          scores,
          answeredQuestions
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setLastSavedAt(result.updatedAt || new Date().toISOString());
      } else {
        setFeedback('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      setFeedback(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuestionClick = (type: 'structure' | 'conquete' | 'rebus', index: number) => {
    let questionContent: Question | undefined;
    let imagePath: string | undefined;
  
    switch (type) {
      case 'structure':
        questionContent = questions.structure[index];
        break;
      case 'conquete':
        questionContent = questions.conquete[index];
        break;
      case 'rebus':
        questionContent = questions.rebus[index];
        imagePath = questionContent ? `/api/rebus?id=${questionContent.ID}` : undefined;
        break;
      default:
        console.error('Unknown question type:', type);
        return;
    }

    if (!questionContent) {
      console.error('Question content not found');
      return;
    }

    setCurrentQuestion({
      type: type as 'structure' | 'conquete' | 'rebus',
      index,
      questionID: questionContent.ID,
      content: questionContent,
      imagePath
    });
    
  };

  const handleAnswerSubmitNew = async () => {
    try {
      if (!currentQuestion) {
        setFeedback('No question selected');
        return;
      }

      const category = currentQuestion.type === 'structure' ? 'S' : 
                      currentQuestion.type === 'conquete' ? 'C' : 
                      currentQuestion.type === 'rebus' ? 'R' : '';

      if (answeredQuestions[category as keyof AnsweredQuestions].includes(currentQuestion.questionID)) {
        setFeedback('Question already answered');
        return;
      }

      const verifyResponse = await fetch('/api/verify-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          questionID: currentQuestion.questionID, 
          userAnswer: answer,
          type: currentQuestion.type,
          index: currentQuestion.index,
          gameId
        })
      });

      const result = await verifyResponse.json();

      if (result.correct) {
        setVerificationMessage({
          isSuccess: true,
          message: "Bonne réponse ! 🎉"
        });
        setAnswer('');
        
        // Update answered questions if score was updated
        if (result.scoreUpdated && result.updatedAnswers) {
          const category = currentQuestion.type === 'structure' ? 'S' : 
                          currentQuestion.type === 'conquete' ? 'C' : 'R';
          
          // Update state with new data
          const updatedAnsweredQuestions = {
            ...answeredQuestions,
            [category]: result.updatedAnswers
          };
          
          const updatedScores = {
            ...scores,
            [category]: result.updatedScore
          };
          
          // Set state
          setAnsweredQuestions(updatedAnsweredQuestions);
          setScores(updatedScores);
          
          // Auto-save progress after correct answer with the updated values
          saveGameProgressWithData(updatedAnsweredQuestions, updatedScores);
        }
      } else {
        setVerificationMessage({
          isSuccess: false,
          message: "Mauvaise réponse, essayez encore 😕"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setFeedback(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const [selectedIndice, setSelectedIndice] = useState<number | null>(null);
  const [indiceModalOpen, setIndiceModalOpen] = useState<boolean>(false);

  const handleIndiceClick = (indiceId: number) => {
    setSelectedIndice(indiceId);
    setIndiceModalOpen(true);
  };

  const handleCloseIndiceModal = () => {
    setIndiceModalOpen(false);
  };

  // Styles for Material UI modal
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'auto'
  };

  return (
    <Box sx={{ mt: 15, display: 'flex', flexDirection: 'column', alignItems: 'center', px: 2 }}>
      {/* Score display at the top */}
      <Card sx={{ mb: 3, width: '100%', maxWidth: 800, boxShadow: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div">
              Progression: {progress}%
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setIsModalOpen(true)}
              startIcon={<SaveIcon />}
              sx={{ ml: 'auto' }}
            >
              Enregistrer
            </Button>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            color="primary"
            sx={{ height: 10, borderRadius: 5, mb: 2 }}
          />
          
          <Grid container spacing={2} justifyContent="space-around">
            <Grid size={{ xs:3 }}  sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">Structure</Typography>
              <Chip 
                label={`${scores.S} pts`} 
                color="primary" 
                variant="outlined"
                sx={{ minWidth: 70 }}
              />
            </Grid>
            <Grid size={{ xs:3 }}  sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">Conquête</Typography>
              <Chip 
                label={`${scores.C} pts`} 
                color="info" 
                variant="outlined"
                sx={{ minWidth: 70 }}
              />
            </Grid>
            <Grid size={{ xs:3 }}  sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">Rébus</Typography>
              <Chip 
                label={`${scores.R} pts`} 
                color="secondary" 
                variant="outlined"
                sx={{ minWidth: 70 }}
              />
            </Grid>
            <Grid size={{ xs:3 }}  sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
              <Chip 
                label={`${totalScore} pts`} 
                color="success" 
                sx={{ minWidth: 70, fontWeight: 'bold' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%', maxWidth: 1200 }}>
        {/* Partie gauche: Questions */}
        <Box sx={{ flex: '1', minWidth: 0 }}>
          <Card sx={{ width: '100%', boxShadow: 3 }}>
            <CardContent>
              <QuestionDisplay 
                questions={questions}
                currentQuestion={currentQuestion}
                onQuestionClick={handleQuestionClick}
                answeredQuestions={answeredQuestions}
              />

              {currentQuestion && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    {currentQuestion.type !== 'rebus' && currentQuestion.content?.question && (
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {currentQuestion.content.question}
                      </Typography>
                    )}
                    {currentQuestion.type === 'rebus' && currentQuestion.imagePath && (
                      <Box
                        component="img"
                        src={currentQuestion.imagePath}
                        alt={`Rébus ${currentQuestion.questionID}`}
                        sx={{ maxWidth: '100%', height: 'auto', mb: 2 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Votre réponse..."
                      size="small"
                      disabled={answeredQuestions[currentQuestion.type === 'structure' ? 'S' : 
                               currentQuestion.type === 'conquete' ? 'C' : 'R']
                               .includes(currentQuestion.questionID)}
                      sx={{ width: '200px' }}
                    />
                    <Button 
                      variant="contained"
                      onClick={handleAnswerSubmitNew}
                      disabled={answeredQuestions[currentQuestion.type === 'structure' ? 'S' : 
                               currentQuestion.type === 'conquete' ? 'C' : 'R']
                               .includes(currentQuestion.questionID)}
                    >
                      Vérifier
                    </Button>
                  </Box>
                </Box>
              )}

              {verificationMessage && (
                <Alert 
                  severity={verificationMessage.isSuccess ? "success" : "error"}
                  sx={{ mt: 2 }}
                  icon={verificationMessage.isSuccess ? <CheckCircleIcon /> : <ErrorIcon />}
                >
                  {verificationMessage.message}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Partie droite: Indices */}
        <Box sx={{ width: { xs: '100%', md: '350px' } }}>

          
          {/* Premier bloc: Indices débloqués */}
          {/* <IndiceDisplay 
            scoreS={scores.S} 
            scoreC={scores.C} 
            scoreR={scores.R} 
          /> */}
          
          {/* Deuxième bloc: Timeline des indices */}
          <Box >
            <IndiceTimeline
              scoreS={scores.S}
              scoreC={scores.C}
              scoreR={scores.R}
              onIndiceClick={handleIndiceClick}
            />
          </Box>
        </Box>
      </Box>

      {/* Ajout du composant d'énigmes qui dépend des indices débloqués */}
      <Box sx={{ width: '100%', mt: 4 }}>
        <EnigmeDisplay
          scoreS={scores.S}
          scoreC={scores.C}
          scoreR={scores.R}
          unlockedIndicesCount={getUnlockedIndicesCount()}
          enigmes={[
            {
              id: 0,
              question: "Rare, je ne suis pas Jovien mais Martien.",
            },
            {
              id: 1,
              question: "Après son rendez-vous de 2018, elle me rejoindra.",
            },
            {
              id: 2,
              question: "La première exploratrice.",
            },
            {
              id: 3,
              question: "Qui est l'intrus ?",
              requiresPaper: true,
              paperCode: "COSMOS-4"
            },
            {
              id: 4,
              question: "Énigme à décoder.",
              requiresPaper: true,
              paperCode: "FINALE-7"
            }
          ]}
          onSubmitAnswer={handleEnigmeSubmit}
          onEnigmeComplete={handleEnigmeComplete}
          completedEnigmes={completedEnigmes}
        />
      </Box>

      {/* Save Progress Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="modal-title" sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Progression de la partie
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Code de session
            </Typography>
            <Paper 
              elevation={0} 
              sx={{ 
                bgcolor: '#f5f5f5', 
                p: 1.5, 
                borderRadius: 2, 
                mb: 3,
                fontFamily: 'monospace',
                fontSize: '1.5rem',
                letterSpacing: '0.2rem',
                border: '1px dashed #ccc'
              }}
            >
              {sessionData.passSession}
            </Paper>
            
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Scores actuels
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs:6 }} >
                <Paper sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                  <Typography fontWeight="bold">Structure</Typography>
                  <Typography variant="h6">{scores.S} points</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs:6 }} >
                <Paper sx={{ p: 1.5, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                  <Typography fontWeight="bold">Conquête</Typography>
                  <Typography variant="h6">{scores.C} points</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs:6 }} >
                <Paper sx={{ p: 1.5, bgcolor: '#fff3e0', borderRadius: 2 }}>
                  <Typography fontWeight="bold">Rébus</Typography>
                  <Typography variant="h6">{scores.R} points</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs:6 }} >
                <Paper sx={{ p: 1.5, bgcolor: '#f3e5f5', borderRadius: 2 }}>
                  <Typography fontWeight="bold">Énigmes</Typography>
                  <Typography variant="h6">{scores.E} points</Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
              Score total
            </Typography>
            <Paper sx={{ p: 1.5, bgcolor: '#e8eaf6', borderRadius: 2, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold">{totalScore} points</Typography>
            </Paper>
            
            {lastSavedAt && (
              <Typography variant="caption" color="text.secondary">
                Dernière sauvegarde: {
                  formatDistanceToNow(new Date(lastSavedAt), { 
                    addSuffix: true,
                    locale: fr
                  })
                }
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => setIsModalOpen(false)}
            startIcon={<CloseIcon />}
          >
            Fermer
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={async () => {
              await saveGameProgress();
              setIsModalOpen(false);
            }}
            disabled={isSaving}
            startIcon={<SaveIcon />}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer maintenant'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal pour afficher un indice spécifique */}
      <Dialog
        open={indiceModalOpen}
        onClose={handleCloseIndiceModal}
        maxWidth="md"
        aria-labelledby="indice-modal-title"
      >
        <DialogTitle id="indice-modal-title" sx={{ textAlign: 'center', pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight="bold">
            Indice {selectedIndice}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              flexDirection: 'column',
              p: 2,
            }}
          >
            {selectedIndice && (
              <Box
                component="img"
                src={`/api/indices?id=${selectedIndice}`}
                alt={`Indice ${selectedIndice}`}
                sx={{ 
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleCloseIndiceModal}
            fullWidth
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StartPageClient;