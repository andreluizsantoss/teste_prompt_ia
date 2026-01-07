# ILPI Portaria API

API Backend desenvolvida com Node.js + TypeScript + Express + TypeORM seguindo Clean Architecture.

Sistema de gerenciamento de portaria para Instituições de Longa Permanência para Idosos (ILPI).

## 🚀 Tecnologias

- Node.js 20.x
- TypeScript 5.2
- Express.js 4.x
- TypeORM 0.3.x
- SQL Server 2016+
- Winston (Logger)
- Zod (Validação)
- Jest (Testes)
- JWT (Autenticação)
- bcryptjs (Criptografia)
- tsyringe (Injeção de Dependência)

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- SQL Server 2016 ou superior
- npm ou yarn

## ⚙️ Configuração

1. Clone o repositório

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações

5. Execute o script SQL de criação do banco de dados:
   - Abra o SQL Server Management Studio
   - Execute o arquivo `database/create-database.sql`

6. Certifique-se de que o banco de dados SQL Server está rodando e acessível

## 🏃 Executando o projeto

### Desenvolvimento
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Produção
```bash
npm start
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes em modo watch
npm run test:watch

# Testes com cobertura
npm run test:coverage
```

## 🔍 Linter e Formatação

```bash
# Verificar linter
npm run lint

# Corrigir problemas de linter
npm run lint:fix

# Formatar código
npm run format

# Verificar formatação
npm run format:check
```

## 📁 Estrutura do Projeto

```
src/
├── @types/               # Definições de tipos TypeScript
├── modules/              # Módulos de domínio
│   ├── authentication/   # Módulo de autenticação JWT
│   ├── configuracao/     # Configurações do sistema
│   ├── funcionario/      # Gestão de funcionários
│   ├── idoso/            # Gestão de idosos
│   ├── mensagem/         # Sistema de mensagens
│   ├── prestador-servico/# Prestadores de serviço
│   ├── veiculo/          # Gestão de veículos
│   └── visitante/        # Gestão de visitantes
└── shared/
    ├── config/           # Configurações (auth, etc)
    ├── env/              # Validação de ambiente
    ├── errors/           # Errors customizados
    ├── logger/           # Logger Winston
    ├── middlewares/      # Middlewares (auth, version, etc)
    └── infra/
        ├── database/     # TypeORM DataSource
        └── http/         # Express app e rotas
```

## 🏥 Health Check

Endpoint de monitoramento disponível em:
```
GET /health
```

Resposta:
```json
{
  "status": "ok",
  "timestamp": "2026-01-07T08:44:06.236Z",
  "uptime": 123.456,
  "environment": "dev",
  "database": {
    "status": "connected"
  }
}
```

**Observação:** O timestamp está configurado para o timezone do Brasil (UTC-3). Esta é uma escolha específica deste projeto.

## 🔐 Autenticação

A API utiliza autenticação JWT via JSON (não HTTP-only cookies) para suportar aplicativos mobile.

### Endpoints de Autenticação

#### Login
```http
POST /api/v1/auth/session
Content-Type: application/json

{
  "cpf": "12345678900",
  "password": "senha123",
  "iosDeviceToken": "token_opcional",
  "androidDeviceToken": "token_opcional"
}
```

Resposta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Renovar Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Buscar Usuário Autenticado
```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

#### Atualizar Device Tokens
```http
PUT /api/v1/auth/device
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "iosDeviceToken": "novo_token_ios",
  "androidDeviceToken": "novo_token_android"
}
```

### Como usar nos Aplicativos Mobile

1. **Login**: Envie CPF e senha para `/api/v1/auth/session`
2. **Armazene os tokens**: Salve `access_token` e `refresh_token` localmente
3. **Requisições autenticadas**: Envie o `access_token` no header:
   ```
   Authorization: Bearer <access_token>
   ```
4. **Token expirado**: Quando receber erro 401, use o `refresh_token` para renovar em `/api/v1/auth/refresh`
5. **Renovação**: Armazene os novos tokens recebidos

## 📝 API Versionamento

A API utiliza versionamento por URI:
```
/api/v1/resource
/api/v2/resource
```

## 📚 Documentação

Documentação completa disponível na pasta `docs/`:

### Guias Principais

- **[LEIA-ME.md](docs/LEIA-ME.md)** - Guia completo em português 🇧🇷
- **[QUICK_START.md](docs/QUICK_START.md)** - Início rápido (5 minutos)
- **[SETUP_COMPLETO.md](docs/SETUP_COMPLETO.md)** - Detalhes da configuração
- **[CHECKLIST.md](docs/CHECKLIST.md)** - Lista de verificação

### Banco de Dados

- **[database/README.md](database/README.md)** - Documentação do banco de dados
- **[database/create-database.sql](database/create-database.sql)** - Script de criação
- **[docs/MIGRACAO_PRISMA_TYPEORM.md](docs/MIGRACAO_PRISMA_TYPEORM.md)** - Guia de migração Prisma → TypeORM

### Guias Técnicos

- **[TIMEZONE_INFO.md](docs/TIMEZONE_INFO.md)** - Guia de timezone e datas
- **[src/modules/README_MODULE_TEMPLATE.md](src/modules/README_MODULE_TEMPLATE.md)** - Como criar módulos
- **[src/shared/infra/http/__tests__/README_TESTS.md](src/shared/infra/http/__tests__/README_TESTS.md)** - Guia de testes

### Changelogs & Resumos

- **[CHANGELOG_TIMEZONE_BRASIL.md](docs/CHANGELOG_TIMEZONE_BRASIL.md)** - 🇧🇷 Configuração timezone do Brasil (UTC-3)
- **[CHANGELOG_ATUALIZACAO_DEPENDENCIAS.md](docs/CHANGELOG_ATUALIZACAO_DEPENDENCIAS.md)** - Atualização de dependências (ESLint v9)
- **[CHANGELOG_TIMEZONE.md](docs/CHANGELOG_TIMEZONE.md)** - Refatoração de timezone (histórico)
- **[CHANGELOG_ORGANIZACAO.md](docs/CHANGELOG_ORGANIZACAO.md)** - Organização da documentação
- **[RESUMO_REFATORACAO.md](docs/RESUMO_REFATORACAO.md)** - Resumo de refatorações
- **[RESUMO_ORGANIZACAO.md](docs/RESUMO_ORGANIZACAO.md)** - Resumo da organização

## 🔒 Segurança

- Tokens JWT com expiração configurável
- Refresh tokens hasheados com bcryptjs
- Senhas nunca retornadas nas respostas da API
- Middleware de autenticação para rotas protegidas
- Validação de dados com Zod
- Logging de tentativas de autenticação

## 🏗️ Arquitetura

O projeto segue os princípios da **Clean Architecture**:

- **Domain Layer**: Entidades e interfaces de domínio
- **Service Layer**: Casos de uso e lógica de negócio
- **Infrastructure Layer**: Implementações técnicas (HTTP, Banco de Dados)
- **Dependency Injection**: Utiliza tsyringe para IoC

## 📄 Licença

ISC

## 👤 Autor

André Luiz dos Santos

