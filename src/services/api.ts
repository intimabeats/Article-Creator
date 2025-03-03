import { ArticleData, Question, Answer } from '../types';

// Simulação de API para desenvolvimento
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchQuestions = async (establishmentType: string): Promise<Question[]> => {
  await delay(1000); // Simula delay de rede
  
  // Perguntas base para qualquer estabelecimento
  const baseQuestions: Question[] = [
    {
      id: 'atmosphere',
      text: 'Como é a atmosfera/ambiente do local?',
      type: 'textarea',
      required: true
    },
    {
      id: 'highlights',
      text: 'Quais são os principais destaques do estabelecimento?',
      type: 'textarea',
      required: true
    },
    {
      id: 'clientele',
      text: 'Qual é o perfil do público que frequenta o local?',
      type: 'textarea',
      required: true
    },
    {
      id: 'accessibility',
      text: 'Como é a acessibilidade do local?',
      type: 'textarea',
      required: true
    }
  ];
  
  // Perguntas específicas por tipo de estabelecimento
  const specificQuestions: Record<string, Question[]> = {
    restaurant: [
      {
        id: 'cuisine',
        text: 'Qual é o tipo de culinária oferecida?',
        type: 'text',
        required: true
      },
      {
        id: 'signature_dishes',
        text: 'Quais são os pratos mais populares ou exclusivos?',
        type: 'textarea',
        required: true
      },
      {
        id: 'price_range',
        text: 'Qual é a faixa de preço do estabelecimento?',
        type: 'select',
        options: ['Econômico', 'Moderado', 'Caro', 'Luxuoso'],
        required: true
      },
      {
        id: 'service_quality',
        text: 'Como é a qualidade do atendimento?',
        type: 'textarea',
        required: true
      }
    ],
    cafe: [
      {
        id: 'coffee_quality',
        text: 'Como é a qualidade do café servido?',
        type: 'textarea',
        required: true
      },
      {
        id: 'food_options',
        text: 'Quais opções de comida são oferecidas?',
        type: 'textarea',
        required: true
      },
      {
        id: 'work_friendly',
        text: 'O local é adequado para trabalhar/estudar?',
        type: 'radio',
        options: ['Sim', 'Não', 'Parcialmente'],
        required: true
      }
    ],
    store: [
      {
        id: 'products',
        text: 'Quais são os principais produtos vendidos?',
        type: 'textarea',
        required: true
      },
      {
        id: 'price_quality',
        text: 'Como é a relação preço-qualidade dos produtos?',
        type: 'textarea',
        required: true
      },
      {
        id: 'exclusive_items',
        text: 'Existem itens exclusivos ou diferenciados?',
        type: 'textarea',
        required: true
      }
    ],
    hotel: [
      {
        id: 'room_quality',
        text: 'Como são os quartos em termos de conforto e limpeza?',
        type: 'textarea',
        required: true
      },
      {
        id: 'amenities',
        text: 'Quais comodidades o hotel oferece?',
        type: 'textarea',
        required: true
      },
      {
        id: 'location_convenience',
        text: 'Como é a localização em termos de conveniência?',
        type: 'textarea',
        required: true
      }
    ],
    attraction: [
      {
        id: 'experience',
        text: 'Como é a experiência geral da atração?',
        type: 'textarea',
        required: true
      },
      {
        id: 'best_time',
        text: 'Qual é o melhor horário para visitar?',
        type: 'text',
        required: true
      },
      {
        id: 'value_for_money',
        text: 'A atração oferece bom custo-benefício?',
        type: 'textarea',
        required: true
      }
    ]
  };
  
  // Retorna perguntas base + específicas para o tipo de estabelecimento
  return [...baseQuestions, ...(specificQuestions[establishmentType] || [])];
};

