
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Copy, CheckCircle, Tag, Share2, Edit, Home, Printer, BookOpen, ArrowLeft, AlertCircle, Star, ExternalLink, FileText, Clock, Image, Link as LinkIcon } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { useArticle } from '../context/ArticleContext';
import { optimizeSEO } from '../services/api';

const FinalArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { articleData, resetArticleData } = useArticle();
  const articleRef = useRef<HTMLDivElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  
  useEffect(() => {
    const optimizeArticle = async () => {
      if (!articleData.content || !articleData.establishment.type) {
        navigate('/links');
        return;
      }
      
      try {
        const { optimizedContent: seoContent, keywords: seoKeywords } = 
          await optimizeSEO(articleData.content, articleData.establishment.type);
        
        setOptimizedContent(seoContent);
        setKeywords(seoKeywords);
        setLoading(false);
      } catch (err) {
        console.error('Error optimizing article:', err);
        setError('Ocorreu um erro ao otimizar o artigo. Estamos usando a versão não otimizada.');
        setLoading(false);
        // Fallback to non-optimized content
        setOptimizedContent(articleData.content || '');
      }
    };
    
    optimizeArticle();
  }, [articleData, navigate]);
  
  const handleCopyArticle = () => {
    if (activeTab === 'preview') {
      // Copiar versão formatada (HTML)
      if (articleRef.current) {
        const range = document.createRange();
        range.selectNode(articleRef.current);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        document.execCommand('copy');
        window.getSelection()?.removeAllRanges();
      }
    } else {
      // Copiar código HTML
      navigator.clipboard.writeText(optimizedContent);
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleDownloadArticle = () => {
    const element = document.createElement('a');
    const file = new Blob([optimizedContent], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `artigo-${articleData.establishment.name || 'estabelecimento'}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handlePrintArticle = () => {
    window.print();
  };
  
  const handleStartNew = () => {
    resetArticleData();
    navigate('/');
  };
  
  const handleSubmitRating = () => {
    // Em uma aplicação real, enviaríamos esta avaliação para o servidor
    setShowRatingSuccess(true);
    setTimeout(() => setShowRatingSuccess(false), 3000);
  };
  
  // Function to insert images into the article content
  const renderArticleWithImages = () => {
    let content = optimizedContent;
    
    // Simple image insertion logic (in a real app, this would be more sophisticated)
    if (articleData.images.length > 0) {
      const imageHtml = articleData.images.map(image => `
        <figure class="my-6">
          <img src="${image.url}" alt="${image.alt}" class="rounded-lg max-w-full mx-auto shadow-md" />
          <figcaption class="text-sm text-gray-600 mt-2 text-center">${image.description}</figcaption>
        </figure>
      `).join('');
      
      // Insert after first paragraph
      const firstParagraphEnd = content.indexOf('</p>') + 4;
      content = content.substring(0, firstParagraphEnd) + imageHtml + content.substring(firstParagraphEnd);
    }
    
    // Insert links at the end
    if (articleData.links.length > 0) {
      const linksHtml = `
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-xl font-semibold mb-4">Links Úteis</h3>
          <ul class="space-y-2">
            ${articleData.links.map(link => `
              <li>
                <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline flex items-center">
                  ${link.name}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
      
      content += linksHtml;
    }
    
    // Add keywords as tags
    if (keywords.length > 0) {
      const keywordsHtml = `
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex flex-wrap gap-2">
            ${keywords.map(keyword => `
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                ${keyword}
              </span>
            `).join('')}
          </div>
        </div>
      `;
      
      content += keywordsHtml;
    }
    
    return { __html: content };
  };
  
  if (loading) {
    return (
      <Loader 
        message="Otimizando seu artigo para SEO" 
        description="Estamos aplicando as melhores práticas de SEO e formatando seu artigo para máxima eficácia."
        variant="article"
      />
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Artigo Finalizado</h1>
        <p className="text-lg text-gray-600">
          Seu artigo foi gerado e otimizado para SEO. Você pode visualizar, copiar, baixar ou editar conforme necessário.
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
          <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <Card 
            className="overflow-hidden"
            padding="none"
            variant="elevated"
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'preview' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                <div className="flex items-center justify-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Visualização
                </div>
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'code' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('code')}
              >
                <div className="flex items-center justify-center">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Código HTML
                </div>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {activeTab === 'preview' ? (
                <div 
                  ref={articleRef}
                  className="prose prose-lg max-w-none article-content"
                  dangerouslySetInnerHTML={renderArticleWithImages()} 
                />
              ) : (
                <div className="relative">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm text-gray-800 max-h-[600px]">
                    {optimizedContent}
                  </pre>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={handleCopyArticle}
                      className="p-1.5 bg-white rounded-md shadow-sm text-gray-500 hover:text-blue-600"
                      title="Copiar código"
                    >
                      {copied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card title="Ações" variant="elevated">
            <div className="space-y-3">
              <Button 
                onClick={handleCopyArticle} 
                fullWidth 
                className="justify-center"
                icon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                iconPosition="left"
              >
                {copied ? 'Copiado!' : 'Copiar Artigo'}
              </Button>
              
              <Button 
                onClick={handleDownloadArticle} 
                variant="secondary" 
                fullWidth 
                className="justify-center"
                icon={<Download className="h-4 w-4" />}
                iconPosition="left"
              >
                Baixar HTML
              </Button>
              
              <Button 
                onClick={handlePrintArticle}
                variant="secondary" 
                fullWidth 
                className="justify-center"
                icon={<Printer className="h-4 w-4" />}
                iconPosition="left"
              >
                Imprimir
              </Button>
              
              <div className="relative">
                <Button 
                  onClick={() => setShowShareOptions(!showShareOptions)} 
                  variant="secondary" 
                  fullWidth 
                  className="justify-center"
                  icon={<Share2 className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Compartilhar
                </Button>
                
                {showShareOptions && (
                  <div className="absolute z-10 mt-2 w-full bg-white rounded-md shadow-lg py-1 border border-gray-200">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      Twitter
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      WhatsApp
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z" />
                      </svg>
                      Instagram
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <svg className="h-4 w-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                      Link
                    </button>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 my-3 pt-3">
                <Button 
                  onClick={handleStartNew}
                  variant="outline" 
                  fullWidth 
                  className="justify-center"
                  icon={<Home className="h-4 w-4" />}
                  iconPosition="left"
                >
                  Criar Novo Artigo
                </Button>
              </div>
            </div>
          </Card>
          
          <Card title="Palavras-chave SEO" variant="elevated">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {keyword}
                </span>
              ))}
            </div>
          </Card>
          
          <Card title="Estatísticas" variant="elevated">
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Palavras:
                </span>
                <span className="font-medium text-gray-900">{optimizedContent.split(/\s+/).length}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Image className="h-4 w-4 mr-2 text-gray-500" />
                  Imagens:
                </span>
                <span className="font-medium text-gray-900">{articleData.images.length}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                  Links:
                </span>
                <span className="font-medium text-gray-900">{articleData.links.length}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-gray-500" />
                  Palavras-chave:
                </span>
                <span className="font-medium text-gray-900">{keywords.length}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  Tempo de leitura:
                </span>
                <span className="font-medium text-gray-900">
                  {Math.max(1, Math.ceil(optimizedContent.split(/\s+/).length / 200))} min
                </span>
              </li>
            </ul>
          </Card>
          
          {/* Avaliação */}
          <Card title="Avalie o resultado" variant="elevated">
            {showRatingSuccess ? (
              <div className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-800 font-medium">Obrigado pelo feedback!</p>
                <p className="text-sm text-gray-600">Sua avaliação nos ajuda a melhorar.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none"
                    >
                      <Star 
                        className={`h-8 w-8 ${
                          star <= (hoverRating || rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                
                {rating > 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">
                      {rating === 5 ? 'Excelente!' : 
                       rating === 4 ? 'Muito bom!' :
                       rating === 3 ? 'Satisfatório' :
                       rating === 2 ? 'Precisa melhorar' :
                       'Insatisfatório'}
                    </p>
                    <Button 
                      onClick={handleSubmitRating}
                      size="sm"
                      variant="primary"
                    >
                      Enviar Avaliação
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/links')}
          icon={<ArrowLeft className="h-4 w-4" />}
          iconPosition="left"
        >
          Voltar para Links
        </Button>
        
        <Button 
          onClick={handleStartNew}
          variant="primary"
        >
          Criar Novo Artigo
        </Button>
      </div>
      
      {/* Sugestões de próximos passos */}
      <Card 
        title="Próximos Passos" 
        variant="outlined"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
              <Edit className="h-5 w-5 mr-2 text-blue-600" />
              Editar e Refinar
            </h3>
            <p className="text-sm text-gray-600">
              Revise o artigo gerado e faça ajustes finais para garantir que ele reflita perfeitamente o estabelecimento.
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
              <Share2 className="h-5 w-5 mr-2 text-blue-600" />
              Compartilhar
            </h3>
            <p className="text-sm text-gray-600">
              Compartilhe o artigo em redes sociais ou envie diretamente para o estabelecimento para aprovação.
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Publicar
            </h3>
            <p className="text-sm text-gray-600">
              Publique o artigo em seu blog, site ou plataforma de conteúdo para alcançar seu público-alvo.
            </p>
          </div>
        </div>
      </Card>
      
      {/* Artigos relacionados */}
      <Card 
        title="Artigos Relacionados" 
        variant="outlined"
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 mb-2">5 Dicas para Fotografar Estabelecimentos</h3>
            <p className="text-sm text-gray-600 mb-2">
              Aprenda técnicas profissionais para capturar imagens impressionantes de estabelecimentos.
            </p>
            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
              Ler artigo
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium text-gray-900 mb-2">Como Otimizar Artigos para SEO Local</h3>
            <p className="text-sm text-gray-600 mb-2">
              Estratégias avançadas para melhorar o ranqueamento de artigos sobre estabelecimentos locais.
            </p>
            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
              Ler artigo
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinalArticlePage;
