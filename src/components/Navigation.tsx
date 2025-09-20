import React from 'react';
import { 
  FileText, 
  Compress, 
  ArrowRightLeft, 
  MessageCircle,
  Menu,
  X
} from 'lucide-react';

export type TabType = 'operations' | 'converter' | 'creator' | 'chat';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const tabs = [
    {
      id: 'operations' as TabType,
      title: 'Operações PDF',
      description: 'Comprimir, juntar e dividir',
      icon: Compress,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'converter' as TabType,
      title: 'Conversor',
      description: 'Converter formatos',
      icon: ArrowRightLeft,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'creator' as TabType,
      title: 'Criar PDF',
      description: 'Criar documentos',
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'chat' as TabType,
      title: 'Chat com Documentos',
      description: 'Análise inteligente',
      icon: MessageCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 bg-white rounded-lg shadow-lg border"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggleMobileMenu}
        />
      )}

      {/* Navigation */}
      <nav className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">PDF Toolkit Pro</h1>
            <p className="text-gray-600">Sua ferramenta completa para PDFs</p>
          </div>

          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    onToggleMobileMenu();
                  }}
                  className={`
                    w-full p-4 rounded-lg text-left transition-all duration-200 
                    ${isActive 
                      ? `${tab.bgColor} border-2 border-current shadow-md` 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                    }
                  `}
                >
                  <div className={`flex items-center space-x-3 ${isActive ? tab.color : 'text-gray-600'}`}>
                    <Icon className="h-6 w-6" />
                    <div>
                      <h3 className="font-semibold">{tab.title}</h3>
                      <p className="text-sm opacity-75">{tab.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Funcionalidades</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Comprimir e otimizar PDFs</li>
              <li>• Mesclar múltiplos documentos</li>
              <li>• Dividir PDFs em páginas</li>
              <li>• Converter diversos formatos</li>
              <li>• Criar PDFs do zero</li>
              <li>• Chat inteligente com IA</li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};