export const validateAnswers = async (answers: Answer[]): Promise<{
  isValid: boolean;
  missingInfo?: string[];
  additionalQuestions?: Question[];
}> => {
  await delay(800);
  
  // Verifica se há respostas muito curtas (menos de 20 caracteres)
  const shortAnswers = answers.filter(a => a.answer.length < 20);
  
  if (shortAnswers.length > 0) {
    return {
      isValid: false,
      missingInfo: shortAnswers.map(a => `Resposta muito curta para a pergunta ${a.questionId}`)
    };
  }
  
  // Se todas as respostas são adequadas, mas queremos mais detalhes em áreas específicas
  const needsMoreDetail = Math.random() > 0.7; // Simulação: 30% das vezes pede mais detalhes
  
  if (needsMoreDetail) {
    return {
      isValid: false,
      additionalQuestions: [
        {
          id: 'additional_detail',
          text: 'Poderia fornecer mais detalhes sobre a experiência sensorial do local (sons, aromas, texturas)?',
          type: 'textarea',
          required: true
        }
      ]
    };
  }
  
  return { isValid: true };
};

export const generateArticle = async (data: ArticleData): Promise<string> => {
  await delay(3000); // Simula o tempo de processamento para gerar o artigo
  
  // Aqui seria a chamada real para um serviço de IA para gerar o artigo
  // Por enquanto, vamos simular um artigo baseado nos dados fornecidos
  
  const { establishment, answers } = data;
  
  // Encontra respostas específicas (simulação)
  const findAnswer = (id: string) => {
    const answer = answers.find(a => a.questionId === id);
    return answer ? answer.answer : '';
  };
  
  const atmosphere = findAnswer('atmosphere');
  const highlights = findAnswer('highlights');
  
  // Gera um artigo simples baseado nas informações
  return `
    <h1>${establishment.name || 'Estabelecimento Incrível'}</h1>
    
    <p>
      ${establishment.description}
    </p>
    
    <h2>Ambiente e Atmosfera</h2>
    <p>
      ${atmosphere}
    </p>
    
    <h2>Destaques</h2>
    <p>
      ${highlights}
    </p>
    
    <p>
      Este estabelecimento é definitivamente um lugar que vale a pena conhecer. Com sua atmosfera única e ofertas especiais,
      proporciona uma experiência memorável para todos os visitantes.
    </p>
  `;
};

export const suggestImageRequirements = async (articleContent: string): Promise<{
  description: string;
  suggestions: { id: string; description: string }[];
}> => {
  await delay(1500);
  
  // Aqui seria uma análise do conteúdo do artigo para sugerir imagens relevantes
  // Por enquanto, vamos retornar sugestões genéricas
  
  return {
    description: "Para complementar seu artigo, recomendamos as seguintes fotos:",
    suggestions: [
      {
        id: "exterior",
        description: "Fachada do estabelecimento mostrando a entrada principal"
      },
      {
        id: "interior",
        description: "Ambiente interno mostrando a decoração e disposição do espaço"
      },
      {
        id: "highlight",
        description: "Foto do principal destaque mencionado no artigo"
      },
      {
        id: "detail",
        description: "Um detalhe único ou diferencial do estabelecimento"
      }
    ]
  };
};

export const optimizeSEO = async (
  articleContent: string, 
  establishmentType: string
): Promise<{
  keywords: string[];
  optimizedContent: string;
}> => {
  await delay(2000);
  
  // Aqui seria uma análise SEO real do conteúdo
  // Por enquanto, vamos simular keywords baseadas no tipo de estabelecimento
  
  const keywordsByType: Record<string, string[]> = {
    restaurant: ['restaurante', 'gastronomia', 'comida', 'culinária', 'chef', 'menu', 'jantar'],
    cafe: ['café', 'cafeteria', 'barista', 'grãos especiais', 'ambiente aconchegante', 'brunch'],
    store: ['loja', 'produtos', 'compras', 'exclusivo', 'coleção', 'tendências'],
    hotel: ['hospedagem', 'acomodação', 'suítes', 'conforto', 'viagem', 'estadia'],
    attraction: ['atração', 'passeio', 'turismo', 'experiência', 'diversão', 'visita']
  };
  
  const keywords = keywordsByType[establishmentType] || ['local', 'estabelecimento', 'visita', 'experiência'];
  
  // Simula otimização do conteúdo (na prática, seria um processo mais complexo)
  const optimizedContent = articleContent;
  
  return {
    keywords,
    optimizedContent
  };
};
