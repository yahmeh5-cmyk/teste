# 📄 PDF Toolkit Pro

**Ferramenta completa para manipulação de PDFs com IA integrada**

Uma aplicação web moderna e abrangente para todas as suas necessidades relacionadas a PDFs, incluindo compressão, fusão, divisão, conversão de formatos e um chatbot inteligente para análise de documentos.

## 🚀 Funcionalidades Principais

### 📊 Operações com PDF
- **Comprimir PDFs**: Reduza o tamanho dos arquivos mantendo a qualidade
- **Mesclar PDFs**: Combine múltiplos PDFs em um único documento
- **Dividir PDFs**: Separe páginas de um PDF em arquivos individuais

### 🔄 Conversor Universal
- **Para PDF**: Converta Word (.doc, .docx), Excel (.xls, .xlsx), CSV para PDF
- **Do PDF**: Converta PDFs para imagens (PNG)
- **Suporte amplo**: Múltiplos formatos de entrada e saída

### ✏️ Criador de PDF
- **Criar do zero**: Gere PDFs a partir de texto simples
- **Formatação automática**: Quebras de linha e paginação inteligentes
- **Personalização**: Adicione títulos e configure o layout

### 🤖 Chat com Documentos (IA)
- **Análise inteligente**: Carregue documentos e faça perguntas sobre o conteúdo
- **Suporte a Markdown**: Respostas formatadas com sintaxe rica
- **Múltiplos formatos**: PDF, Word, TXT e outros
- **Powered by Gemini AI**: Respostas precisas e contextualmente relevantes

## 🎯 Tecnologias Utilizadas

### Frontend
- **React 19** - Framework de interface moderna
- **TypeScript** - Tipagem estática para código robusto
- **Tailwind CSS** - Design responsivo e moderno
- **Framer Motion** - Animações fluidas
- **Lucide React** - Ícones elegantes

### Processamento de PDF
- **PDF-lib** - Manipulação avançada de PDFs
- **jsPDF** - Geração de PDFs do zero
- **PDF.js** - Renderização e extração de texto
- **React PDF** - Visualização de PDFs

### Conversão de Arquivos
- **Mammoth.js** - Conversão de documentos Word
- **SheetJS (XLSX)** - Manipulação de planilhas Excel
- **Papa Parse** - Processamento de arquivos CSV
- **html2canvas** - Conversão para imagens

### IA e Chat
- **Google Gemini AI** - Análise inteligente de documentos
- **React Markdown** - Renderização de Markdown
- **Highlight.js** - Syntax highlighting para código

## 🏗️ Arquitetura

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── Navigation.tsx   # Navegação lateral responsiva
│   ├── FileUpload.tsx   # Upload de arquivos com drag & drop
│   ├── PDFOperations.tsx # Operações básicas com PDF
│   ├── FileConverter.tsx # Conversores de formato
│   ├── PDFCreator.tsx   # Criador de PDF
│   └── DocumentChat.tsx # Chat inteligente com IA
├── hooks/               # Hooks customizados
│   └── useGeminiChat.ts # Hook para integração com Gemini AI
├── utils/               # Utilitários e helpers
│   └── pdfUtils.ts      # Toolkit completo para PDFs
├── types/               # Definições de tipos TypeScript
│   └── index.ts         # Tipos compartilhados
└── pages/               # Páginas da aplicação (futuro)
```

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Chave de API do Google Gemini

### Instalação

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd pdf-toolkit-pro
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure a chave da API**:
```bash
# Crie o arquivo .env.local
echo "GEMINI_API_KEY=sua_chave_aqui" > .env.local
```

4. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
```

5. **Acesse a aplicação**:
   - Local: http://localhost:5173
   - Rede: Use a URL fornecida pelo Vite

### Uso com PM2 (Produção)

```bash
# Instalar PM2
npm install pm2

# Iniciar com PM2
npx pm2 start "npm run dev" --name pdf-toolkit-pro

# Verificar status
npx pm2 status

# Parar aplicação
npx pm2 stop pdf-toolkit-pro
```

## 📱 Interface do Usuário

