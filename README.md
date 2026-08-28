# JOVI CAM

O novo ecossistema JOVI que integra canera e o app de estuddos para apoiar a rotina de estudos. O projeto permite registrar matérias, anotações, fotos e eventos, além de concentrar resumos, exercícios e um chat de apoio em uma única interface.

## Funcionalidades

- Captura e organização de fotos de anotações e conteúdos de estudo.
- Cadastro de matérias, anotações e eventos no calendário.
- Galeria para consultar o material salvo.
- Criação de resumos e exercícios a partir do conteúdo estudado.
- Chat para tirar dúvidas sobre os materiais registrados.
- Persistência dos dados no armazenamento local do navegador.

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior.
- npm (instalado junto ao Node.js).
- Uma chave da API do Google Gemini para utilizar os recursos de IA.

## Como rodar o projeto

1. Clone o repositório e acesse a pasta do projeto:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd Spirnt-3-Web-Development
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo chamado `.env` na raiz do projeto e adicione sua chave do Gemini:

   ```env
   VITE_GEMINI_API_KEY=sua_chave_aqui
   ```

4. Inicie o ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Abra no navegador a URL exibida pelo Vite — normalmente `http://localhost:5173`.

## Outros comandos

Para gerar a versão de produção:

```bash
npm run build
```

Para visualizar localmente a versão gerada:

```bash
npm run preview
```

## Deploy na Vercel

Acesse nosso projeto no link abaixo:

https://sprint-3-web-development-nine.vercel.app/

## Uso de IA no projeto

A Inteligência Artificial, via API do Google Gemini, é usada para extrair texto de fotos de anotações (OCR), gerar resumos organizados a partir das imagens, criar exercícios com diferentes níveis de dificuldade e responder às perguntas no chat de estudos.
