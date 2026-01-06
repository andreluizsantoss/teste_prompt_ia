# ⚡ Quick Start Guide

## 🚀 Início Rápido (5 minutos)

### 1️⃣ MySQL
```bash
# Criar banco de dados
mysql -u root -p
CREATE DATABASE ilpi_portaria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2️⃣ Configurar .env
```bash
# Editar arquivo .env
# Alterar DB_PASSWORD para sua senha do MySQL
```

### 3️⃣ Iniciar
```bash
npm run dev
```

### 4️⃣ Testar
```bash
curl http://localhost:3333/health
```

**✅ Funcionou?** Você está pronto!

---

## 📝 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # ⚡ Inicia servidor (hot reload)

# Testes
npm test                 # 🧪 Roda todos os testes
npm run test:watch       # 👀 Testes em watch mode

# Qualidade
npm run lint:fix         # 🔧 Corrige erros de linting
npm run format           # 💅 Formata o código

# Build
npm run build            # 📦 Compila para produção
npm start                # 🚀 Inicia produção
```

---

## 📁 Arquivos Importantes

```
.env                     # 🔐 Variáveis de ambiente (EDITAR)
src/shared/env/          # ✅ Validação de ambiente
src/shared/logger/       # 📝 Sistema de logs
src/modules/             # 📦 Seus módulos aqui

LEIA-ME.md              # 📖 Guia completo em PT-BR
README_MODULE_TEMPLATE   # 🎯 Como criar módulos
CHECKLIST.md            # ✅ Lista de verificação
```

---

## 🎯 Criar Novo Módulo

### Exemplo: Module "Resident"

```bash
# 1. Criar estrutura
mkdir -p src/modules/resident/{domain/{entities,models,repositories},infra/{http/{controllers,routes,validators},repositories},services,__tests__/{unit,integration}}

# 2. Criar Entity (resident/domain/entities/Resident.ts)
# 3. Criar Repository Interface (resident/domain/repositories/IResidentsRepository.ts)
# 4. Implementar Repository (resident/infra/repositories/ResidentsRepository.ts)
# 5. Criar Service (resident/services/CreateResidentService.ts)
# 6. Criar Validator (resident/infra/http/validators/resident.validator.ts)
# 7. Criar Controller (resident/infra/http/controllers/ResidentsController.ts)
# 8. Criar Routes (resident/infra/http/routes/resident.routes.ts)
# 9. Registrar no Container (shared/infra/http/container/index.ts)
# 10. Registrar Routes (shared/infra/http/routes/v1/index.ts)
```

**Consulte:** `src/modules/README_MODULE_TEMPLATE.md` para exemplos completos.

---

## 🐛 Solução de Problemas

### Erro: MySQL Connection
```bash
# Verificar se MySQL está rodando
mysql --version

# Verificar credenciais no .env
# DB_PASSWORD=SUA_SENHA
```

### Erro: Port in Use
```bash
# Alterar porta no .env
PORT=3334
```

### Erro: TypeScript
```bash
# Verificar compilação
npx tsc --noEmit

# Corrigir imports com aliases
# Use: @shared/... @modules/...
```

---

## 📊 Endpoints

### Health Check
```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2026-01-06T20:17:52.281Z",
  "timezone": {
    "offset": "-3",
    "description": "UTC-3"
  },
  "uptime": 123.456,
  "environment": "dev",
  "database": { "status": "connected" }
}

# Nota: timestamp em UTC, timezone mostra o offset do servidor
```

### API Versionada
```bash
# Sempre usar /api/v1/
POST   /api/v1/users
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

---

## 🔥 Dicas Rápidas

### Path Aliases
```typescript
// ✅ Use
import { logger } from '@shared/logger/logger'
import { User } from '@modules/user/domain/entities/User'

// ❌ Não use
import { logger } from '../../../shared/logger/logger'
```

### Logs
```typescript
import { logger } from '@shared/logger/logger'

logger.info('User created')
logger.error('Error message', { error })
logger.warn('Warning message')
logger.debug('Debug info')
```

### Errors
```typescript
import { AppError } from '@shared/errors/AppError'

throw new AppError('User not found', 404)
throw new AppError('Email already exists', 400)
```

### Validation (Zod)
```typescript
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().positive(),
})

const data = schema.parse(req.body)
```

---

## 🎯 Checklist de Deploy

- [ ] Gerar secrets fortes (openssl rand -base64 32)
- [ ] Atualizar .env com secrets
- [ ] NODE_ENV=production
- [ ] Configurar banco de dados
- [ ] npm run build
- [ ] npm start
- [ ] Testar /health
- [ ] Configurar HTTPS
- [ ] Configurar firewall

---

## 📚 Documentação Completa

- **LEIA-ME.md** - Guia completo em português
- **README.md** - Main documentation (English)
- **CHECKLIST.md** - Verification checklist
- **SETUP_COMPLETO.md** - Setup details
- **src/modules/README_MODULE_TEMPLATE.md** - Module template
- **src/shared/infra/http/__tests__/README_TESTS.md** - Testing guide

---

## ✅ Status

- ✅ TypeScript: 0 erros
- ✅ ESLint: 0 erros
- ✅ Testes: 2/2 passando
- ✅ Pronto para desenvolvimento!

---

**🚀 Boa sorte no desenvolvimento!**

