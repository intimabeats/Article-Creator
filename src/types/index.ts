export interface Establishment {
  description: string;
  name?: string;
  type?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'select' | 'radio';
  options?: string[];
  required: boolean;
}

export interface Answer {
  questionId: string;
  answer: string;
}

export interface ArticleImage {
  id: string;
  description: string;
  url: string;
  alt: string;
}

export interface ExternalLink {
  id: string;
  name: string;
  url: string;
}

export interface ArticleData {
  establishment: Establishment;
  answers: Answer[];
  images: ArticleImage[];
  links: ExternalLink[];
  keywords: string[];
  content?: string;
}
