# 🎯 Configuração de Projeto Backend Node.js com TypeORM

> **Objetivo:** Configurar um projeto backend Node.js + TypeScript + Express + TypeORM do zero, seguindo Clean Architecture e melhores práticas de desenvolvimento.

---

## 1. 🌍 Contexto

**Linguagem/Framework:**
- Node.js (versão LTS mais recente)
- TypeScript (última versão estável)
- Express.js (última versão estável)
- TypeORM (última versão estável)

**Arquitetura/Padrão:**
- Clean Architecture (separação em camadas)
- Repository Pattern com interfaces
- Dependency Injection (TSyringe)
- Estrutura modular por feature

**Banco de Dados:**
- MySQL 8.0.42
- TypeORM DataSource
- NÃO incluir sistema de migrations

**Público-alvo:**
- Desenvolvedores backend
- Projetos empresariais escaláveis

**Limitações/Restrições:**
- NÃO gerar migrations
- Usar apenas dependências atualizadas (últimas versões estáveis)
- Configurar validação de ambiente com Zod
- Logger estruturado com Winston
- WebSocket com Socket.IO (opcional, configurar apenas se solicitado)

---

## 2. 🎯 Objetivo

**O que precisa ser entregue:**
- Projeto backend completo e funcional
- Todas as dependências instaladas e configuradas
- TypeORM configurado com DataSource
- Sistema de validação de variáveis de ambiente
- Estrutura de pastas seguindo Clean Architecture
- Logger estruturado com Winston
- Sistema de autenticação JWT com httpOnly cookies
- Tratamento de erros centralizado
- CORS configurado
- Servidor HTTP rodando sem warnings ou erros
- Crias as pastas e arquivos necessários para o projeto (mesmo vazios)
- Testes unitários e de integração

**Propósito da tarefa:**
- Criar base sólida para desenvolvimento de APIs REST
- Garantir código escalável e manutenível
- Facilitar testes e manutenção futura

**Resultado esperado:**
- Servidor rodando e respondendo sem erros
- Código totalmente tipado com TypeScript
- Todas as configurações validadas
- Pronto para adicionar novos módulos/features

---

## 3. ⚙️ Instruções Específicas

### 📦 Dependências (Usar últimas versões estáveis)

**Produção (dependencies):**
```
- express: ^4.21.2
- express-async-errors: ^3.1.1
- typeorm: ^0.3.20
- mysql2: ^3.11.4
- reflect-metadata: ^0.1.14
- tsyringe: ^4.10.0
- zod: ^3.25.76
- dotenv: ^16.6.1
- cors: ^2.8.5
- cookie-parser: ^1.4.7
- bcryptjs: ^2.4.3
- jsonwebtoken: ^9.0.2
- winston: ^3.17.0
- winston-daily-rotate-file: ^5.0.0
- socket.io: ^4.8.1 (opcional)
```

**Desenvolvimento (devDependencies):**
```
- typescript: 5.2.2
- ts-node-dev: ^2.0.0
- tsconfig-paths: ^4.2.0
- @types/node: ^20.19.22
- @types/express: ^4.17.23
- @types/cors: ^2.8.19
- @types/bcryptjs: ^2.4.6
- @types/jsonwebtoken: ^8.5.9
- @types/cookie-parser: ^1.4.9
- @babel/cli: ^7.28.0
- @babel/core: ^7.28.0
- @babel/preset-env: ^7.28.0
- @babel/preset-typescript: ^7.27.1
- @babel/plugin-proposal-decorators: ^7.28.0
- @babel/plugin-transform-class-properties: ^7.27.1
- babel-plugin-module-resolver: ^4.1.0
- babel-plugin-transform-typescript-metadata: ^0.3.2
- eslint: ^8.57.1
- eslint-config-prettier: ^9.1.0
- eslint-plugin-prettier: ^5.5.1
- prettier: ^3.6.2
- @typescript-eslint/eslint-plugin: ^6.21.0
- @typescript-eslint/parser: ^6.21.0
- jest: ^29.7.0
- ts-jest: ^29.1.1
- @types/jest: ^29.5.11
- supertest: ^6.3.3
- @types/supertest: ^6.0.2
```

### 🏗️ Estrutura de Pastas

