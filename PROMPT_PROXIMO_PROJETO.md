# 🚀 Prompt para Criação de Novo Projeto API

Use este prompt como base para criar novos projetos de API com Node.js + TypeScript + Express + TypeORM seguindo Clean Architecture.

---

## 📋 Prompt Base

```
Crie um projeto de API REST usando Node.js, TypeScript, Express.js e TypeORM seguindo os princípios de Clean Architecture com as seguintes especificações:

## Tecnologias Principais
- Node.js 20.x
- TypeScript 5.2
- Express.js 4.x
- TypeORM 0.3.x
- SQL Server (ou MySQL/PostgreSQL conforme necessidade)
- Winston para logging
- Zod para validação
- Jest para testes
- bcryptjs para criptografia
- jsonwebtoken para autenticação JWT
- tsyringe para injeção de dependência
- CORS configurado
- cookie-parser
- express-async-errors

## Estrutura do Projeto

```
├── src/
│   ├── @types/                      # Definições de tipos TypeScript
│   │   └── express/
│   │       └── index.d.ts           # Extensão do Request do Express
│   ├── modules/                     # Módulos de domínio
│   │   ├── authentication/          # Módulo de autenticação JWT
│   │   │   ├── domain/
│   │   │   │   ├── models/          # Interfaces e tipos
│   │   │   │   └── repositories/    # Interfaces de repositório
│   │   │   ├── services/            # Casos de uso
│   │   │   └── infra/
│   │   │       ├── http/
│   │   │       │   ├── controllers/ # Controllers
│   │   │       │   └── routes/      # Rotas
│   │   │       └── repositories/    # Implementação dos repositórios
│   │   └── [outros-modulos]/        # Estrutura similar
│   └── shared/
│       ├── @types/                  # Tipos compartilhados
│       ├── config/                  # Configurações (auth, etc)
│       ├── env/                     # Validação de ambiente com Zod
│       ├── errors/                  # Erros customizados
│       ├── logger/                  # Configuração do Winston
│       ├── middlewares/             # Middlewares globais
│       │   ├── apiVersion.ts        # Versionamento de API
│       │   ├── errorHandler.ts      # Tratamento de erros
│       │   └── isAuthenticated.ts   # Middleware de autenticação
│       └── infra/
│           ├── database/
│           │   └── data-source.ts   # Configuração do TypeORM
│           └── http/
│               ├── app.ts           # Configuração do Express
│               ├── server.ts        # Inicialização do servidor
│               ├── container/
│               │   └── index.ts     # Registro de dependências
│               ├── controllers/
│               │   └── health_controller.ts
│               └── routes/
│                   ├── index.ts     # Agregador de rotas
│                   ├── health.routes.ts
│                   ├── v1/
│                   │   └── index.ts # Rotas versão 1
│                   └── v2/
│                       └── index.ts # Rotas versão 2
├── database/                        # Scripts SQL
│   ├── create-database.sql
│   └── README.md
├── docs/                            # Documentação do projeto
├── logs/                            # Logs da aplicação
├── babel.config.js                  # Configuração do Babel
├── eslint.config.mjs                # ESLint v9
├── jest.config.ts                   # Configuração do Jest
├── tsconfig.json                    # Configuração do TypeScript
├── package.json
└── README.md
```

## Configuração do TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "allowJs": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": "./",
    "paths": {
      "@shared/*": ["src/shared/*"],
      "@config/*": ["src/shared/config/*"],
      "@modules/*": ["src/modules/*"]
    },
    "typeRoots": ["src/@types", "./node_modules/@types"],
    "strictPropertyInitialization": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "strictBindCallApply": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Scripts do Package.json

```json
{
  "scripts": {
    "dev": "ts-node-dev -r tsconfig-paths/register --inspect --transpile-only --ignore-watch node_modules src/shared/infra/http/server.ts",
    "build": "npm ci --include=dev && npx babel src --extensions \".js,.ts\" --out-dir dist --copy-files",
    "start": "node dist/shared/infra/http/server.js",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch --passWithNoTests",
    "test:coverage": "jest --coverage --passWithNoTests",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\""
  }
}
```

## Variáveis de Ambiente (.env)

```env
NODE_ENV=dev
PORT=3333

# Database
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=sua_senha
DB_DATABASE=nome_banco

