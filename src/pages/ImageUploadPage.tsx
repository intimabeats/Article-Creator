import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { useArticle } from '../context/ArticleContext';
import { suggestImageRequirements, generateArticle } from '../services/api';
import { ArticleImage } from '../types';

const ImageUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { articleData, addImage, removeImage, setContent } = useArticle();
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; description: string }[]>([]);
  const [description, setDescription] = useState('');
  const [currentImages, setCurrentImages] = useState<ArticleImage[]>(articleData.images || []);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [currentImageFile, setCurrentImageFile] = useState<File | null>(null);
  const [currentImageDescription, setCurrentImageDescription] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const loadImageRequirements = async () => {
      if (!articleData.establishment.description || articleData.answers.length === 0) {
        navigate('/questions');
        return;
      }
      
      try {
        // First, generate the article content if not already done
        if (!articleData.content) {
          setGenerating(true);
          const content = await generateArticle(articleData);
          setContent(content);
          setGenerating(false);
        }
        
        // Then get image suggestions based on the article
        const { suggestions: imageSuggestions, description: suggestionDescription } = 
          await suggestImageRequirements(articleData.content || '');
        
        setSuggestions(imageSuggestions);
        setDescription(suggestionDescription);
        setLoading(false);
        
        // Calcular progresso inicial
        calculateProgress(imageSuggestions, currentImages);
      } catch (err) {
        setError('Erro ao carregar requisitos de imagem. Por favor, tente novamente.');
        setLoading(false);
      }
    };
    
    loadImageRequirements();
  }, [articleData, navigate, setContent]);
  
  // Calcular progresso
  const calculateProgress = (allSuggestions: { id: string; description: string }[], images: ArticleImage[]) => {
    const totalSuggestions = allSuggestions.length;
    const uploadedImages = images.length;
    
    const newProgress = totalSuggestions > 0 ? Math.round((uploadedImages / totalSuggestions) * 100) : 0;
    setProgress(Math.min(newProgress, 100));
  };
  
  // Atualizar progresso quando as imagens mudam
  useEffect(() => {
    calculateProgress(suggestions, currentImages);
  }, [currentImages, suggestions]);
  
  const handleImageSelect = (id: string) => {
    setCurrentImageId(id);
    setCurrentImageDescription('');
    setCurrentImageFile(null);
    setError('');
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF).');
      return;
    }
    
    // Verificar tamanho do arquivo (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('O arquivo é muito grande. Por favor, selecione uma imagem com menos de 10MB.');
      return;
    }
    
    setCurrentImageFile(file);
    setError('');
    
    // Sugerir descrição baseada no nome do arquivo
    if (!currentImageDescription) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extensão
      const formattedName = fileName
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      setCurrentImageDescription(formattedName);
    }
  };
  
  // Handlers para drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleImageUpload = () => {
    if (!currentImageId || !currentImageFile || !currentImageDescription) {
      setError('Por favor, selecione uma imagem e forneça uma descrição.');
      return;
    }
    
    // In a real app, we would upload the image to a server here
    // For this demo, we'll create a local URL
    const imageUrl = URL.createObjectURL(currentImageFile);
    
    const newImage: ArticleImage = {
      id: currentImageId,
      url: imageUrl,
      description: currentImageDescription,
      alt: currentImageDescription
    };
    
    // Add to context
    addImage(newImage);
    
    // Update local state
    setCurrentImages(prev => [...prev, newImage]);
    setCurrentImageId(null);
    setCurrentImageFile(null);
    setCurrentImageDescription('');
  };
  
  const handleRemoveImage = (id: string) => {
    removeImage(id);
    setCurrentImages(prev => prev.filter(img => img.id !== id));
  };
  
  const handleContinue = () => {
    if (currentImages.length < 1) {
      setError('Por favor, adicione pelo menos uma imagem antes de continuar.');
      return;
    }
    
    navigate('/links');
  };
  
  if (loading || generating) {
    return (
      <Loader 
        message={generating ? "Gerando artigo..." : "Analisando artigo para sugerir imagens..."} 
        description={generating 
          ? "Estamos processando todas as informações coletadas para criar um artigo de alta qualidade." 
          : "Estamos identificando quais imagens serão mais relevantes para complementar seu artigo."
        }
        variant={generating ? "article" : "upload"}
      />
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Adicionar Imagens</h1>
        <p className="text-lg text-gray-600">
          {description}
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
            <span>Etapa 3 de 4</span>
            <span>{currentImages.length} de {suggestions.length} imagens adicionadas</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Seleção de tipo de imagem */}
          <Card 
            title="Imagens Sugeridas" 
            subtitle="Selecione o tipo de imagem que deseja adicionar"
            variant="elevated"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestions.map((suggestion) => {
                const isUploaded = currentImages.some(img => img.id === suggestion.id);
                const isSelected = currentImageId === suggestion.id;
                
                return (
                  <button
                    key={suggestion.id}
                    onClick={() => handleImageSelect(suggestion.id)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : isUploaded
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    disabled={isUploaded}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-full mr-3 ${
                        isUploaded ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {isUploaded ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className={`font-medium ${isUploaded ? 'text-green-700' : 'text-gray-800'}`}>
                          {suggestion.description}
                        </p>
                        <p className="text-xs mt-1 text-gray-500">
                          {isUploaded 
                            ? 'Imagem adicionada' 
                            : isSelected 
                            ? 'Selecionado para upload' 
                            : 'Clique para selecionar'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
          
          {/* Upload de imagem */}
          {currentImageId && (
            <Card 
              title="Upload de Imagem" 
              subtitle={suggestions.find(s => s.id === currentImageId)?.description || ''}
              variant="elevated"
            >
              <div className="space-y-4">
                <div 
                  className={`border-2 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} rounded-lg p-6 text-center`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {currentImageFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <img
                          src={URL.createObjectURL(currentImageFile)}
                          alt="Preview"
                          className="max-h-60 max-w-full object-contain rounded-md"
                        />
                      </div>
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <p className="bg-gray-100 px-3 py-1 rounded-full">
                          {currentImageFile.name} ({(currentImageFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentImageFile(null)}
                        className="text-red-600 text-sm flex items-center justify-center hover:text-red-800"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-blue-100 rounded-full">
                          <Camera className="h-10 w-10 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">Arraste e solte sua imagem aqui</p>
                        <p className="text-gray-500 mt-1">ou</p>
                      </div>
                      <div className="flex justify-center">
                        <label
                          htmlFor="file-upload"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                        >
                          Selecionar arquivo
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                    </div>
                  )}
                </div>
                
                <Input
                  id="image-description"
                  label="Descrição da Imagem"
                  value={currentImageDescription}
                  onChange={(e) => setCurrentImageDescription(e.target.value)}
                  placeholder="Descreva o que esta imagem mostra"
                  required
                />
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleImageUpload}
                    disabled={!currentImageFile || !currentImageDescription}
                    icon={<Upload className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Adicionar Imagem
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Imagens adicionadas */}
          {currentImages.length > 0 && (
            <Card 
              title="Imagens Adicionadas" 
              variant="elevated"
              headerAction={
                <span className="text-sm text-gray-500">
                  {currentImages.length} de {suggestions.length}
                </span>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentImages.map((image) => (
                  <div key={image.id} className="border rounded-md overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {suggestions.find(s => s.id === image.id)?.description}
                        </h4>
                        <button
                          onClick={() => handleRemoveImage(image.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          aria-label="Remover imagem"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{image.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card 
            title="Dicas para fotos eficazes" 
            variant="outlined"
            className="bg-blue-50 border-blue-200"
          >
            <ul className="space-y-3 text-gray-700">
              <TipItem>
                Tire fotos com boa iluminação para mostrar detalhes
              </TipItem>
              <TipItem>
                Capture ângulos que mostrem o ambiente de forma abrangente
              </TipItem>
              <TipItem>
                Inclua detalhes únicos ou diferenciais do estabelecimento
              </TipItem>
              <TipItem>
                Evite incluir pessoas reconhecíveis nas fotos sem permissão
              </TipItem>
              <TipItem>
                Prefira orientação paisagem (horizontal) para melhor visualização
              </TipItem>
            </ul>
          </Card>
          
          <Card 
            title="Por que as imagens são importantes?" 
            variant="outlined"
          >
            <div className="space-y-3 text-gray-600">
              <p>
                Imagens de qualidade aumentam significativamente o engajamento dos leitores e o tempo de permanência na página.
              </p>
              <p>
                Estudos mostram que artigos com imagens relevantes recebem 94% mais visualizações do que artigos sem imagens.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    Certifique-se de que você tem permissão para fotografar o estabelecimento. Alguns locais podem ter políticas específicas sobre fotografia.
                  </p>
                </div>
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
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Perguntas</h4>
                  <p className="text-sm text-gray-500">Concluído</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Camera className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Imagens</h4>
                  <p className="text-sm text-gray-500">Em andamento ({progress}%)</p>
                </div>
              </div>
              
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <span className="text-gray-500 font-medium">4</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Links</h4>
                  <p className="text-sm text-gray-500">Próxima etapa</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/questions')}
          icon={<ArrowLeft className="h-4 w-4" />}
          iconPosition="left"
        >
          Voltar
        </Button>
        <Button 
          onClick={handleContinue}
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="right"
        >
          Continuar
        </Button>
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

export default ImageUploadPage;