```
docs/                          # Documentação (arquivos .md)
├── LEIA-ME.md                 # Guia completo em português
├── QUICK_START.md             # Início rápido
├── SETUP_COMPLETO.md          # Detalhes da configuração
├── CHECKLIST.md               # Lista de verificação
└── TIMEZONE_INFO.md           # Guia de timezone (se aplicável)

src/
├── modules/                    # Módulos de domínio
│   └── [nome_modulo]/         # Ex: user, product, etc.
│       ├── domain/
│       │   ├── entities/      # Entidades TypeORM
│       │   ├── models/        # Interfaces/Types
│       │   └── repositories/  # Interfaces de repositórios
│       ├── infra/
│       │   ├── http/
│       │   │   ├── controllers/
│       │   │   ├── routes/
│       │   │   └── validators/
│       │   └── repositories/  # Implementações concretas
│       ├── services/          # Casos de uso / Business logic
│       └── __tests__/         # Testes do módulo
│           ├── unit/          # Testes unitários
│           └── integration/   # Testes de integração
│
└── shared/
    ├── config/               # Configurações (auth, etc.)
    ├── env/                  # Validação de env
    ├── errors/               # Classes de erro customizadas
    ├── logger/               # Configuração Winston
    ├── middlewares/          # Middlewares globais
    └── infra/
        ├── database/         # DataSource TypeORM
        └── http/
            ├── app.ts        # Express app
            ├── server.ts     # Server entry point
            ├── controllers/  # Controllers compartilhados (ex: health)
            ├── routes/       # Routes agregadas e versionadas
            │   ├── index.ts  # Agregador principal
            │   ├── health.routes.ts
            │   ├── v1/       # API v1
            │   │   └── index.ts
            │   └── v2/       # API v2 (futuro)
            │       └── index.ts
            └── container/    # DI container (TSyringe)

README.md                      # Documentação principal (na raiz)
```

**⚠️ IMPORTANTE - Organização de Documentação:**
- Todos os arquivos `.md` de documentação devem ser criados na pasta `docs/`
- **EXCEÇÃO:** Apenas o `README.md` fica na raiz do projeto
- Arquivos `.md` específicos de contexto (ex: `README_MODULE_TEMPLATE.md`, `README_TESTS.md`) ficam em suas respectivas pastas

### 🗄️ Configuração TypeORM DataSource

**Arquivo:** `src/shared/infra/database/data-source.ts`

```typescript
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { env } from '@shared/env'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.NODE_ENV === 'dev',
  logging: env.NODE_ENV === 'dev',
  entities: ['src/modules/**/domain/entities/*.ts'],
  subscribers: [],
  charset: 'utf8mb4',
  timezone: 'Z',
})

// Inicializar conexão
export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize()
    console.log('✅ Database connected successfully!')
  } catch (error) {
    console.error('❌ Error connecting to database:', error)
    process.exit(1)
  }
}
```

### 🔐 Variáveis de Ambiente

**Arquivo:** `src/shared/env/index.ts`

```typescript
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  
  // Database
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(3306),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
  
  // CORS
  FRONTEND_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  ACCESS_TOKEN_LIFE: z.string().default('15m'), // Formatos: 15m, 2h, 7d, 30s
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_LIFE: z.string().default('7d'), // Formatos: 15m, 2h, 7d, 30s
  REFRESH_TOKEN_NOT_BEFORE: z.string().default('0'),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  const errorMessage = '❌ Invalid environment variables'
  const formattedError = _env.error.format()
  console.error(errorMessage, formattedError)
  throw new Error(errorMessage)
}

export const env = _env.data
```

**Arquivo:** `.env.example`

```env
# Application
NODE_ENV=dev
PORT=3333

# Database MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=senha_segura_aqui
DB_DATABASE=nome_do_banco

# CORS
FRONTEND_URL=http://localhost:3000

# JWT Secrets (GERAR SECRETS FORTES!)
JWT_SECRET=sua_chave_secreta_muito_forte_minimo_32_caracteres
ACCESS_TOKEN_LIFE=15m
REFRESH_TOKEN_SECRET=sua_chave_refresh_secreta_muito_forte_minimo_32_caracteres
REFRESH_TOKEN_LIFE=7d
REFRESH_TOKEN_NOT_BEFORE=0
```

**Arquivo:** `.gitignore`

```
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build output
dist/
build/

# Logs
logs/
*.log

# Test coverage
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Temporary files
tmp/
temp/
```

### ⚙️ Configuração TypeScript

**tsconfig.json:**
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
    "typeRoots": ["@types", "./node_modules/@types"],
    "strictPropertyInitialization": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "strictBindCallApply": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 📜 Scripts do package.json

