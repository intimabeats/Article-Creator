import React, { useState, useEffect } from 'react';
import { Newspaper, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Detecta scroll para mudar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Verifica se o link está ativo
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg shadow-sm">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              ArtigosPro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" active={isActive('/')}>
              Início
            </NavLink>
            <NavLink to="/about" active={isActive('/about')}>
              Sobre
            </NavLink>
            <div className="relative group">
              <button className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 rounded-md text-sm font-medium">
                Recursos
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/establishment" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Novo Artigo
                </Link>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Tutoriais
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  Exemplos
                </a>
              </div>
            </div>
            <Link 
              to="/establishment" 
              className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
            >
              Criar Artigo
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1 py-2">
            <MobileNavLink to="/" active={isActive('/')}>
              Início
            </MobileNavLink>
            <MobileNavLink to="/about" active={isActive('/about')}>
              Sobre
            </MobileNavLink>
            <div className="py-2">
              <p className="px-3 py-2 text-sm font-medium text-gray-500">Recursos</p>
              <MobileNavLink to="/establishment" active={isActive('/establishment')} indent>
                Novo Artigo
              </MobileNavLink>
              <a href="#" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Tutoriais
              </a>
              <a href="#" className="block pl-6 pr-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                Exemplos
              </a>
            </div>
            <div className="pt-2">
              <Link 
                to="/establishment" 
                className="block w-full text-center px-4 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Criar Artigo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Componente para links de navegação desktop
const NavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode }> = ({ 
  to, active, children 
}) => {
  return (
    <Link 
      to={to} 
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
};

// Componente para links de navegação mobile
const MobileNavLink: React.FC<{ 
  to: string; 
  active: boolean; 
  indent?: boolean;
  children: React.ReactNode 
}> = ({ to, active, indent = false, children }) => {
  return (
    <Link 
      to={to} 
      className={`block ${indent ? 'pl-6' : 'px-3'} pr-3 py-2 rounded-md text-base font-medium ${
        active 
          ? 'text-blue-600 bg-blue-50' 
          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
};

export default Header;
