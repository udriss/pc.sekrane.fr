'use client';

import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface Question {
  ID: number;
  question?: string;
  reponse: string;
}

interface QuestionDisplayProps {
  questions: {
    conquete: Question[];
    structure: Question[];
    rebus: Question[];
  };
  currentQuestion: {
    type: 'structure' | 'conquete' | 'rebus';
    index: number;
    questionID: number;
    content?: Question;
    imagePath?: string;
  } | null;
  onQuestionClick: (type: 'structure' | 'conquete' | 'rebus', index: number) => void;
  answeredQuestions: AnsweredQuestions;
}

interface AnsweredQuestions {
  S: number[];
  C: number[];
  R: number[];
}

// Styled component for question buttons
const QuestionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  width: '100%',
  justifyContent: 'flex-start',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  transition: 'background-color 0.3s, color 0.3s',
  textTransform: 'none',
  fontWeight: 'normal'
}));

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  questions, 
  currentQuestion, 
  onQuestionClick,
  answeredQuestions
}) => {
  return (
    <Box>
      <Grid container spacing={2}>
        {/* Structure Questions */}
        <Grid size={{ xs:12, md:4 }} >
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              backgroundColor: 'grey.100',
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Structures célestes
            </Typography>
            <Stack spacing={1}>
              {questions?.structure?.map((question: Question, index: number) => (
                <QuestionButton
                  key={`scores_S${index}`}
                  onClick={() => onQuestionClick('structure', index)}
                  variant={
                    currentQuestion?.type === 'structure' && 
                    currentQuestion?.questionID === question.ID 
                      ? 'contained' 
                      : 'outlined'
                  }
                  color={
                    answeredQuestions.S.includes(question.ID)
                      ? 'success'
                      : currentQuestion?.type === 'structure' && 
                        currentQuestion?.questionID === question.ID
                        ? 'primary'
                        : 'inherit'
                  }
                >
                  Question {index + 1}
                </QuestionButton>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Conquête Questions */}
        <Grid size={{ xs:12, md:4 }} >
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              backgroundColor: 'grey.100',
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Conquêtes spatiales
            </Typography>
            <Stack spacing={1}>
              {questions?.conquete?.map((question: Question, index: number) => (
                <QuestionButton
                  key={`scores_C${index}`}
                  onClick={() => onQuestionClick('conquete', index)}
                  variant={
                    currentQuestion?.type === 'conquete' && 
                    currentQuestion?.questionID === question.ID 
                      ? 'contained' 
                      : 'outlined'
                  }
                  color={
                    answeredQuestions.C.includes(question.ID)
                      ? 'success'
                      : currentQuestion?.type === 'conquete' && 
                        currentQuestion?.questionID === question.ID
                        ? 'primary'
                        : 'inherit'
                  }
                >
                  Question {index + 1}
                </QuestionButton>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Rébus Questions */}
        <Grid size={{ xs:12, md:4 }} >
          <Paper 
            elevation={1} 
            sx={{ 
              p: 2, 
              backgroundColor: 'grey.100',
              height: '100%'
            }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Rébus
            </Typography>
            <Stack spacing={1}>
              {questions?.rebus?.map((question: Question, index: number) => (
                <QuestionButton
                  key={`scores_R${index}`}
                  onClick={() => onQuestionClick('rebus', index)}
                  variant={
                    currentQuestion?.type === 'rebus' && 
                    currentQuestion?.questionID === question.ID 
                      ? 'contained' 
                      : 'outlined'
                  }
                  color={
                    answeredQuestions.R.includes(question.ID)
                      ? 'success'
                      : currentQuestion?.type === 'rebus' && 
                        currentQuestion?.questionID === question.ID
                        ? 'primary'
                        : 'inherit'
                  }
                >
                  Rébus {index + 1}
                </QuestionButton>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionDisplay;