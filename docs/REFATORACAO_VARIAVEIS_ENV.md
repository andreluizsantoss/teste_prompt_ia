# 🔧 Refatoração de Variáveis de Ambiente

## 📋 Resumo

Refatoração completa do sistema de variáveis de ambiente para seguir o padrão do projeto anterior, com prefixo `ILPI_CONCIERGE_` e novas configurações para email e Google Cloud.

**Data**: 07/01/2026  
**Status**: ✅ COMPLETO

---

## 🎯 Mudanças Principais

### 1. Padrão de Nomenclatura

**Antes:**
```env
NODE_ENV=dev
PORT=3333
DB_HOST=localhost
JWT_SECRET=...
```

**Depois:**
```env
ILPI_CONCIERGE_NODE_ENV=dev
ILPI_CONCIERGE_PORT=3333
ILPI_CONCIERGE_DATABASE_URL=mssql://sa:senha@localhost:1433/ILPI_Portaria
ILPI_CONCIERGE_JWT_SECRET=...
```

### 2. Banco de Dados - DATABASE_URL

**Mudança Significativa**: Consolidação de 5 variáveis em 1

**Antes:**
```env
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=senha
DB_DATABASE=ILPI_Portaria
```

**Depois:**
```env
ILPI_CONCIERGE_DATABASE_URL=mssql://sa:senha@localhost:1433/ILPI_Portaria
```

**Benefícios:**
- Simplificação da configuração
- Padrão comum em frameworks modernos
- Facilita deploy em cloud (Heroku, Railway, etc)

### 3. Novas Variáveis Adicionadas

#### Email
```env
ILPI_CONCIERGE_MAIL_DRIVER=ethereal
ILPI_CONCIERGE_HOST_EMAIL=smtp.ethereal.email
ILPI_CONCIERGE_NAME_EMAIL=ILPI Portaria
ILPI_CONCIERGE_CREDENTIAL_EMAIL=email@example.com
ILPI_CONCIERGE_CREDENTIAL_PASSWORD=senha
ILPI_CONCIERGE_PORT_EMAIL=587
```

#### Google Cloud
```env
ILPI_CONCIERGE_GOOGLE_APPLICATION_CREDENTIALS=./credentials/google.json
```

#### Outras
```env
ILPI_CONCIERGE_FRONTEND_PERMISSION=http://localhost:3000
ILPI_CONCIERGE_KILOMETRAGEM=0
ILPI_CONCIERGE_REFRESH_TOKEN_LIFE_MS=604800000
```

---

## 📁 Arquivos Modificados

### Core

**`src/shared/env/index.ts`**
- ✅ Todas as variáveis renomeadas com prefixo `ILPI_CONCIERGE_`
- ✅ Novas variáveis adicionadas (EMAIL, GOOGLE)
- ✅ Configuração do Google Credentials

**`src/shared/infra/database/data-source.ts`**
- ✅ Parser de `DATABASE_URL` implementado
- ✅ Suporte ao formato: `mssql://username:password@host:port/database`
- ✅ Validação de formato de URL

**`src/shared/config/auth.ts`**
- ✅ Variáveis JWT atualizadas
- ✅ Adicionado `lifeMs` para refresh token

### Infraestrutura HTTP

**`src/shared/infra/http/app.ts`**
- ✅ CORS usando `ILPI_CONCIERGE_FRONTEND_PERMISSION`

**`src/shared/infra/http/server.ts`**
- ✅ Porta usando `ILPI_CONCIERGE_PORT`
- ✅ Ambiente usando `ILPI_CONCIERGE_NODE_ENV`

**`src/shared/infra/http/controllers/health_controller.ts`**
- ✅ Ambiente usando `ILPI_CONCIERGE_NODE_ENV`

### Shared

**`src/shared/logger/logger.ts`**
- ✅ Configuração de logs baseada em `ILPI_CONCIERGE_NODE_ENV`

**`src/shared/middlewares/errorHandler.ts`**
- ✅ Mensagens de erro baseadas em `ILPI_CONCIERGE_NODE_ENV`

### Controllers e Services

**Módulo de Autenticação:**
- ✅ `FindUserByTokenController.ts` - Variáveis não usadas prefixadas com `_`
- ✅ `UpdateDeviceTokenController.ts` - Variáveis não usadas prefixadas com `_`
- ✅ `FindUserByTokenService.ts` - Variáveis não usadas prefixadas com `_`
- ✅ `UpdateDeviceTokenService.ts` - Variáveis não usadas prefixadas com `_`

### Configuração

**`eslint.config.mjs`**
- ✅ Pasta `example/` adicionada aos ignores

**`env.example`** (Criado)
- ✅ Template completo com novo padrão
- ✅ Documentação inline detalhada
- ✅ Exemplos e notas de segurança

---

## 🔍 Parser de DATABASE_URL

### Implementação

```typescript
function parseDatabaseUrl(url: string) {
  const regex = /^mssql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/
  const match = url.match(regex)

  if (!match) {
    throw new Error(
      'DATABASE_URL inválida. Formato esperado: mssql://username:password@host:port/database'
    )
  }

  return {
    username: decodeURIComponent(match[1]),
    password: decodeURIComponent(match[2]),
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5]
  }
}
```

### Características

- ✅ Suporta URL encoding (para senhas com caracteres especiais)
- ✅ Validação de formato
- ✅ Mensagem de erro clara
- ✅ Parsing robusto com regex

### Exemplo de Uso

```env
# Senha simples
ILPI_CONCIERGE_DATABASE_URL=mssql://sa:MyPassword123@localhost:1433/ILPI_Portaria

# Senha com caracteres especiais (url-encoded)
ILPI_CONCIERGE_DATABASE_URL=mssql://sa:My%40Pass%23123@localhost:1433/ILPI_Portaria
```

---

## 📊 Mapeamento Completo de Variáveis

### Ambiente

| Antes | Depois | Descrição |
|-------|--------|-----------|
| `NODE_ENV` | `ILPI_CONCIERGE_NODE_ENV` | Ambiente de execução |
| `PORT` | `ILPI_CONCIERGE_PORT` | Porta do servidor |
| - | `ILPI_CONCIERGE_FRONTEND_PERMISSION` | URL do frontend (CORS) |
| - | `ILPI_CONCIERGE_KILOMETRAGEM` | Quilometragem padrão |

### Banco de Dados

| Antes | Depois | Descrição |
|-------|--------|-----------|
| `DB_HOST` | - | Removido |
| `DB_PORT` | - | Removido |
| `DB_USERNAME` | - | Removido |
| `DB_PASSWORD` | - | Removido |
| `DB_DATABASE` | - | Removido |
| - | `ILPI_CONCIERGE_DATABASE_URL` | URL completa do banco |

### JWT

| Antes | Depois | Descrição |
|-------|--------|-----------|
| `JWT_SECRET` | `ILPI_CONCIERGE_JWT_SECRET` | Chave do access token |
| `ACCESS_TOKEN_LIFE` | `ILPI_CONCIERGE_ACCESS_TOKEN_LIFE` | Vida do access token |
| `REFRESH_TOKEN_SECRET` | `ILPI_CONCIERGE_REFRESH_TOKEN_SECRET` | Chave do refresh token |
| `REFRESH_TOKEN_LIFE` | `ILPI_CONCIERGE_REFRESH_TOKEN_LIFE` | Vida do refresh token |
| `REFRESH_TOKEN_NOT_BEFORE` | `ILPI_CONCIERGE_REFRESH_TOKEN_NOT_BEFORE` | NBF do refresh token |
| - | `ILPI_CONCIERGE_REFRESH_TOKEN_LIFE_MS` | Vida em ms |

### Email (Novas)

| Variável | Descrição |
|----------|-----------|
| `ILPI_CONCIERGE_MAIL_DRIVER` | Driver de email (ethereal/smtp) |
| `ILPI_CONCIERGE_HOST_EMAIL` | Host do servidor SMTP |
| `ILPI_CONCIERGE_NAME_EMAIL` | Nome do remetente |
| `ILPI_CONCIERGE_CREDENTIAL_EMAIL` | Email de autenticação |
| `ILPI_CONCIERGE_CREDENTIAL_PASSWORD` | Senha de autenticação |
| `ILPI_CONCIERGE_PORT_EMAIL` | Porta SMTP |

### Google Cloud (Nova)

| Variável | Descrição |
|----------|-----------|
| `ILPI_CONCIERGE_GOOGLE_APPLICATION_CREDENTIALS` | Caminho para credenciais Google |

---

## ✅ Testes Realizados

### 1. Validação de Lint
```bash
npm run lint
```
**Resultado**: ✅ Sem erros

### 2. Validação de Tipos
```bash
npx tsc --noEmit
```
**Resultado**: ✅ Compilação bem-sucedida

### 3. Verificação de Imports
- ✅ Todos os arquivos usando `env` corretamente
- ✅ Nenhum uso direto de `process.env` (exceto em env/index.ts)
- ✅ Todas as referências atualizadas

### 4. Teste de Parser de DATABASE_URL
```typescript
// Testes de formato válido
parseDatabaseUrl('mssql://sa:senha@localhost:1433/DB') // ✅ OK
parseDatabaseUrl('mssql://user:pass%40123@server:1433/db') // ✅ OK

// Testes de formato inválido
parseDatabaseUrl('mysql://user:pass@host:1433/db') // ❌ Erro
parseDatabaseUrl('mssql://user@host:1433/db') // ❌ Erro
```

---

## 📝 Migração para Desenvolvedores

### Passo 1: Atualizar .env

**Opção A: Usar novo template**
```bash
cp env.example .env
# Editar .env com suas configurações
```

**Opção B: Migrar manualmente**
```env
# Antes
NODE_ENV=dev
PORT=3333
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=senha
DB_DATABASE=ILPI_Portaria
FRONTEND_URL=http://localhost:3000
JWT_SECRET=...
```

```env
# Depois
ILPI_CONCIERGE_NODE_ENV=dev
ILPI_CONCIERGE_PORT=3333
ILPI_CONCIERGE_DATABASE_URL=mssql://sa:senha@localhost:1433/ILPI_Portaria
ILPI_CONCIERGE_FRONTEND_PERMISSION=http://localhost:3000
ILPI_CONCIERGE_JWT_SECRET=...
ILPI_CONCIERGE_ACCESS_TOKEN_LIFE=15m
ILPI_CONCIERGE_REFRESH_TOKEN_SECRET=...
ILPI_CONCIERGE_REFRESH_TOKEN_LIFE=7d
ILPI_CONCIERGE_REFRESH_TOKEN_NOT_BEFORE=0
ILPI_CONCIERGE_REFRESH_TOKEN_LIFE_MS=604800000
ILPI_CONCIERGE_KILOMETRAGEM=0

# Novas (Email - opcional)
ILPI_CONCIERGE_MAIL_DRIVER=ethereal
ILPI_CONCIERGE_HOST_EMAIL=smtp.ethereal.email
ILPI_CONCIERGE_NAME_EMAIL=ILPI Portaria
ILPI_CONCIERGE_CREDENTIAL_EMAIL=email@example.com
ILPI_CONCIERGE_CREDENTIAL_PASSWORD=senha
ILPI_CONCIERGE_PORT_EMAIL=587

# Opcional
# ILPI_CONCIERGE_GOOGLE_APPLICATION_CREDENTIALS=./credentials/google.json
```

### Passo 2: Testar

```bash
npm run lint
npm run dev
```

---

## 🚨 Breaking Changes

### 1. DATABASE_URL

**Antes:**
```typescript
const db = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  // ...
}
```

**Depois:**
```typescript
const dbConfig = parseDatabaseUrl(env.ILPI_CONCIERGE_DATABASE_URL)
const db = {
  host: dbConfig.host,
  port: dbConfig.port,
  // ...
}
```

### 2. Todas as Variáveis

**Antes:**
```typescript
console.log(env.NODE_ENV)
console.log(env.PORT)
console.log(env.JWT_SECRET)
```

**Depois:**
```typescript
console.log(env.ILPI_CONCIERGE_NODE_ENV)
console.log(env.ILPI_CONCIERGE_PORT)
console.log(env.ILPI_CONCIERGE_JWT_SECRET)
```

---

## 💡 Benefícios

### 1. Namespace Claro
- Evita conflitos com variáveis do sistema
- Identifica facilmente variáveis do projeto
- Padronização entre ambientes

### 2. Simplificação
- DATABASE_URL: 5 variáveis → 1 variável
- Menos configuração manual
- Compatível com cloud providers

### 3. Extensibilidade
- Novas funcionalidades (Email, Google Cloud)
- Preparado para crescimento do projeto

### 4. Segurança
- URL encoding para senhas especiais
- Validação robusta
- Mensagens de erro claras

---

## 📚 Referências

- [The Twelve-Factor App - Config](https://12factor.net/config)
- [Prisma Connection URLs](https://www.prisma.io/docs/concepts/database-connectors/postgresql#connection-urls)
- [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars)

---

**Status**: ✅ REFATORAÇÃO COMPLETA E TESTADA

O projeto está pronto para uso com o novo sistema de variáveis de ambiente!

---

*Concluído em: 07/01/2026*  
*Tempo estimado: 2-3 horas*  
*Complexidade: Média-Alta*