# CORS
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=sua_chave_secreta_com_no_minimo_32_caracteres_aqui
ACCESS_TOKEN_LIFE=15m
REFRESH_TOKEN_SECRET=sua_chave_secreta_refresh_com_32_caracteres
REFRESH_TOKEN_LIFE=7d
REFRESH_TOKEN_NOT_BEFORE=0
```

## Configuração do Auth (src/shared/config/auth.ts)

```typescript
import { env } from '@shared/env'

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.ACCESS_TOKEN_LIFE,
  },
  refreshToken: {
    secret: env.REFRESH_TOKEN_SECRET,
    expiresIn: env.REFRESH_TOKEN_LIFE,
    notBefore: env.REFRESH_TOKEN_NOT_BEFORE,
  },
}
```

## Sistema de Autenticação JWT

Implemente autenticação JWT completa com:

### Endpoints Obrigatórios:
1. **POST /api/v1/auth/session** - Login (retorna access_token e refresh_token em JSON)
2. **POST /api/v1/auth/refresh** - Renovar tokens
3. **GET /api/v1/auth/me** - Buscar usuário autenticado (protegido)
4. **PUT /api/v1/auth/device** - Atualizar device tokens (protegido)

### Funcionalidades:
- Access Token com expiração curta (15 minutos)
- Refresh Token com expiração longa (7 dias)
- Refresh Token hasheado no banco de dados (bcryptjs)
- Tokens retornados via JSON (não usar HTTP-only cookies)
- Suporte a device tokens (iOS e Android)
- Middleware de autenticação que valida o Bearer token
- Logging de tentativas de autenticação

### Fluxo de Autenticação:
1. Usuário faz login com CPF e senha
2. Sistema valida credenciais
3. Sistema gera access_token e refresh_token
4. Sistema hasheia e salva refresh_token no banco
5. Sistema retorna ambos os tokens em JSON
6. Cliente armazena tokens localmente
7. Cliente usa access_token nas requisições (Authorization: Bearer <token>)
8. Quando access_token expira, cliente usa refresh_token para renovar
9. Sistema valida refresh_token e gera novos tokens

## Erros Personalizados

Crie erros customizados que estendem AppError:
- InvalidCredentialsError
- UserNotFoundError
- UserNotPermissionError
- UserNotLoginError
- RefreshTokenInvalidError

## Logger Winston

Configure Winston com:
- Daily rotate file
- Formato JSON para produção
- Formato colorido para desenvolvimento
- Níveis: error, warn, info, http, debug
- Pasta de logs: ./logs/
- Rotação diária

## Middleware de Erro Global

Implemente error handler que:
- Captura erros do express-async-errors
- Formata resposta de erro
- Loga erros com Winston
- Retorna JSON padronizado

## Health Check

Endpoint GET /health que retorna:
```json
{
  "status": "ok",
  "timestamp": "ISO string",
  "uptime": "seconds",
  "environment": "dev|test|production",
  "database": {
    "status": "connected|disconnected"
  }
}
```

## Versionamento de API

Implemente versionamento por URI:
- /api/v1/recurso
- /api/v2/recurso

Com middleware que adiciona headers:
- X-API-Version
- X-API-Deprecated (se aplicável)

## TypeORM Data Source

Configure TypeORM com:
- Tipo: mssql (ou mysql/postgres)
- Entidades: src/modules/**/domain/entities/*.ts
- Migrations: pasta migrations/
- synchronize: false (usar migrations)
- logging: apenas em dev
- Timezone configurável

## Injeção de Dependência

Use tsyringe para:
- Registrar repositórios como singleton
- Registrar services como singleton
- Resolver dependências automaticamente
- Injetar no construtor com @inject decorator

## Validação com Zod

- Validar variáveis de ambiente
- Validar body das requisições
- Validar query params
- Validar path params
- Retornar erros de validação formatados

## Testes

Configure Jest com:
- ts-jest
- Coverage configurado
- Testes unitários para services
- Testes de integração com supertest
- Mocks de repositórios

## Padrões de Código

- ESLint v9 configurado
- Prettier integrado
- Imports organizados por ordem
- Use async/await
- Use arrow functions
- Use interface ao invés de type quando possível
- Prefixo I para interfaces (IRepository)
- PascalCase para classes
- camelCase para funções e variáveis
- UPPER_CASE para constantes

## Clean Architecture

Siga os princípios:
1. **Domain Layer**: Entidades e interfaces de repositório
2. **Service Layer**: Casos de uso com lógica de negócio
3. **Infrastructure Layer**: Controllers, routers, implementação de repositórios
4. **Dependency Rule**: Dependências apontam para dentro (domain não conhece infra)

## Documentação

Crie:
- README.md completo com exemplos
- Documentação de cada módulo
- Exemplos de uso da API
- Guia de contribuição
- Changelog

## CORS

Configure CORS com:
- Origin do frontend nas variáveis de ambiente
- Credentials: true
- Methods: GET, POST, PUT, DELETE, PATCH
- Allowed Headers: Content-Type, Authorization

## Segurança

Implemente:
- Rate limiting (opcional mas recomendado)
- Helmet para headers de segurança
- Validação de entrada em todas as rotas
- Sanitização de dados
- Senhas sempre hasheadas
- Tokens com expiração
- Logs de ações sensíveis

## Entidades de Banco de Dados

[Especifique aqui as entidades específicas do seu projeto]

Exemplo:
- Usuario (codigo, nome, cpf, senha, email, status, etc)
- [Outras entidades conforme necessidade]

## Funcionalidades Específicas

[Liste aqui as funcionalidades específicas do projeto]

## Observações Importantes

1. **Timezone**: Configure para o timezone correto (ex: America/Sao_Paulo)
2. **Não usar HTTP-only cookies**: Tokens devem ser retornados via JSON para suportar mobile
3. **Hashear refresh tokens**: Sempre hashear antes de salvar no banco
4. **Logging**: Logar todas as tentativas de autenticação
5. **Validação**: Validar todos os inputs
6. **Erros**: Nunca expor stack traces em produção
7. **Senhas**: Nunca retornar senhas nas respostas da API

## Estrutura de Resposta da API

Padronize as respostas:

**Sucesso:**
```json
{
  "data": {...},
  "message": "Optional message"
}
```

**Erro:**
```json
{
  "error": true,
  "code": "ERROR_CODE",
  "message": "Error message",
  "details": [] // Opcional, para erros de validação
}
```

## Próximos Passos Após Criação

1. Instalar dependências: `npm install`
2. Configurar `.env`
3. Executar script SQL de criação do banco
4. Rodar testes: `npm test`
5. Iniciar em dev: `npm run dev`
6. Build para produção: `npm run build`
7. Iniciar produção: `npm start`

---

**Gere o projeto completo e funcional seguindo todas essas especificações!**
```

