import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Coffee, UtensilsCrossed, Building, Landmark, MapPin, Info, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import Input from '../components/Input';
import { useArticle } from '../context/ArticleContext';

const EstablishmentDescriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { articleData, setEstablishment } = useArticle();
  
  const [description, setDescription] = useState(articleData.establishment.description || '');
  const [name, setName] = useState(articleData.establishment.name || '');
  const [type, setType] = useState(articleData.establishment.type || '');
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(description.length);

  const establishmentTypes = [
    { id: 'restaurant', name: 'Restaurante', icon: <UtensilsCrossed className="h-5 w-5" /> },
    { id: 'cafe', name: 'Café', icon: <Coffee className="h-5 w-5" /> },
    { id: 'store', name: 'Loja', icon: <Store className="h-5 w-5" /> },
    { id: 'hotel', name: 'Hotel', icon: <Building className="h-5 w-5" /> },
    { id: 'attraction', name: 'Atração Turística', icon: <Landmark className="h-5 w-5" /> },
  ];

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setCharCount(e.target.value.length);
    if (error && e.target.value.trim().length >= 50) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (description.trim().length < 50) {
      setError('Por favor, forneça uma descrição mais detalhada do estabelecimento (mínimo 50 caracteres).');
      return;
    }
    
    if (!type) {
      setError('Por favor, selecione o tipo de estabelecimento.');
      return;
    }

    if (!name.trim()) {
      setError('Por favor, informe o nome do estabelecimento.');
      return;
    }
    
    setEstablishment({
      description,
      name,
      type,
    });
    
    navigate('/questions');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Descreva o Estabelecimento</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comece fornecendo informações básicas sobre o local que você está visitando. Isso nos ajudará a gerar perguntas relevantes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card 
            variant="elevated" 
            className="overflow-visible"
            padding="lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="establishment-name"
                label="Nome do Estabelecimento"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Restaurante Sabor & Arte"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Estabelecimento <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {establishmentTypes.map((estType) => (
                    <button
                      key={estType.id}
                      type="button"
                      className={`flex items-center p-3 border rounded-md transition-all ${
                        type === estType.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                          : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                      onClick={() => {
                        setType(estType.id);
                        if (error && error.includes('tipo de estabelecimento')) {
                          setError('');
                        }
                      }}
                    >
                      <span className="mr-2 bg-white p-1.5 rounded-full shadow-sm">{estType.icon}</span>
                      <span>{estType.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <TextArea
                  id="establishment-description"
                  label="Descrição Geral"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Descreva o estabelecimento em detalhes. Inclua sua primeira impressão, localização, aparência externa e interna, etc."
                  rows={6}
                  required
                />
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">
                    {charCount < 50 ? (
                      <span className="text-red-500">Mínimo de 50 caracteres (faltam {50 - charCount})</span>
                    ) : (
                      <span>Caracteres: {charCount}</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Recomendado: 150-300 caracteres
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
                  <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Continuar
                </Button>
              </div>
            </form>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card 
            title="Dicas para uma boa descrição" 
            variant="outlined"
            className="bg-blue-50 border-blue-200"
          >
            <ul className="space-y-3 text-gray-700">
              <TipItem>
                Inclua detalhes sobre a localização e o ambiente
              </TipItem>
              <TipItem>
                Descreva a aparência externa e interna do estabelecimento
              </TipItem>
              <TipItem>
                Mencione sua primeira impressão ao entrar no local
              </TipItem>
              <TipItem>
                Observe detalhes como iluminação, decoração, música ambiente
              </TipItem>
              <TipItem>
                Seja objetivo, mas inclua detalhes sensoriais (sons, aromas, etc.)
              </TipItem>
            </ul>
          </Card>
          
          <Card 
            title="Por que isso é importante?" 
            variant="outlined"
          >
            <p className="text-gray-600 mb-4">
              Uma boa descrição inicial nos ajuda a gerar perguntas mais relevantes e específicas para o tipo de estabelecimento que você está visitando.
            </p>
            <p className="text-gray-600">
              Isso resultará em um artigo final mais completo e útil para os leitores que buscam informações sobre este local.
            </p>
          </Card>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-3">
              <MapPin className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Está no local agora?</h3>
            </div>
            <p className="mb-4 text-blue-100">
              Aproveite para observar todos os detalhes enquanto está no estabelecimento. Isso tornará seu artigo mais autêntico e valioso.
            </p>
          </div>
        </div>
      </div>
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

export default EstablishmentDescriptionPage;
