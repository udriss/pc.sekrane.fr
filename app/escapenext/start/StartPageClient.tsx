'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button } from '@nextui-org/react';
import QuestionDisplay from '@/app/escapenext/start/QuestionDisplay';
import IndiceDisplay from '@/app/escapenext/IndiceDisplay'; // added import

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

  console.log('sessionData:', sessionData);
  
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
    console.log('Question clicked:', type, index, questionContent.ID);
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
          gameId // Add gameId to request
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
          setAnsweredQuestions(prev => ({
            ...prev,
            [category]: result.updatedAnswers
          }));
          setScores(prev => ({
            ...prev,
            [category]: result.updatedScore
          }));
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

  return (
    <div style={{ marginTop: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card>
        <div>
          <QuestionDisplay 
            questions={questions}
            currentQuestion={currentQuestion}
            onQuestionClick={handleQuestionClick}
            answeredQuestions={answeredQuestions}
          />

          {currentQuestion && (
            <div className="flex flex-col items-center gap-4">
              <div className="text-center p-4">
                {currentQuestion.type !== 'rebus' && currentQuestion.content?.question && (
                  <p className="text-lg mb-4">{currentQuestion.content.question}</p>
                )}
                {currentQuestion.type === 'rebus' && currentQuestion.imagePath && (
                  <img 
                    src={currentQuestion.imagePath} 
                    alt={`Rébus ${currentQuestion.questionID}`} 
                    className="max-w-full h-auto mb-4"
                  />
                )}
              </div>

              <div className="flex gap-2 items-center justify-center">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Votre réponse..."
                  className="px-4 py-2 border rounded-lg"
                  disabled={answeredQuestions[currentQuestion.type === 'structure' ? 'S' : 
                           currentQuestion.type === 'conquete' ? 'C' : 'R']
                           .includes(currentQuestion.questionID)}
                />
                <Button 
                  onPress={handleAnswerSubmitNew}
                  disabled={answeredQuestions[currentQuestion.type === 'structure' ? 'S' : 
                           currentQuestion.type === 'conquete' ? 'C' : 'R']
                           .includes(currentQuestion.questionID)}
                >
                  Vérifier
                </Button>
              </div>
            </div>
          )}

          {verificationMessage && (
            <div className={`mt-4 p-4 rounded-lg text-center ${
              verificationMessage.isSuccess 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {verificationMessage.message}
            </div>
          )}
        </div>
      </Card>

      {/* Render IndiceDisplay component with scores from sessionData */}
      <div className="mt-8">
        <IndiceDisplay 
          scoreS={scores.S} 
          scoreC={scores.C} 
          scoreR={scores.R} 
        />
      </div>
    </div>
  );
};

export default StartPageClient;