```json
{
  "scripts": {
    "dev": "ts-node-dev -r tsconfig-paths/register --inspect --transpile-only --ignore-watch node_modules src/shared/infra/http/server.ts",
    "build": "npm ci --include=dev && npx babel src --extensions \".js,.ts\" --out-dir dist --copy-files",
    "start": "node dist/shared/infra/http/server.js",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch --passWithNoTests",
    "test:coverage": "jest --coverage --passWithNoTests",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\""
  }
}
```

### 🚀 Server Entry Point

**Arquivo:** `src/shared/infra/http/server.ts`

```typescript
import { createServer } from 'http'
import { app } from './app'
import { env } from '@shared/env'
import { logger } from '@shared/logger/logger'
import { initializeDatabase } from '@shared/infra/database/data-source'

const httpServer = createServer(app)

// Inicializar banco antes de subir servidor
initializeDatabase().then(() => {
  httpServer.listen(env.PORT, () => {
    logger.info(`🚀 HTTP server started on port ${env.PORT}!`)
    logger.info(`🌍 Environment: ${env.NODE_ENV}`)
  })
})

export { httpServer }
```

### 🏥 Health Check

**Arquivo:** `src/shared/infra/http/controllers/health_controller.ts`

```typescript
import { Request, Response } from 'express'
import { AppDataSource } from '@shared/infra/database/data-source'

export class HealthController {
  public async check(req: Request, res: Response): Promise<Response> {
    const now = new Date()
    const timezoneOffset = -now.getTimezoneOffset() / 60

    const healthCheck = {
      status: 'ok',
      timestamp: now.toISOString(), // UTC (padrão internacional)
      timezone: {
        offset: timezoneOffset >= 0 ? `+${timezoneOffset}` : `${timezoneOffset}`,
        description: `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`,
      },
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'dev',
      database: {
        status: 'disconnected',
      },
    }

    try {
      // Verifica conexão com o banco
      if (AppDataSource.isInitialized) {
        await AppDataSource.query('SELECT 1')
        healthCheck.database.status = 'connected'
      }

      return res.status(200).json(healthCheck)
    } catch (error) {
      healthCheck.status = 'error'
      healthCheck.database.status = 'disconnected'

      return res.status(503).json(healthCheck)
    }
  }
}
```

**Arquivo:** `src/shared/infra/http/routes/health.routes.ts`

```typescript
import { Router } from 'express'
import { HealthController } from '../controllers/health_controller'

const healthRoutes = Router()
const healthController = new HealthController()

healthRoutes.get('/health', healthController.check)

export { healthRoutes }
```

**Arquivo:** `src/shared/infra/http/routes/index.ts`

```typescript
import { Router } from 'express'
import { healthRoutes } from './health.routes'
import { v1Routes } from './v1'

const routes = Router()

// Health Check (sem versão - sempre disponível)
routes.use(healthRoutes)

// API v1
routes.use('/api/v1', v1Routes)

// Futuras versões aqui
// routes.use('/api/v2', v2Routes)

export { routes }
```

**Arquivo:** `src/shared/infra/http/routes/v1/index.ts`

```typescript
import { Router } from 'express'
// import { userRoutes } from '@modules/user/infra/http/routes/user.routes'

const v1Routes = Router()

// Registrar rotas de módulos aqui
// v1Routes.use('/users', userRoutes)
// v1Routes.use('/products', productRoutes)

export { v1Routes }
```

### 🔢 Versionamento de API

**Estratégia:** URI Path Versioning (`/api/v1/resource`)

**Arquivo:** `src/shared/middlewares/apiVersion.ts`

```typescript
import { Request, Response, NextFunction } from 'express'

/**
 * Middleware para adicionar headers de versionamento e deprecação da API
 */

interface VersionConfig {
  version: string
  deprecated?: boolean
  sunset?: string // Data de descontinuação (ISO 8601)
  deprecationInfo?: string
}

export const apiVersionMiddleware = (config: VersionConfig) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Adiciona versão atual nos headers da resposta
    res.setHeader('X-API-Version', config.version)

    // Se a versão estiver depreciada, adiciona headers de aviso
    if (config.deprecated) {
      res.setHeader('X-API-Deprecated', 'true')

      if (config.sunset) {
        res.setHeader('X-API-Sunset', config.sunset)
      }

      if (config.deprecationInfo) {
        res.setHeader('X-API-Deprecation-Info', config.deprecationInfo)
      }

      // Adiciona warning header padrão (RFC 7234)
      const warningMessage = config.sunset
        ? `299 - "API version ${config.version} is deprecated and will be removed on ${config.sunset}"`
        : `299 - "API version ${config.version} is deprecated"`

      res.setHeader('Warning', warningMessage)
    }

    next()
  }
}
```

