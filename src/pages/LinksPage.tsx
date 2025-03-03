import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Plus, X, ExternalLink, CheckCircle, AlertCircle, ArrowLeft, ArrowRight, Info, Camera, Globe } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useArticle } from '../context/ArticleContext';
import { ExternalLink as ExternalLinkType } from '../types';

const LinksPage: React.FC = () => {
  const navigate = useNavigate();
  const { articleData, addLink, removeLink } = useArticle();
  
  const [links, setLinks] = useState<ExternalLinkType[]>(articleData.links || []);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Calcular progresso
  useEffect(() => {
    // Consideramos que ter pelo menos 2 links é o ideal
    const targetLinks = 2;
    const currentLinks = links.length;
    const newProgress = Math.min(Math.round((currentLinks / targetLinks) * 100), 100);
    setProgress(newProgress);
  }, [links]);
  
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleAddLink = () => {
    if (!linkName.trim()) {
      setError('Por favor, informe o nome do link.');
      return;
    }
    
    if (!linkUrl.trim()) {
      setError('Por favor, informe a URL do link.');
      return;
    }
    
    // Basic URL validation
    if (!validateUrl(linkUrl)) {
      setError('Por favor, insira uma URL válida (incluindo http:// ou https://).');
      return;
    }
    
    if (isEditing && editingId) {
      // Atualizar link existente
      const updatedLinks = links.map(link => 
        link.id === editingId 
          ? { ...link, name: linkName, url: linkUrl } 
          : link
      );
      
      setLinks(updatedLinks);
      
      // Atualizar no contexto
      removeLink(editingId);
      addLink({ id: editingId, name: linkName, url: linkUrl });
      
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Adicionar novo link
      const newLink: ExternalLinkType = {
        id: Date.now().toString(),
        name: linkName,
        url: linkUrl
      };
      
      // Add to context
      addLink(newLink);
      
      // Update local state
      setLinks(prev => [...prev, newLink]);
    }
    
    // Reset form
    setLinkName('');
    setLinkUrl('');
    setError('');
  };
  
  const handleEditLink = (link: ExternalLinkType) => {
    setLinkName(link.name);
    setLinkUrl(link.url);
    setIsEditing(true);
    setEditingId(link.id);
    setError('');
  };
  
  const handleCancelEdit = () => {
    setLinkName('');
    setLinkUrl('');
    setIsEditing(false);
    setEditingId(null);
    setError('');
  };
  
  const handleRemoveLink = (id: string) => {
    removeLink(id);
    setLinks(prev => prev.filter(link => link.id !== id));
    
    // Se estiver editando este link, cancelar a edição
    if (editingId === id) {
      handleCancelEdit();
    }
  };
  
  const handleContinue = () => {
    navigate('/article');
  };
  
  // Sugerir links com base no tipo de estabelecimento
  const getSuggestedLinks = (): { name: string; description: string }[] => {
    const type = articleData.establishment.type || '';
    const name = articleData.establishment.name || 'o estabelecimento';
    
    const commonSuggestions = [
      {
        name: `Site oficial de ${name}`,
        description: 'Link para o site oficial do estabelecimento'
      },
      {
        name: 'Redes sociais',
        description: 'Instagram, Facebook ou outras redes sociais do estabelecimento'
      },
      {
        name: 'Google Maps',
        description: 'Link para a localização no Google Maps'
      }
    ];
    
    const specificSuggestions: Record<string, { name: string; description: string }[]> = {
      restaurant: [
        {
          name: 'Menu online',
          description: 'Link para o cardápio completo online'
        },
        {
          name: 'Reservas',
          description: 'Página para fazer reservas online'
        }
      ],
      hotel: [
        {
          name: 'Booking.com',
          description: 'Link para reservas no Booking.com'
        },
        {
          name: 'TripAdvisor',
          description: 'Avaliações no TripAdvisor'
        }
      ],
      attraction: [
        {
          name: 'Ingressos online',
          description: 'Link para compra de ingressos'
        },
        {
          name: 'Guia turístico',
          description: 'Informações adicionais sobre a atração'
        }
      ]
    };
    
    return [...commonSuggestions, ...(specificSuggestions[type] || [])];
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Adicionar Links de Referência</h1>
        <p className="text-lg text-gray-600">
          Adicione links relevantes para enriquecer seu artigo e melhorar o SEO.
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
            <span>Etapa 4 de 4</span>
            <span>{links.length} links adicionados</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Formulário de adição de links */}
          <Card 
            title={isEditing ? "Editar Link" : "Adicionar Novo Link"} 
            variant="elevated"
            padding="lg"
          >
            <div className="space-y-4">
              <Input
                id="link-name"
                label="Nome do Link"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                placeholder="Ex: Site Oficial do Restaurante"
                required
              />
              
              <Input
                id="link-url"
                label="URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="Ex: https://www.restaurante.com.br"
                required
              />
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                {isEditing && (
                  <Button 
                    onClick={handleCancelEdit}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                )}
                <Button 
                  onClick={handleAddLink}
                  icon={isEditing ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  iconPosition="left"
                >
                  {isEditing ? 'Atualizar Link' : 'Adicionar Link'}
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Links adicionados */}
          <Card 
            title="Links Adicionados" 
            variant="elevated"
            headerAction={
              links.length > 0 ? (
                <span className="text-sm text-gray-500">
                  {links.length} {links.length === 1 ? 'link' : 'links'}
                </span>
              ) : null
            }
          >
            {links.length > 0 ? (
              <div className="space-y-3">
                {links.map((link) => (
                  <div 
                    key={link.id} 
                    className="flex items-center justify-between p-4 border rounded-md hover:border-blue-300 transition-colors bg-white"
                  >
                    <div className="flex items-center overflow-hidden">
                      <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                        <LinkIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{link.name}</h4>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center truncate"
                        >
                          <span className="truncate">{link.url}</span>
                          <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center ml-4 space-x-2">
                      <button
                        onClick={() => handleEditLink(link)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        aria-label="Editar link"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                        aria-label="Remover link"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">
                  Nenhum link adicionado ainda
                </p>
                <p className="text-sm text-gray-500">
                  Adicione links para enriquecer seu artigo e melhorar o SEO
                </p>
              </div>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          {/* Sugestões de links */}
          <Card 
            title="Sugestões de Links" 
            variant="outlined"
            className="bg-blue-50 border-blue-200"
          >
            <div className="space-y-3">
              {getSuggestedLinks().map((suggestion, index) => (
                <div key={index} className="bg-white p-3 rounded-md border border-blue-100">
                  <h4 className="font-medium text-gray-900 text-sm">{suggestion.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </Card>
          
          <Card 
            title="Por que adicionar links?" 
            variant="outlined"
          >
            <div className="space-y-3 text-gray-600">
              <p>
                Links relevantes melhoram a credibilidade do seu artigo e fornecem recursos adicionais para os leitores.
              </p>
              <p>
                Além disso, links externos de qualidade são um fator importante para o SEO, ajudando a melhorar o posicionamento nos mecanismos de busca.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-4">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    Certifique-se de que os links são relevantes para o conteúdo do seu artigo e direcionam para sites confiáveis.
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
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Imagens</h4>
                  <p className="text-sm text-gray-500">Concluído</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Links</h4>
                  <p className="text-sm text-gray-500">Em andamento ({progress}%)</p>
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
          onClick={() => navigate('/images')}
          icon={<ArrowLeft className="h-4 w-4" />}
          iconPosition="left"
        >
          Voltar
        </Button>
        <Button 
          onClick={handleContinue}
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="right"
          variant="primary"
        >
          Finalizar e Ver Artigo
        </Button>
      </div>
    </div>
  );
};

export default LinksPage;
