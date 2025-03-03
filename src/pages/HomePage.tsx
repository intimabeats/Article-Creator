import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Camera, Search, PenTool, ArrowRight, Star, TrendingUp, CheckCircle, Sparkles, Award, Users } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-8 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 top-0 transform -translate-x-1/4 -translate-y-1/4">
            <div className="w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl"></div>
          </div>
          <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4">
            <div className="w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeIn">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
                Transforme suas visitas em artigos profissionais
              </h1>
              <p className="text-xl text-blue-100 max-w-xl">
                Crie artigos otimizados para SEO sobre estabelecimentos com a ajuda da nossa plataforma inteligente. Perfeito para profissionais de conteúdo, blogueiros e críticos.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                  href="/establishment"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/establishment');
                  }}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50"
                >
                  Iniciar Novo Artigo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
                <a 
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                  className="inline-flex justify-center items-center px-6 py-3 border border-white text-lg font-medium rounded-md text-white hover:bg-white/10"
                >
                  Saiba Mais
                </a>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-blue-800/30 rounded-lg backdrop-blur-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Profissional escrevendo artigo" 
                className="rounded-lg shadow-2xl relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg z-20 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium text-gray-900">Artigos otimizados para SEO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Processo Simplificado
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nosso processo guiado torna fácil criar artigos profissionais em apenas quatro etapas simples.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            icon={<PenTool className="h-8 w-8 text-blue-600" />}
            number={1}
            title="Descreva o Estabelecimento"
            description="Comece fornecendo uma descrição geral do local que você está visitando."
          />
          
          <StepCard 
            icon={<Search className="h-8 w-8 text-blue-600" />}
            number={2}
            title="Responda às Perguntas"
            description="Nosso sistema gera perguntas personalizadas para coletar informações relevantes."
          />
          
          <StepCard 
            icon={<Camera className="h-8 w-8 text-blue-600" />}
            number={3}
            title="Adicione Imagens"
            description="Capture e adicione fotos relevantes para enriquecer seu artigo."
          />
          
          <StepCard 
            icon={<Newspaper className="h-8 w-8 text-blue-600" />}
            number={4}
            title="Receba seu Artigo"
            description="Receba um artigo profissional otimizado para SEO pronto para publicação."
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
              <Award className="h-4 w-4 mr-2" />
              Benefícios Exclusivos
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que usar nossa plataforma?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma combina a expertise humana com inteligência artificial para criar artigos de alta qualidade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CheckCircle className="h-6 w-6 text-green-600" />}
              title="Conteúdo Personalizado"
              description="Artigos únicos baseados nas suas observações reais do local, garantindo autenticidade e valor para os leitores."
            />
            
            <FeatureCard 
              icon={<TrendingUp className="h-6 w-6 text-green-600" />}
              title="Otimizado para SEO"
              description="Palavras-chave estratégicas e estrutura que melhora o ranqueamento nos mecanismos de busca."
            />
            
            <FeatureCard 
              icon={<Star className="h-6 w-6 text-green-600" />}
              title="Qualidade Profissional"
              description="Artigos bem estruturados com linguagem clara e envolvente que mantém os leitores interessados."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-4">
            <Users className="h-4 w-4 mr-2" />
            Depoimentos
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">O que nossos usuários dizem</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profissionais de diversas áreas já estão aproveitando nossa plataforma.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="Economizo horas de trabalho em cada artigo que produzo. A plataforma é intuitiva e os resultados são excelentes."
            author="Ana Silva"
            role="Blogueira de Gastronomia"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            rating={5}
          />
          
          <TestimonialCard 
            quote="Os artigos gerados são tão bons que precisam de pouquíssimas edições. Meu tráfego orgânico aumentou 40% desde que comecei a usar."
            author="Carlos Mendes"
            role="Crítico de Restaurantes"
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            rating={4}
          />
          
          <TestimonialCard 
            quote="A estrutura de perguntas me ajuda a não esquecer nenhum detalhe importante durante minhas visitas. Recomendo para todos os criadores de conteúdo."
            author="Juliana Costa"
            role="Influenciadora Digital"
            avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            rating={5}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <p className="text-gray-600">Artigos Gerados</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <p className="text-gray-600">Clientes Satisfeitos</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">75%</div>
              <p className="text-gray-600">Aumento em SEO</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">3h</div>
              <p className="text-gray-600">Economia de Tempo</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Crie artigos profissionais em minutos, não em horas. Experimente agora e veja a diferença.
          </p>
          <a 
            href="/establishment"
            onClick={(e) => {
              e.preventDefault();
              navigate('/establishment');
            }}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50"
          >
            Criar Meu Primeiro Artigo
          </a>
        </div>
      </section>
    </div>
  );
};

// Componente para os cards de etapas
const StepCard: React.FC<{
  icon: React.ReactNode;
  number: number;
  title: string;
  description: string;
}> = ({ icon, number, title, description }) => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
          {number}
        </div>
      </div>
      <Card 
        className="hover:shadow-lg transition-shadow duration-300 mt-6"
        padding="lg"
        hoverable
      >
        <div className="text-center">
          <div className="bg-blue-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </Card>
    </div>
  );
};

// Componente para os cards de recursos
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-300"
      padding="lg"
      hoverable
    >
      <div className="flex flex-col items-center text-center">
        <div className="bg-green-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Card>
  );
};

// Componente para os cards de depoimentos
const TestimonialCard: React.FC<{
  quote: string;
  author: string;
  role: string;
  avatar: string;
  rating: number;
}> = ({ quote, author, role, avatar, rating }) => {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow duration-300"
      padding="lg"
      hoverable
    >
      <div className="flex flex-col h-full">
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              className={`h-4 w-4 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
            />
          ))}
        </div>
        <div className="mb-4 text-gray-600 italic flex-grow">
          "{quote}"
        </div>
        <div className="flex items-center mt-4">
          <img 
            src={avatar} 
            alt={author} 
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">{author}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HomePage;
