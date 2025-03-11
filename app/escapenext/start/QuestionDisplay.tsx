'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

  onQuestionClick: (type: 'structure' | 'conquete' | 'rebus', index: number, questionID: number) => void;

  answeredQuestions: AnsweredQuestions;

}


interface AnsweredQuestions {

  S: number[];  // storing indexes instead of IDs

  C: number[];

  R: number[];

}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  questions, 
  currentQuestion, 
  onQuestionClick,
  answeredQuestions
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="mb-4 text-lg font-semibold">Structures célestes</h4>
          <div className="space-y-2">
            {questions?.structure?.map((question: Question, index: number) => (
              <div 
                key={`scores_S${index}`}
                onClick={() => onQuestionClick('structure', index, question.ID)}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  answeredQuestions.S.includes(question.ID)
                    ? currentQuestion?.type === 'structure' && currentQuestion?.questionID === question.ID
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-green-500 text-white hover:bg-green-600'
                    : currentQuestion?.type === 'structure' && currentQuestion?.questionID === question.ID
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-white hover:bg-gray-100'
                }`}
              >
                Question {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="mb-4 text-lg font-semibold">Conquêtes spatiales</h4>
          <div className="space-y-2">
            {questions?.conquete?.map((question: Question, index: number) => (
              <div 
                key={`scores_C${index}`}
                onClick={() => onQuestionClick('conquete', index, question.ID)}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  answeredQuestions.C.includes(question.ID)
                    ? currentQuestion?.type === 'conquete' && currentQuestion?.questionID === question.ID
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-green-500 text-white hover:bg-green-600'
                    : currentQuestion?.type === 'conquete' && currentQuestion?.questionID === question.ID
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-white hover:bg-gray-100'
                }`}
              >
                Question {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h4 className="mb-4 text-lg font-semibold">Rébus</h4>
          <div className="space-y-2">
            {questions?.rebus?.map((question: Question, index: number) => (
              <div 
                key={`scores_R${index}`}
                onClick={() => onQuestionClick('rebus', index, question.ID)}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  answeredQuestions.R.includes(question.ID)
                    ? currentQuestion?.type === 'rebus' && currentQuestion?.questionID === question.ID
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-green-500 text-white hover:bg-green-600'
                    : currentQuestion?.type === 'rebus' && currentQuestion?.questionID === question.ID
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-white hover:bg-gray-100'
                }`}
              >
                Rébus {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;