**Uso do Middleware:**

```typescript
// Em src/shared/infra/http/routes/v1/index.ts
import { apiVersionMiddleware } from '@shared/middlewares/apiVersion'

const v1Routes = Router()

// Aplicar middleware de versão
v1Routes.use(apiVersionMiddleware({ 
  version: '1.0',
  deprecated: false 
}))

// Quando precisar deprecar v1:
// v1Routes.use(apiVersionMiddleware({ 
//   version: '1.0',
//   deprecated: true,
//   sunset: '2026-06-01',
//   deprecationInfo: 'Please migrate to /api/v2'
// }))
```

**Padrões de URL:**

```
GET  /health              → Health check (sem versão)
GET  /api/v1/users        → Listar usuários (v1)
POST /api/v1/users        → Criar usuário (v1)
GET  /api/v1/users/:id    → Buscar usuário (v1)
GET  /api/v2/users        → Listar usuários (v2 - futuro)
```

**Quando criar nova versão:**
- ✅ Mudança estrutural no response (breaking change)
- ✅ Remoção de campos obrigatórios
- ✅ Mudança de tipo de dados
- ✅ Nova autenticação/autorização
- ❌ Adicionar campos opcionais (não precisa)
- ❌ Novos endpoints (não precisa)
- ❌ Bug fixes (não precisa)

**Manutenção de Versões:**
- Manter versões antigas por no mínimo 6 meses
- Comunicar deprecação com 3 meses de antecedência
- Usar headers para avisar sobre deprecação
- Documentar processo de migração

### 📝 Logger Winston

**Arquivo:** `src/shared/logger/logger.ts`

```typescript
import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { env } from '@shared/env'

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
)

const transports: winston.transport[] = [
  new DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
  }),
]

if (env.NODE_ENV === 'dev') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  )
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports,
})
```

### 🔧 Babel Config

**babel.config.js:**
```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        "@modules": "./src/modules",
        "@shared": "./src/shared",
        "@config": "./src/shared/config",
      }
    }],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-transform-class-properties", { "loose": true }],
  ],
}
```

### 🧪 Configuração Jest

**jest.config.ts:**
```typescript
import { pathsToModuleNameMapper } from 'ts-jest'
import { compilerOptions } from './tsconfig.json'

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/shared/infra/http/server.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  setupFilesAfterEnv: [],
}
```

### 🎨 Configuração ESLint

**.eslintrc.js:**
```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['dist', 'node_modules', 'coverage', '*.config.js', '*.config.ts'],
}
```

**.eslintignore:**
```
node_modules/
dist/
build/
coverage/
*.config.js
babel.config.js
jest.config.ts
.eslintrc.js
```

### 🎨 Configuração Prettier

**.prettierrc:**
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "tabWidth": 2,
  "endOfLine": "lf",
  "arrowParens": "avoid"
}
```

**.prettierignore:**
```
node_modules/
dist/
build/
coverage/
*.min.js
*.bundle.js
package-lock.json
yarn.lock
pnpm-lock.yaml
```

### 📝 Configuração EditorConfig

**.editorconfig:**
```ini
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.{json,yml,yaml}]
indent_size = 2
```

### 🔧 Versão do Node

**.node-version:** (usado por asdf, fnm, nodenv)
```
20.11.0
```

ou

**.nvmrc:** (usado por nvm)
```
20.11.0
```

**Nota:** Recomenda-se criar ambos os arquivos para máxima compatibilidade. Use a versão LTS mais recente do Node.js (20.x ou superior).

### 🧪 Exemplos de Testes

**Teste Unitário** (ex: `src/modules/user/__tests__/unit/create-user.service.spec.ts`):
```typescript
import { CreateUserService } from '@modules/user/services/CreateUserService'
import { IUsersRepository } from '@modules/user/domain/repositories/IUsersRepository'