### Design Responsivo
- **Desktop**: Navegação lateral fixa com área de conteúdo expandida
- **Mobile**: Menu hambúrguer com navegação em overlay
- **Tablet**: Layout adaptativo para melhor experiência

### Temas e Cores
- **Primária**: Azul (#3b82f6) para ações principais
- **Secundárias**: Verde, Laranja, Roxo para diferentes seções
- **Neutras**: Escala de cinza para texto e backgrounds

### Componentes Principais
- **Drag & Drop**: Upload intuitivo de arquivos
- **Toast Notifications**: Feedback visual para todas as ações
- **Loading States**: Indicadores de progresso para operações
- **Responsive Grid**: Layout que se adapta a qualquer tela

## 🔧 Configuração da API

### Google Gemini AI
Para usar o chat com documentos, você precisa:

1. **Obter uma chave de API**:
   - Visite [Google AI Studio](https://aistudio.google.com/)
   - Crie uma nova chave de API
   - Copie a chave gerada

2. **Configurar no projeto**:
```bash
# .env.local
GEMINI_API_KEY=sua_chave_do_gemini_aqui
```

3. **Testar a configuração**:
   - Acesse a aba "Chat com Documentos"
   - Faça upload de um documento
   - Clique em "Analisar Documentos"
   - Faça uma pergunta sobre o conteúdo

## 📋 Funcionalidades Detalhadas

### 1. Operações com PDF
- **Compressão**: Reduz tamanho mantendo qualidade visual
- **Mesclagem**: Combina PDFs preservando formatação
- **Divisão**: Separa cada página em arquivo individual
- **Batch Processing**: Processa múltiplos arquivos simultaneamente

### 2. Conversão de Formatos
- **Word para PDF**: Preserva formatação básica do documento
- **Excel para PDF**: Converte planilhas em formato tabular
- **CSV para PDF**: Transforma dados tabulares em documento
- **PDF para Imagens**: Gera PNG de alta qualidade por página

### 3. Geração de PDF
- **Editor de texto**: Interface simples para criação de conteúdo
- **Títulos opcionais**: Adicione cabeçalhos aos documentos
- **Auto-paginação**: Quebras de página automáticas
- **Formatação preservada**: Mantém quebras de linha e espaçamento

### 4. Chat Inteligente
- **Análise contextual**: Entende o conteúdo dos documentos
- **Respostas em Markdown**: Formatação rica nas respostas
- **Múltiplos documentos**: Analise vários arquivos simultaneamente
- **Histórico de conversas**: Mantenha o contexto durante a sessão

## 🔒 Segurança e Privacidade

- **Processamento local**: PDFs são processados no navegador
- **Sem upload para servidores**: Arquivos permanecem no seu dispositivo
- **API segura**: Comunicação criptografada com Gemini AI
- **Dados temporários**: Nenhum dado é armazenado permanentemente

## 🎨 Personalização

### Temas
Você pode personalizar as cores editando o arquivo `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6', // Cor principal
        600: '#2563eb',
      }
    }
  }
}
```

### Componentes
Todos os componentes são modulares e podem ser facilmente customizados ou estendidos.

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

### Preview da Build
```bash
npm run preview
```

### Deploy em Serviços
- **Vercel**: `npx vercel`
- **Netlify**: `npm run build` + deploy da pasta `dist`
- **GitHub Pages**: Configure o workflow de CI/CD

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/pdf-toolkit-pro/issues)
- **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/pdf-toolkit-pro/discussions)
- **Email**: support@pdf-toolkit-pro.com

## 🌟 Recursos Adicionais

### Limitações Conhecidas
- **Tamanho de arquivo**: Recomendado até 50MB por PDF
- **Formato Word**: Suporte básico para .doc/.docx
- **Memória**: Processamento intensivo pode requerer mais RAM

### Melhorias Futuras
- [ ] Suporte a mais formatos de entrada
- [ ] Editor visual de PDF
- [ ] Assinatura digital de documentos
- [ ] Sincronização em nuvem
- [ ] Plugin para browsers
- [ ] App mobile nativo

---

**PDF Toolkit Pro** - Sua solução completa para manipulação de PDFs! 🚀

Acesse agora: **https://5173-ioplofinhfto3b0qs60pw-6532622b.e2b.dev**