---

## 🎯 Como Usar Este Prompt

1. **Copie o prompt acima** (dentro do bloco de código)
2. **Personalize as seções**:
   - Adicione suas entidades específicas
   - Liste suas funcionalidades
   - Ajuste tecnologias se necessário
3. **Cole no ChatGPT/Claude** e solicite a criação do projeto
4. **Revise o código gerado** e faça ajustes conforme necessário

## 📝 Seções para Personalizar

### Entidades de Banco de Dados
```
Substitua por suas entidades específicas:
- Nome da entidade
- Campos
- Relacionamentos
- Constraints
```

### Funcionalidades Específicas
```
Liste as funcionalidades do seu projeto:
- CRUD de recursos
- Relatórios
- Integraçõescom terceiros
- Envio de emails/notificações
- Upload de arquivos
- etc
```

### Banco de Dados
```
Especifique o SGBD:
- SQL Server (mssql)
- MySQL (mysql)
- PostgreSQL (postgres)
```

## 💡 Dicas

1. **Seja específico**: Quanto mais detalhes, melhor o resultado
2. **Inclua exemplos**: Mostre exemplos de código quando possível
3. **Defina padrões**: Especifique padrões de nomenclatura e estrutura
4. **Liste tecnologias**: Seja explícito sobre versões e pacotes
5. **Descreva fluxos**: Explique fluxos complexos em detalhes

## ⚠️ Importante

- Este prompt foi criado com base no projeto ILPI Portaria API
- Ele reflete as melhores práticas implementadas neste projeto
- Personalize conforme necessidade do novo projeto
- Sempre revise o código gerado

## 📚 Referências

Este prompt é baseado em:
- Clean Architecture (Robert C. Martin)
- SOLID Principles
- Domain-Driven Design
- RESTful API Best Practices
- Node.js Best Practices
- TypeScript Best Practices
- TypeORM Documentation
- Express.js Best Practices

---

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Autor:** André Luiz dos Santos  
**Projeto Base:** ILPI Portaria API

