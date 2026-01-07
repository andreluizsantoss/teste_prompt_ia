# ILPI Portaria API

API Backend desenvolvida com Node.js + TypeScript + Express + TypeORM seguindo Clean Architecture.

## 🚀 Tecnologias

- Node.js 20.x
- TypeScript 5.2
- Express.js 4.x
- TypeORM 0.3.x
- MySQL 8.0
- Winston (Logger)
- Zod (Validação)
- Jest (Testes)

## 📋 Pré-requisitos

- Node.js 20.x ou superior
- MySQL 8.0 ou superior
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

5. Certifique-se de que o banco de dados MySQL está rodando

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
├── modules/              # Módulos de domínio
│   └── [nome_modulo]/
│       ├── domain/       # Entidades e interfaces
│       ├── infra/        # Implementações (HTTP, Repos)
│       ├── services/     # Casos de uso
│       └── __tests__/    # Testes
└── shared/
    ├── config/           # Configurações
    ├── env/              # Validação de ambiente
    ├── errors/           # Errors customizados
    ├── logger/           # Logger Winston
    ├── middlewares/      # Middlewares globais
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

## 📄 Licença

ISC

## 👤 Autor

André Luiz dos Santos

