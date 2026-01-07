# 🔧 Módulo de Configuração

## 📋 Visão Geral

Módulo responsável por gerenciar as configurações do sistema ILPI Portaria.

## 🏗️ Estrutura

```
configuration/
├── domain/
│   ├── entities/
│   │   └── Configuracao.ts          # Entidade TypeORM
│   ├── models/
│   │   └── IConfiguration.ts        # Interface do modelo
│   └── repositories/
│       └── IConfigurationRepository.ts  # Interface do repositório
├── infra/
│   ├── http/
│   │   ├── controllers/
│   │   │   └── FindConfigurationController.ts
│   │   └── routes/
│   │       └── configuration.routes.ts
│   └── repositories/
│       └── ConfigurationRepository.ts   # Implementação TypeORM
└── services/
    └── FindConfigurationService.ts
```

## 🚀 Endpoints

### GET `/api/v1/configuration`

Busca as configurações do sistema.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Resposta (200 OK):**
```json
{
  "codigo": 1,
  "nome": "ILPI Casa de Repouso",
  "cnpj": "12.345.678/0001-99",
  "endereco": "Rua Principal, 123",
  "bairro": "Centro",
  "cep": "12345-678",
  "cidade": "São Paulo",
  "estado": "SP",
  "telefone": "(11) 98765-4321",
  "email": "contato@ilpi.com.br",
  "sistemaAtendimento": "24h",
  "logoEmpresa": null
}
```

**Erros:**

- `404 Not Found` - Configuração não encontrada
- `401 Unauthorized` - Token de autenticação inválido ou ausente
- `500 Internal Server Error` - Erro interno do servidor

## 🎯 Casos de Uso

### 1. Buscar Configuração

Retorna as configurações gerais do sistema, incluindo dados da empresa/ILPI.

## 🛠️ Tecnologias

- **TypeORM** - ORM para acesso ao banco de dados
- **TSyringe** - Injeção de dependências
- **Express** - Framework HTTP
- **Winston** - Logger

## 📦 Dependências

Este módulo depende de:
- `@shared/infra/database` - Conexão com banco de dados
- `@shared/errors` - Erros customizados
- `@shared/logger` - Sistema de logs
- `@shared/middlewares` - Middleware de autenticação

## 🔒 Segurança

- Todos os endpoints requerem autenticação via JWT
- O campo `logoEmpresa` (Buffer) é retornado como está do banco de dados

## 📝 Observações

- A tabela `TB_Configuracao` deve ter apenas um registro
- O sistema busca o primeiro registro disponível (ordenado por código)
- Se nenhuma configuração for encontrada, retorna erro 404