describe('CreateUserService', () => {
  let createUser: CreateUserService
  let usersRepository: jest.Mocked<IUsersRepository>

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
    } as any

    createUser = new CreateUserService(usersRepository)
  })

  it('should create a new user', async () => {
    usersRepository.findByEmail.mockResolvedValue(null)
    usersRepository.save.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    } as any)

    const result = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    expect(result).toHaveProperty('id')
    expect(result.name).toBe('John Doe')
    expect(usersRepository.save).toHaveBeenCalled()
  })
})
```

**Teste de Integração** (ex: `src/modules/user/__tests__/integration/create-user.spec.ts`):
```typescript
import request from 'supertest'
import { app } from '@shared/infra/http/app'
import { AppDataSource } from '@shared/infra/database/data-source'

describe('POST /users', () => {
  beforeAll(async () => {
    await AppDataSource.initialize()
  })

  afterAll(async () => {
    await AppDataSource.destroy()
  })

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('John Doe')
  })
})
```

**Teste Health Check** (ex: `src/shared/infra/http/__tests__/health.spec.ts`):
```typescript
import request from 'supertest'
import { app } from '@shared/infra/http/app'
import { AppDataSource } from '@shared/infra/database/data-source'

describe('GET /health', () => {
  beforeAll(async () => {
    await AppDataSource.initialize()
  })

  afterAll(async () => {
    await AppDataSource.destroy()
  })

  it('should return health status', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'ok')
    expect(response.body).toHaveProperty('timestamp')
    expect(response.body).toHaveProperty('timezone')
    expect(response.body.timezone).toHaveProperty('offset')
    expect(response.body.timezone).toHaveProperty('description')
    expect(response.body).toHaveProperty('uptime')
    expect(response.body).toHaveProperty('environment')
    expect(response.body).toHaveProperty('database')
    expect(response.body.database).toHaveProperty('status', 'connected')
  })

  it('should return correct structure', async () => {
    const response = await request(app).get('/health')

    expect(response.body).toHaveProperty('status')
    expect(response.body).toHaveProperty('timestamp')
    expect(response.body).toHaveProperty('timezone')
    expect(response.body).toHaveProperty('uptime')
    expect(response.body).toHaveProperty('environment')
    expect(response.body.database).toHaveProperty('status')
  })
})
```

---

## 4. ✓ Regras: DEVE / NÃO DEVE

### ✅ DEVE:

- **DEVE** usar TypeORM DataSource
- **DEVE** usar decorators do TypeORM para entidades (@Entity, @Column, etc.)
- **DEVE** separar interfaces de domain das implementações de infra
- **DEVE** usar Repository Pattern com interfaces
- **DEVE** usar Dependency Injection com TSyringe
- **DEVE** validar todas as variáveis de ambiente com Zod
- **DEVE** usar `synchronize: true` APENAS em desenvolvimento
- **DEVE** usar UTC para datas no banco de dados
- **DEVE** usar httpOnly cookies para armazenar JWT tokens
- **DEVE** usar bcryptjs para hash de senhas
- **DEVE** implementar logger estruturado (Winston)
- **DEVE** usar express-async-errors para capturar erros assíncronos
- **DEVE** validar payloads de requisições com Zod
- **DEVE** usar path aliases (@shared, @modules, etc.)
- **DEVE** tipar tudo com TypeScript (evitar any)
- **DEVE** criar arquivo .env.example com todas as variáveis
- **DEVE** adicionar .env ao .gitignore
- **DEVE** usar charset utf8mb4 no MySQL
- **DEVE** criar pasta logs/ e adicionar ao .gitignore
- **DEVE** criar testes unitários e de integração
- **DEVE** criar testes de cobertura de código
- **DEVE** configurar ESLint com regras do TypeScript
- **DEVE** configurar Prettier para formatação consistente
- **DEVE** criar .editorconfig para consistência entre IDEs
- **DEVE** definir versão do Node.js (.node-version ou .nvmrc)
- **DEVE** criar rota GET /health para monitoramento (health check)
- **DEVE** validar conexão com banco de dados na rota /health
- **DEVE** usar versionamento de API no path (/api/v1/resource)
- **DEVE** manter health check sem versão (/health)
- **DEVE** adicionar headers de versionamento nas respostas (X-API-Version)
- **DEVE** comunicar deprecação via headers (X-API-Deprecated, X-API-Sunset)
- **DEVE** manter versões antigas por no mínimo 6 meses
- **DEVE** criar pasta docs/ para documentação
- **DEVE** criar arquivos .md de documentação dentro de docs/ (exceto README.md)
- **DEVE** manter README.md na raiz do projeto

### ❌ NÃO DEVE:

- **NÃO DEVE** criar sistema de migrations
- **NÃO DEVE** usar `synchronize: true` em produção
- **NÃO DEVE** usar ormconfig.json (usar DataSource)
- **NÃO DEVE** expor erros detalhados em produção
- **NÃO DEVE** usar console.log (usar logger)
- **NÃO DEVE** armazenar secrets no código
- **NÃO DEVE** fazer queries SQL diretas (usar Repository)
- **NÃO DEVE** deixar portas hardcoded
- **NÃO DEVE** ignorar validação de environment
- **NÃO DEVE** fazer commits com senhas ou secrets
- **NÃO DEVE** usar tipos `any` sem justificativa
- **NÃO DEVE** criar código duplicado
- **NÃO DEVE** criar arquivos de migração
- **NÃO DEVE** ignorar a criação de testes (testes são obrigatórios)
- **NÃO DEVE** deixar código sem cobertura de testes adequada
- **NÃO DEVE** criar breaking changes sem nova versão da API
- **NÃO DEVE** versionar health check ou endpoints de sistema
- **NÃO DEVE** remover versões antigas sem período de deprecação
- **NÃO DEVE** usar query parameters ou headers para versionamento
- **NÃO DEVE** criar arquivos .md de documentação na raiz (exceto README.md)
- **NÃO DEVE** criar arquivos .md fora da pasta docs/ (exceto README.md e arquivos de contexto específico)

### ⚠️ ATENÇÃO ESPECIAL:

- **Senhas:** SEMPRE usar bcryptjs com salt rounds >= 10
- **JWT:** SEMPRE usar secrets fortes (min 32 caracteres)
- **Cookies:** SEMPRE usar httpOnly: true, secure em produção
- **Queries:** SEMPRE usar prepared statements (TypeORM faz automaticamente)
- **Datas e Timezone:** 
  - SEMPRE usar UTC no backend e banco de dados
  - TypeORM DataSource com timezone: 'Z'
  - Timestamps em formato ISO 8601 (UTC)
  - Incluir informação de timezone offset em respostas quando relevante
  - Frontend converte para timezone local do usuário
- **Erros:** SEMPRE usar logger, nunca console.log
- **Secrets:** SEMPRE validar com Zod e nunca commitar .env

---

## 5. 📋 Formato da Resposta

**Estrutura desejada:**
1. Criar estrutura de pastas completa (mesmo vazios)
2. Criar pasta docs/ para documentação
3. Configurar todos os arquivos necessários (mesmo vazios)
4. Instalar todas as dependências
5. Configurar TypeORM DataSource (mesmo vazios)
6. Configurar validação de ambiente (mesmo vazios)
7. Criar exemplo de módulo (mesmo vazios)
8. Criar arquivos de documentação em docs/
9. Subir servidor para validação
10. Apresentar checklist de validação 
11. Apresentar resumo da configuração

**Resumo da configuração:**
- Projeto inicializado com todas as dependências instaladas
- Estrutura de pastas seguindo Clean Architecture
- Pasta docs/ criada para documentação
- README.md na raiz do projeto
- Arquivos de documentação em docs/ (LEIA-ME, QUICK_START, CHECKLIST, etc.)
- Logger Winston configurado com rotação diária
- Servidor HTTP rodando sem erros ou warnings
- TypeScript compilando sem erros
- ESLint configurado (sem erros)
- Prettier configurado
- .prettierrc configurado
- .editorconfig configurado
- .prettierignore configurado
- .eslintignore configurado
- .eslintrc.js configurado
- .node-version ou .nvmrc configurado
- Testes unitários e de integração
- Testes de cobertura de código
- Arquivo .env.example criado
- CORS configurado corretamente
- Express app com tratamento de erros centralizado
- Path aliases funcionando (@shared, @modules, etc.)
- Babel configurado para build de produção
- Porta configurável via environment
- Logs sendo salvos em arquivo
- Rota GET /health configurada para monitoramento

**Estilo:**
- Técnico e objetivo
- Comentários em código quando necessário
- Mensagens de log em português (pt-BR)
- Seguir convenções do Node.js/TypeScript

---

## 6. 👤 Persona / Tom

**Perspectiva:**
Desenvolvedor backend sênior especializado em Node.js, TypeScript, Clean Architecture e melhores práticas

**Tom da explicação:**
Técnico, objetivo e didático. Explicar decisões importantes mas ser direto na implementação.

**Nível de profundidade:**
Aprofundado com edge cases, foco em segurança, performance e manutenibilidade.

---

## 7. ✅ Critérios de Aceite

- [ ] Projeto inicializado com todas as dependências instaladas
- [ ] TypeORM configurado com DataSource e conectado ao MySQL
- [ ] Variáveis de ambiente validadas com Zod
- [ ] Estrutura de pastas seguindo Clean Architecture
- [ ] Logger Winston configurado com rotação diária
- [ ] Servidor HTTP rodando sem erros ou warnings
- [ ] TypeScript compilando sem erros
- [ ] ESLint configurado (sem erros)
- [ ] Prettier configurado
- [ ] .editorconfig criado
- [ ] .node-version ou .nvmrc criado
- [ ] Testes unitários e de integração
- [ ] Testes de cobertura de código
- [ ] Arquivo .env.example criado
- [ ] CORS configurado corretamente
- [ ] Express app com tratamento de erros centralizado
- [ ] Path aliases funcionando (@shared, @modules, etc.)
- [ ] Babel configurado para build de produção
- [ ] Porta configurável via environment
- [ ] Logs sendo salvos em arquivo
- [ ] Rota GET /health funcionando e retornando status
- [ ] Health check validando conexão com banco de dados
- [ ] Checklist de validação completo
- [ ] Resumo da configuração completo

---

## 8. 📋 CHECKLIST DE VALIDAÇÃO FINAL

Antes de considerar o projeto concluído, validar:

### 📦 Dependências
- [ ] Todas as dependências instaladas (npm install executado)
- [ ] package.json contém todas as dependências listadas
- [ ] node_modules/ adicionado ao .gitignore

### 🗂️ Estrutura
- [ ] Pasta src/ com estrutura modular (mesmo vazios)
- [ ] Pasta shared/ com config, env, errors, logger, infra
- [ ] Pasta logs/ criada e adicionada ao .gitignore
- [ ] Pasta docs/ criada para documentação
- [ ] README.md na raiz do projeto
- [ ] Arquivos .md de documentação em docs/ (LEIA-ME, QUICK_START, CHECKLIST)
- [ ] Todos os arquivos de configuração criados (mesmo vazios)
- [ ] Todos os arquivos de teste criados (mesmo vazios)

### ⚙️ Configurações
- [ ] tsconfig.json com paths aliases configurados
- [ ] babel.config.js configurado
- [ ] jest.config.ts configurado
- [ ] .eslintrc.js configurado
- [ ] .eslintignore criado
- [ ] .prettierrc configurado
- [ ] .prettierignore criado
- [ ] .editorconfig criado
- [ ] .node-version ou .nvmrc criado
- [ ] .env.example criado com todas as variáveis
- [ ] .env criado (não commitar!)
- [ ] .gitignore atualizado (node_modules, logs, .env, dist, coverage)

### 🗄️ Banco de Dados
- [ ] DataSource TypeORM configurado
- [ ] Conexão com MySQL funcionando
- [ ] Charset utf8mb4 configurado
- [ ] synchronize: true apenas em dev

### 🔧 TypeScript
- [ ] Compilação sem erros (tsc)
- [ ] Path aliases funcionando
- [ ] Decorators habilitados
- [ ] Types corretos importados
- [ ] Testes unitários e de integração
- [ ] Testes de cobertura de código

### 🚀 Servidor
- [ ] Servidor inicia sem erros
- [ ] Porta configurável via ENV
- [ ] Logger funcionando
- [ ] CORS configurado
- [ ] Express-async-errors configurado
- [ ] Tratamento de erros global funcionando
- [ ] Rota GET /health configurada
- [ ] Health check retorna status 200 quando saudável
- [ ] Health check valida conexão com banco de dados

### 🔍 Linter e Formatação
- [ ] ESLint configurado (.eslintrc.js)
- [ ] ESLint sem erros (npm run lint)
- [ ] .eslintignore criado
- [ ] Prettier configurado (.prettierrc)
- [ ] .prettierignore criado
- [ ] npm run format executa sem erros
- [ ] .editorconfig criado
- [ ] .node-version ou .nvmrc criado

### 📝 Logs
- [ ] Logger Winston funcionando
- [ ] Logs salvos em logs/application-DATE.log
- [ ] Rotação diária configurada
- [ ] Console logs apenas em dev

### 🧪 Testes
- [ ] Configuração do Jest criada (jest.config.ts)
- [ ] Estrutura de testes criada (__tests__/unit e __tests__/integration)
- [ ] npm test executa sem erros
- [ ] npm run test:coverage gera relatório de cobertura
- [ ] Cobertura de código >= 80%

### 🧪 Testes Manuais
- [ ] npm run dev inicia servidor
- [ ] Servidor responde na porta configurada
- [ ] Conexão com banco estabelecida
- [ ] Rota GET /health retorna status 200
- [ ] Health check mostra database.status: "connected"
- [ ] Nenhum warning ou erro no console

---

## 💡 OBSERVAÇÕES IMPORTANTES

### 🔐 Segurança
- Gerar JWT secrets fortes (usar `openssl rand -base64 32`)
- Nunca commitar arquivo .env
- Usar httpOnly cookies para tokens
- Validar todos os inputs com Zod
- Hash de senhas com bcryptjs (salt rounds >= 10)

### 🏗️ Arquitetura
- Cada módulo é independente
- Domain layer não conhece infra layer
- Use interfaces para desacoplar
- Services contêm business logic
- Controllers apenas recebem/enviam dados
- Testes unitários e de integração
- Testes de cobertura de código

### 📊 Performance
- Use indexes no MySQL quando necessário
- Evite N+1 queries (use relations do TypeORM)
- Configure connection pool adequadamente
- Use cache quando apropriado (Redis)

### 🧪 Testes
- Jest para testes unitários
- Supertest para testes de integração
- Mock repositories para isolar testes
- Test coverage >= 80%

### 📊 Monitoramento
- Implementar rota GET /health para health checks
- Health check deve validar:
  - Status do servidor (uptime, timestamp)
  - Timezone do servidor (offset UTC)
  - Conexão com banco de dados
  - Retornar HTTP 200 quando saudável
  - Retornar HTTP 503 quando com problemas
- **IMPORTANTE - Timezone:**
  - Backend sempre trabalha com UTC (padrão internacional)
  - Timestamp em formato ISO 8601 (UTC)
  - Incluir informação de timezone offset no health check
  - Frontend é responsável por converter para timezone local
  - Banco de dados configurado com timezone: 'Z' (UTC)
- Usar /health para:
  - Load balancers (ALB, NGINX)
  - Orquestradores (Kubernetes, Docker Swarm)
  - Ferramentas de monitoramento (Prometheus, Datadog, New Relic)

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

1. **Inicializar projeto**
   - npm init
   - Instalar dependências

2. **Configurar TypeScript + Babel + Jest + Linters**
   - tsconfig.json
   - babel.config.js
   - jest.config.ts
   - .eslintrc.js
   - .eslintignore
   - .prettierrc
   - .prettierignore
   - .editorconfig
   - .node-version (ou .nvmrc)

3. **Criar estrutura de pastas**
   - src/shared
   - src/modules

4. **Configurar environment**
   - src/shared/env/index.ts
   - .env.example
   - .env

5. **Configurar logger**
   - src/shared/logger/logger.ts

6. **Configurar database**
   - src/shared/infra/database/data-source.ts

7. **Configurar Express**
   - src/shared/infra/http/app.ts
   - src/shared/infra/http/server.ts
   - src/shared/infra/http/controllers/health_controller.ts
   - src/shared/infra/http/routes/health.routes.ts
   - src/shared/infra/http/routes/index.ts

8. **Configurar DI Container**
   - src/shared/infra/http/container/index.ts

9. **Testar servidor**
   - npm run dev
   - Validar conexão com banco
   - Verificar logs

10. **Validações finais**
    - npm run lint
    - npm run build (testar build)
    - Checklist completo

---

## 🚀 COMANDO FINAL DE TESTE

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção (após build)
npm start

# Linter
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:check

# Testes
npm test

# Testes com watch
npm run test:watch

# Testes com cobertura
npm run test:coverage
```

**Servidor deve iniciar em:** `http://localhost:3333`
**Log esperado:** `🚀 HTTP server started on port 3333!`

**Teste Health Check:**
```bash
# Testar rota de health check
curl http://localhost:3333/health

# Resposta esperada:
{
  "status": "ok",
  "timestamp": "2026-01-06T20:17:52.281Z",
  "timezone": {
    "offset": "-3",
    "description": "UTC-3"
  },
  "uptime": 123.456,
  "environment": "dev",
  "database": {
    "status": "connected"
  }
}
```

---

## 📚 Referências

- [TypeORM Documentation](https://typeorm.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Autor:** André Luiz dos Santos  
**Status:** ✅ Pronto para uso

