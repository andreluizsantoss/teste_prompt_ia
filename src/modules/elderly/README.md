# 👴 Módulo de Idosos (Elderly)

## 📋 Visão Geral

Módulo responsável por gerenciar os idosos (residentes) da ILPI, incluindo listagem, busca por ID, e controle de saídas ativas.

## 🏗️ Estrutura

```
elderly/
├── domain/
│   ├── models/
│   │   └── IElderly.ts                    # Interface do modelo
│   └── repositories/
│       └── IElderlyRepository.ts          # Interface do repositório
├── infra/
│   ├── http/
│   │   ├── controllers/
│   │   │   ├── FindAllElderlysController.ts
│   │   │   ├── FindElderlyByIdController.ts
│   │   │   ├── FindAllElderlysWithActiveExitController.ts
│   │   │   └── FindAllElderlysWithoutActiveExitController.ts
│   │   └── routes/
│   │       └── elderly.routes.ts
│   └── repositories/
│       └── ElderlyRepository.ts           # Implementação TypeORM
└── services/
    ├── __tests__/
    │   ├── FindAllElderlysService.spec.ts         ✅ PASSANDO
    │   └── FindElderlyByIdService.spec.ts         ✅ PASSANDO
    ├── FindAllElderlysService.ts
    ├── FindElderlyByIdService.ts
    ├── FindAllElderlysWithActiveExitService.ts
    └── FindAllElderlysWithoutActiveExitService.ts
```

## 🚀 Endpoints

### GET `/api/v1/elderly`

Busca todos os idosos ativos.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta (200 OK):**
```json
[
  {
    "codigo": 1,
    "nome": "João da Silva",
    "apelido": "Seu João",
    "status": "ATIVO",
    "foto": null
  }
]
```

---

### GET `/api/v1/elderly/:id`

Busca um idoso específico por ID.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `id` (string, obrigatório) - Código do idoso

**Resposta (200 OK):**
```json
{
  "codigo": 1,
  "nome": "João da Silva",
  "apelido": "Seu João",
  "status": "ATIVO",
  "foto": null
}
```

**Erros:**
- `400 Bad Request` - ID não fornecido
- `404 Not Found` - Idoso não encontrado
- `401 Unauthorized` - Token inválido
- `500 Internal Server Error` - Erro interno

---

### GET `/api/v1/elderly/list/active-exit`

Busca idosos que saíram hoje e ainda não retornaram.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta (200 OK):**
```json
[
  {
    "codigo": 2,
    "nome": "Maria Santos",
    "apelido": "Dona Maria",
    "status": "ATIVO",
    "foto": null
  }
]
```

---

### GET `/api/v1/elderly/list/available`

Busca idosos disponíveis (que não têm saída ativa no dia).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta (200 OK):**
```json
[
  {
    "codigo": 1,
    "nome": "João da Silva",
    "apelido": "Seu João",
    "status": "ATIVO",
    "foto": null
  }
]
```

## 🎯 Casos de Uso

### 1. Listar Todos os Idosos
Retorna todos os idosos com status "ATIVO", ordenados por nome.

### 2. Buscar Idoso por ID
Busca um idoso específico pelo código. Retorna erro 404 se não encontrado.

### 3. Listar Idosos com Saída Ativa
Busca idosos que registraram saída hoje mas ainda não registraram entrada (retorno).

### 4. Listar Idosos Disponíveis
Busca idosos que estão disponíveis na ILPI (não têm saída ativa).

## 🛠️ Tecnologias

- **TypeORM** - ORM para acesso ao banco de dados
- **TSyringe** - Injeção de dependências
- **Express** - Framework HTTP
- **Winston** - Logger
- **Zod** - Validação de dados

## 📦 Dependências

Este módulo depende de:
- Entidade `Idoso` (`@modules/idoso/domain/entities/Idoso`)
- Entidade `IdosoMovimentacao` (`@modules/idoso/domain/entities/IdosoMovimentacao`)
- `@shared/infra/database` - Conexão com banco de dados
- `@shared/errors` - Erros customizados
- `@shared/logger` - Sistema de logs
- `@shared/middlewares` - Middleware de autenticação

## 🧪 Testes

**Status:** ✅ 6/6 testes passando (100%)

```bash
npm test -- elderly
```

**Cobertura:**
- FindAllElderlysService: 3/3 testes ✅
- FindElderlyByIdService: 3/3 testes ✅

## 🔒 Segurança

- Todos os endpoints requerem autenticação via JWT
- Apenas idosos com status "ATIVO" são retornados
- Validação de entrada com Zod

## 📊 Modelo de Dados

### IElderly
```typescript
{
  codigo: number          // Código único do idoso
  nome?: string          // Nome completo
  apelido?: string       // Apelido/Como gosta de ser chamado
  foto?: Buffer          // Foto em formato binário
  status?: string        // Status: 'ATIVO' | 'INATIVO'
}
```

## 📝 Observações

- O módulo usa as entidades TypeORM existentes (`Idoso` e `IdosoMovimentacao`)
- A verificação de saídas ativas considera apenas o dia atual (00:00 às 23:59)
- Idosos inativos não são retornados em nenhuma listagem
- O campo `foto` pode ser grande (Buffer) e deve ser tratado adequadamente no frontend

