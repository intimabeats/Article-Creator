import React from 'react';
import { FileText, Users, TrendingUp, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre o ArtigosPro</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transformando visitas a estabelecimentos em conteúdo de alta qualidade otimizado para SEO.
        </p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
        <p className="text-gray-600">
          O ArtigosPro foi criado para ajudar profissionais de conteúdo a produzirem artigos de alta qualidade sobre estabelecimentos comerciais, turísticos e de serviços. Nossa missão é simplificar o processo de coleta de informações e transformá-las em conteúdo otimizado para SEO, permitindo que você se concentre no que realmente importa: capturar a essência e os diferenciais de cada local.
        </p>
        <p className="text-gray-600 mt-4">
          Combinamos a expertise humana na observação e avaliação de estabelecimentos com a inteligência artificial para estruturação e otimização de conteúdo, criando uma ferramenta única que eleva a qualidade dos artigos e economiza tempo precioso.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Conteúdo Otimizado</h2>
          </div>
          <p className="text-gray-600">
            Nosso sistema analisa as informações coletadas e gera artigos estruturados com palavras-chave estratégicas, melhorando o posicionamento nos mecanismos de busca e aumentando a visibilidade online.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Experiência do Usuário</h2>
          </div>
          <p className="text-gray-600">
            Focamos na experiência do leitor, criando conteúdo envolvente e informativo que realmente ajuda as pessoas a tomarem decisões sobre os lugares que desejam visitar.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Eficiência e Produtividade</h2>
          </div>
          <p className="text-gray-600">
            Nosso processo guiado permite que você colete todas as informações necessárias de forma estruturada, eliminando a necessidade de revisitar estabelecimentos por falta de dados e reduzindo drasticamente o tempo de produção de conteúdo.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Qualidade Garantida</h2>
          </div>
          <p className="text-gray-600">
            Cada artigo gerado passa por um processo de otimização que garante conteúdo único, relevante e alinhado com as melhores práticas de SEO, resultando em textos que se destacam tanto para leitores quanto para algoritmos de busca.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Entre em Contato</h2>
        <p className="text-gray-600 mb-6">
          Tem dúvidas ou sugestões? Estamos sempre buscando melhorar nossa plataforma.
        </p>
        <p className="text-gray-800 font-medium">
          Email: contato@artigospro.com<br />
          Telefone: (11) 99999-9999
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
