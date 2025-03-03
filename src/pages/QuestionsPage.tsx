import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, Loader as LoaderIcon, Info } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { useArticle } from '../context/ArticleContext';
import { fetchQuestions, validateAnswers } from '../services/api';
import { Question, Answer } from '../types';

const QuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { articleData, addAnswer, updateAnswers } = useArticle();
  const questionsEndRef = useRef<HTMLDivElement>(null);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>(articleData.answers || []);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [additionalQuestions, setAdditionalQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showTips, setShowTips] = useState(false);
  
  useEffect(() => {
    const loadQuestions = async () => {
      if (!articleData.establishment.type) {
        navigate('/establishment');
        return;
      }
      
      try {
        const fetchedQuestions = await fetchQuestions(articleData.establishment.type);
        setQuestions(fetchedQuestions);
        setLoading(false);
        
        // Calcular progresso inicial
        calculateProgress(fetchedQuestions, answers);
      } catch (err) {
        setError('Erro ao carregar perguntas. Por favor, tente novamente.');
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [articleData.establishment.type, navigate]);
  
  // Calcular progresso
  const calculateProgress = (allQuestions: Question[], currentAnswers: Answer[]) => {
    const totalRequired = allQuestions.filter(q => q.required).length;
    const answeredRequired = currentAnswers.filter(a => {
      const question = allQuestions.find(q => q.id === a.questionId);
      return question?.required && a.answer.trim() !== '';
    }).length;
    
    const newProgress = totalRequired > 0 ? Math.round((answeredRequired / totalRequired) * 100) : 0;
    setProgress(newProgress);
  };
  
  // Atualizar progresso quando as respostas mudam
  useEffect(() => {
    calculateProgress([...questions, ...additionalQuestions], answers);
  }, [answers, questions, additionalQuestions]);
  
  // Rolar para novas perguntas quando adicionadas
  useEffect(() => {
    if (additionalQuestions.length > 0 && questionsEndRef.current) {
      questionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [additionalQuestions]);
  
  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId, answer: value };
    } else {
      newAnswers.push({ questionId, answer: value });
    }
    
    setAnswers(newAnswers);
  };
  
  const getAnswerForQuestion = (questionId: string): string => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer ? answer.answer : '';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidating(true);
    setError('');
    
    // Check if all required questions are answered
    const allQuestionsToCheck = [...questions, ...additionalQuestions];
    const requiredQuestions = allQuestionsToCheck.filter(q => q.required);
    
    const unansweredQuestions = requiredQuestions.filter(q => {
      const answer = answers.find(a => a.questionId === q.id);
      return !answer || answer.answer.trim() === '';
    });
    
    if (unansweredQuestions.length > 0) {
      setError('Por favor, responda todas as perguntas obrigatórias antes de continuar.');
      setValidating(false);
      return;
    }
    
    try {
      const validation = await validateAnswers(answers);
      
      if (!validation.isValid) {
        if (validation.missingInfo) {
          setError(validation.missingInfo.join('\n'));
        }
        
        if (validation.additionalQuestions) {
          setAdditionalQuestions(validation.additionalQuestions);
        }
        
        setValidating(false);
        return;
      }
      
      // Save answers to context
      answers.forEach(answer => addAnswer(answer));
      
      // Navigate to next page
      navigate('/images');
    } catch (err) {
      setError('Erro ao validar respostas. Por favor, tente novamente.');
      setValidating(false);
    }
  };
  
  // Agrupar perguntas por etapas
  const getQuestionsForCurrentStep = () => {
    const allQuestions = [...questions, ...additionalQuestions];
    
    // Dividir em grupos de 3-4 perguntas
    const questionsPerStep = 3;
    const startIndex = (currentStep - 1) * questionsPerStep;
    const endIndex = startIndex + questionsPerStep;
    
    return allQuestions.slice(startIndex, endIndex);
  };
  
  const totalSteps = Math.ceil((questions.length + additionalQuestions.length) / 3);
  const currentQuestions = getQuestionsForCurrentStep();
  const isLastStep = currentStep === totalSteps;
  
  const goToNextStep = () => {
    // Verificar se todas as perguntas obrigatórias da etapa atual foram respondidas
    const unansweredRequired = currentQuestions.filter(q => {
      return q.required && (!getAnswerForQuestion(q.id) || getAnswerForQuestion(q.id).trim() === '');
    });
    
    if (unansweredRequired.length > 0) {
      setError('Por favor, responda todas as perguntas obrigatórias desta etapa antes de continuar.');
      return;
    }
    
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const goToPreviousStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (loading) {
    return <Loader message="Preparando perguntas personalizadas..." description="Estamos analisando o tipo de estabelecimento para gerar as perguntas mais relevantes." />;
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Perguntas sobre o Estabelecimento</h1>
        <p className="text-lg text-gray-600">
          Responda às perguntas abaixo para coletar informações detalhadas sobre <span className="font-medium text-gray-800">{articleData.establishment.name || 'o estabelecimento'}</span>.
        </p>
        
        {/* Barra de progresso */}
        <div className="mt-6 mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-medium text-gray-700">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Etapa {currentStep} de {totalSteps}</span>
            <button 
              onClick={() => setShowTips(!showTips)} 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <HelpCircle className="h-3 w-3 mr-1" />
              {showTips ? 'Ocultar dicas' : 'Ver dicas'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card 
            variant="elevated" 
            className="overflow-visible"
            padding="lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentQuestions.map((question) => (
                <div key={question.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <QuestionItem
                    question={question}
                    value={getAnswerForQuestion(question.id)}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                </div>
              ))}
              
              {additionalQuestions.length > 0 && currentStep === totalSteps && (
                <div className="pt-4 border-t border-gray-200" ref={questionsEndRef}>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Perguntas adicionais</h4>
                        <p className="text-yellow-700 text-sm">
                          Precisamos de mais algumas informações para criar um artigo completo. Por favor, responda às perguntas abaixo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    {error.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    icon={<ArrowLeft className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Anterior
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/establishment')}
                    icon={<ArrowLeft className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Voltar
                  </Button>
                )}
                
                {isLastStep ? (
                  <Button 
                    type="submit" 
                    disabled={validating}
                    loading={validating}
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={goToNextStep}
                    icon={<ArrowRight className="h-4 w-4" />}
                    iconPosition="right"
                  >
                    Próximo
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
        
        <div className="space-y-6">
          {showTips && (
            <Card 
              title="Dicas para respostas eficazes" 
              variant="outlined"
              className="bg-blue-50 border-blue-200"
            >
              <ul className="space-y-3 text-gray-700">
                <TipItem>
                  Seja específico e detalhado em suas respostas
                </TipItem>
                <TipItem>
                  Inclua exemplos concretos sempre que possível
                </TipItem>
                <TipItem>
                  Mencione aspectos únicos ou diferenciais do estabelecimento
                </TipItem>
                <TipItem>
                  Considere a perspectiva do leitor que busca informações úteis
                </TipItem>
                <TipItem>
                  Evite respostas muito curtas ou genéricas
                </TipItem>
              </ul>
            </Card>
          )}
          
          <Card 
            title={`Sobre ${articleData.establishment.name || 'o estabelecimento'}`}
            variant="outlined"
          >
            <div className="text-gray-600">
              <p className="mb-3 italic">"{articleData.establishment.description.substring(0, 150)}..."</p>
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Tipo:</span>
                {getEstablishmentTypeLabel(articleData.establishment.type || '')}
              </div>
            </div>
          </Card>
          
          <Card 
            title="Seu progresso" 
            variant="outlined"
          >
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Descrição do Estabelecimento</h4>
                  <p className="text-sm text-gray-500">Concluído</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <LoaderIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Perguntas</h4>
                  <p className="text-sm text-gray-500">Em andamento ({progress}%)</p>
                </div>
              </div>
              
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-500 font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Imagens</h4>
                  <p className="text-sm text-gray-500">Próxima etapa</p>
                </div>
              </div>
              
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-500 font-medium">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Links</h4>
                  <p className="text-sm text-gray-500">Pendente</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Componente para renderizar um item de pergunta
const QuestionItem: React.FC<{
  question: Question;
  value: string;
  onChange: (value: string) => void;
}> = ({ question, value, onChange }) => {
  return (
    <div>
      <div className="mb-3">
        <label htmlFor={question.id} className="block text-base font-medium text-gray-800 mb-1">
          {question.text} {question.required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-500">
          {getQuestionHint(question.id)}
        </p>
      </div>
      
      {question.type === 'textarea' ? (
        <TextArea
          id={question.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
          rows={4}
          className="mt-1"
        />
      ) : question.type === 'select' && question.options ? (
        <div className="mt-1">
          <select
            id={question.id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={question.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione uma opção</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : question.type === 'radio' && question.options ? (
        <div className="mt-1 space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                id={`${question.id}-${option}`}
                type="radio"
                name={question.id}
                value={option}
                checked={value === option}
                onChange={() => onChange(option)}
                required={question.required}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`${question.id}-${option}`} className="ml-2 text-gray-700">
                {option}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <Input
          id={question.id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
          className="mt-1"
        />
      )}
      
      {value && value.length < 20 && question.type === 'textarea' && (
        <p className="mt-1 text-xs text-amber-600">
          Recomendamos respostas mais detalhadas para obter melhores resultados.
        </p>
      )}
    </div>
  );
};

// Componente para itens de dicas
const TipItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <li className="flex items-start">
      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-0.5">
        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span>{children}</span>
    </li>
  );
};

// Função para obter dicas específicas para cada pergunta
const getQuestionHint = (questionId: string): string => {
  const hints: Record<string, string> = {
    atmosphere: "Descreva a iluminação, decoração, música ambiente, nível de ruído, etc.",
    highlights: "Mencione características únicas, pratos especiais, produtos exclusivos ou serviços diferenciados.",
    clientele: "Observe o perfil dos clientes: faixa etária, estilo, se são turistas ou locais, etc.",
    accessibility: "Considere acesso para cadeirantes, estacionamento, transporte público, etc.",
    cuisine: "Especifique o tipo de culinária e influências gastronômicas.",
    signature_dishes: "Liste os pratos mais recomendados ou exclusivos do local.",
    coffee_quality: "Avalie sabor, variedade, apresentação e métodos de preparo.",
    work_friendly: "Considere tomadas disponíveis, Wi-Fi, nível de ruído, conforto das mesas, etc.",
    room_quality: "Avalie limpeza, conforto, tamanho, amenidades e estado de conservação.",
    experience: "Descreva como você se sentiu durante a visita e o que tornou a experiência memorável.",
    additional_detail: "Foque em detalhes sensoriais como aromas, texturas, sons e sensações que o local proporciona."
  };
  
  return hints[questionId] || "Seja específico e detalhado em sua resposta.";
};

// Função para obter o label do tipo de estabelecimento
const getEstablishmentTypeLabel = (type: string): React.ReactNode => {
  const types: Record<string, { label: string, icon: React.ReactNode }> = {
    restaurant: { 
      label: "Restaurante", 
      icon: <UtensilsCrossed className="h-4 w-4 text-orange-600" /> 
    },
    cafe: { 
      label: "Café", 
      icon: <Coffee className="h-4 w-4 text-brown-600" /> 
    },
    store: { 
      label: "Loja", 
      icon: <Store className="h-4 w-4 text-indigo-600" /> 
    },
    hotel: { 
      label: "Hotel", 
      icon: <Building className="h-4 w-4 text-blue-600" /> 
    },
    attraction: { 
      label: "Atração Turística", 
      icon: <Landmark className="h-4 w-4 text-green-600" /> 
    }
  };
  
  const typeInfo = types[type] || { label: "Estabelecimento", icon: null };
  
  return (
    <div className="flex items-center">
      {typeInfo.icon && <span className="mr-1">{typeInfo.icon}</span>}
      <span>{typeInfo.label}</span>
    </div>
  );
};

export default QuestionsPage;
