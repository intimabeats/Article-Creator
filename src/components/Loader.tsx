import React from 'react';

interface LoaderProps {
  message?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'article' | 'upload';
}

const Loader: React.FC<LoaderProps> = ({ 
  message = 'Carregando...', 
  description,
  size = 'md',
  variant = 'default'
}) => {
  // Tamanhos do spinner
  const spinnerSizes = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };
  
  // Tamanhos da barra de progresso
  const progressSizes = {
    sm: 'w-40 h-1.5',
    md: 'w-64 h-2',
    lg: 'w-80 h-3',
  };
  
  // Variantes de animação
  const renderVariant = () => {
    switch (variant) {
      case 'article':
        return (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        );
        
      case 'upload':
        return (
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <svg className="animate-spin text-blue-600" width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75V6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M17.1266 6.87347L16.0659 7.93413" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M19.25 12L17.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M17.1266 17.1265L16.0659 16.0659" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M12 17.75V19.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M7.9342 16.0659L6.87354 17.1265" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6.25 12L4.75 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M7.9342 7.93413L6.87354 6.87347" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="relative mb-4">
            <div className={`${spinnerSizes[size]} border-4 border-blue-100 border-solid rounded-full`}></div>
            <div className={`absolute top-0 left-0 ${spinnerSizes[size]} border-4 border-blue-600 border-solid rounded-full animate-spin border-t-transparent`}></div>
          </div>
        );
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      {renderVariant()}
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2 mt-4">{message}</h3>
      
      {description && (
        <p className="text-gray-600 text-center max-w-md mb-4">{description}</p>
      )}
      
      {variant === 'default' && (
        <>
          <div className={`${progressSizes[size]} mt-2 bg-gray-200 rounded-full overflow-hidden`}>
            <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
          </div>
        </>
      )}
    </div>
  );
};

export default Loader;
