import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ArticleData, Establishment, Answer, ArticleImage, ExternalLink } from '../types';

interface ArticleContextType {
  articleData: ArticleData;
  setEstablishment: (establishment: Establishment) => void;
  addAnswer: (answer: Answer) => void;
  updateAnswers: (answers: Answer[]) => void;
  addImage: (image: ArticleImage) => void;
  removeImage: (id: string) => void;
  addLink: (link: ExternalLink) => void;
  removeLink: (id: string) => void;
  setKeywords: (keywords: string[]) => void;
  setContent: (content: string) => void;
  resetArticleData: () => void;
}

const initialArticleData: ArticleData = {
  establishment: { description: '' },
  answers: [],
  images: [],
  links: [],
  keywords: [],
};

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articleData, setArticleData] = useState<ArticleData>(initialArticleData);

  const setEstablishment = (establishment: Establishment) => {
    setArticleData(prev => ({
      ...prev,
      establishment,
    }));
  };

  const addAnswer = (answer: Answer) => {
    setArticleData(prev => {
      // Check if this question was already answered
      const existingIndex = prev.answers.findIndex(a => a.questionId === answer.questionId);
      
      if (existingIndex >= 0) {
        // Update existing answer
        const updatedAnswers = [...prev.answers];
        updatedAnswers[existingIndex] = answer;
        return {
          ...prev,
          answers: updatedAnswers,
        };
      } else {
        // Add new answer
        return {
          ...prev,
          answers: [...prev.answers, answer],
        };
      }
    });
  };

  const updateAnswers = (answers: Answer[]) => {
    setArticleData(prev => ({
      ...prev,
      answers,
    }));
  };

  const addImage = (image: ArticleImage) => {
    setArticleData(prev => ({
      ...prev,
      images: [...prev.images, image],
    }));
  };

  const removeImage = (id: string) => {
    setArticleData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id),
    }));
  };

  const addLink = (link: ExternalLink) => {
    setArticleData(prev => ({
      ...prev,
      links: [...prev.links, link],
    }));
  };

  const removeLink = (id: string) => {
    setArticleData(prev => ({
      ...prev,
      links: prev.links.filter(link => link.id !== id),
    }));
  };

  const setKeywords = (keywords: string[]) => {
    setArticleData(prev => ({
      ...prev,
      keywords,
    }));
  };

  const setContent = (content: string) => {
    setArticleData(prev => ({
      ...prev,
      content,
    }));
  };

  const resetArticleData = () => {
    setArticleData(initialArticleData);
  };

  return (
    <ArticleContext.Provider
      value={{
        articleData,
        setEstablishment,
        addAnswer,
        updateAnswers,
        addImage,
        removeImage,
        addLink,
        removeLink,
        setKeywords,
        setContent,
        resetArticleData,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticle = () => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticle must be used within an ArticleProvider');
  }
  return context;
};
