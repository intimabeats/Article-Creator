import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-white">ArtigosPro</span>
            </div>
            <p className="text-gray-300 max-w-xs">
              Sistema inteligente de geração de artigos para profissionais que visitam estabelecimentos.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Facebook size={18} />} href="#" label="Facebook" />
              <SocialLink icon={<Twitter size={18} />} href="#" label="Twitter" />
              <SocialLink icon={<Instagram size={18} />} href="#" label="Instagram" />
              <SocialLink icon={<Linkedin size={18} />} href="#" label="LinkedIn" />
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h3>
            <ul className="space-y-2">
              <FooterLink href="/">Início</FooterLink>
              <FooterLink href="/about">Sobre</FooterLink>
              <FooterLink href="/establishment">Criar Artigo</FooterLink>
              <FooterLink href="#">Tutoriais</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Recursos</h3>
            <ul className="space-y-2">
              <FooterLink href="#">Documentação</FooterLink>
              <FooterLink href="#">Exemplos de Artigos</FooterLink>
              <FooterLink href="#">Perguntas Frequentes</FooterLink>
              <FooterLink href="#">Suporte</FooterLink>
              <FooterLink href="#">Política de Privacidade</FooterLink>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span className="text-gray-300">contato@artigospro.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span className="text-gray-300">(11) 99999-9999</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                <span className="text-gray-300">
                  Av. Paulista, 1000<br />
                  São Paulo, SP
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} ArtigosPro. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Termos de Uso
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Componente para links do footer
const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  return (
    <li>
      <Link 
        to={href} 
        className="text-gray-300 hover:text-white transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
};

// Componente para links de redes sociais
const SocialLink: React.FC<{ icon: React.ReactNode; href: string; label: string }> = ({ 
  icon, href, label 
}) => {
  return (
    <a 
      href={href}
      aria-label={label}
      className="bg-gray-700 p-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
    >
      {icon}
    </a>
  );
};

export default Footer;
