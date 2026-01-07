# 🇧🇷 Changelog - Configuração de Timezone do Brasil

## 📅 Data: 07/01/2026

## 🎯 Objetivo

Configurar o projeto para usar o timezone do Brasil (UTC-3) ao invés de UTC, tanto no banco de dados quanto nas respostas da API.

---

## ⚠️ Decisão de Projeto

**Esta é uma escolha específica deste projeto**, mesmo não sendo a prática recomendada internacionalmente. 

### Por que mudar de UTC?
- Requisito específico do cliente/projeto
- Sistema usado apenas no Brasil
- Facilita leitura de logs e dados no banco
- Datas exibidas no horário local sem conversão

### Trade-offs Aceitos
- ❌ Menos compatível com sistemas internacionais
- ❌ Pode causar problemas com horário de verão
- ❌ Dificulta migração para outros timezones
- ✅ Simplicidade para uso local no Brasil
- ✅ Datas "legíveis" diretamente no banco

---

## 🔧 Mudanças Implementadas

### 1. **DataSource TypeORM**

#### ❌ Antes (UTC)
```typescript
export const AppDataSource = new DataSource({
  // ...
  timezone: 'Z', // UTC
})
```

#### ✅ Depois (Brasil - UTC-3)
```typescript
export const AppDataSource = new DataSource({
  // ...
  timezone: '-03:00', // Timezone do Brasil (Brasília)
})
```

---

### 2. **Health Controller**

#### ❌ Antes (UTC com timezone info)
```typescript
const now = new Date()
const timezoneOffset = -now.getTimezoneOffset() / 60

const healthCheck = {
  status: 'ok',
  timestamp: now.toISOString(), // UTC
  timezone: {
    offset: timezoneOffset >= 0 ? `+${timezoneOffset}` : `${timezoneOffset}`,
    description: `UTC${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`,
  },
  // ...
}
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-07T11:44:06.236Z",  // UTC
  "timezone": {
    "offset": "-3",
    "description": "UTC-3"
  },
  "uptime": 244.2535146,
  "environment": "dev",
  "database": {
    "status": "connected"
  }
}
```

#### ✅ Depois (Brasil - UTC-3)
```typescript
// Obter data/hora no timezone do Brasil (UTC-3)
const now = new Date()
const brasilTime = new Date(now.getTime() - 3 * 60 * 60 * 1000)

const healthCheck = {
  status: 'ok',
  timestamp: brasilTime.toISOString(), // Horário do Brasil
  uptime: process.uptime(),
  environment: process.env.NODE_ENV || 'dev',
  database: {
    status: 'disconnected',
  },
}
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-07T08:44:06.236Z",  // Brasil (UTC-3)
  "uptime": 244.2535146,
  "environment": "dev",
  "database": {
    "status": "connected"
  }
}
```

---

### 3. **Testes Atualizados**

#### Removidas validações do campo `timezone`

```diff
  it('should return health status', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'ok')
    expect(response.body).toHaveProperty('timestamp')
-   expect(response.body).toHaveProperty('timezone')
-   expect(response.body.timezone).toHaveProperty('offset')
-   expect(response.body.timezone).toHaveProperty('description')
    expect(response.body).toHaveProperty('uptime')
    // ...
  })
```

---

## 📊 Comparação

| Aspecto | Antes (UTC) | Depois (Brasil) |
|---------|-------------|-----------------|
| **Timezone** | UTC (Z) | UTC-3 (-03:00) |
| **Timestamp** | 11:44:06 UTC | 08:44:06 Brasil |
| **Campo timezone** | ✅ Presente | ❌ Removido |
| **Banco de dados** | UTC | Brasil (UTC-3) |
| **Compatibilidade internacional** | ✅ Alta | ⚠️ Baixa |
| **Legibilidade local** | ⚠️ Requer conversão | ✅ Direto |

---

## 📝 Arquivos Alterados

### Código
1. **src/shared/infra/database/data-source.ts**
   - `timezone: 'Z'` → `timezone: '-03:00'`

2. **src/shared/infra/http/controllers/health_controller.ts**
   - Timestamp convertido para Brasil
   - Campo `timezone` removido

3. **src/shared/infra/http/__tests__/health.spec.ts**
   - Validações do campo `timezone` removidas

### Documentação
4. **README.md**
   - Exemplo de resposta atualizado
   - Nota sobre timezone do Brasil

5. **.ia/prompts/setup_backend_nodejs_typeorm.md**
   - Configuração padrão alterada para Brasil
   - Seções sobre timezone atualizadas
   - Exemplos atualizados

6. **docs/TIMEZONE_INFO.md**
   - Aviso sobre configuração específica
   - Exemplos atualizados

7. **docs/CHANGELOG_TIMEZONE_BRASIL.md**
   - Este arquivo (novo)

---

## 🧪 Validação

```bash
✅ npm test          # 2/2 tests passing
✅ npm run lint      # 0 errors
✅ npx tsc --noEmit  # 0 errors
```

---

## ⚠️ Considerações Importantes

### Horário de Verão
O Brasil **não tem mais horário de verão** desde 2019, então usar `-03:00` fixo é seguro para a região de Brasília.

**Regiões do Brasil:**
- **Brasília (DF), SP, RJ, MG, PR, SC, RS, etc:** UTC-3 ✅ (configurado)
- **Amazonas (AM):** UTC-4
- **Acre (AC):** UTC-5
- **Fernando de Noronha:** UTC-2

**Nota:** Se o projeto precisar atender outras regiões, será necessário ajustar ou usar UTC.

### Quando NÃO usar esta configuração
- ❌ Projeto com usuários internacionais
- ❌ Sistema distribuído em múltiplos timezones
- ❌ Integração com APIs internacionais
- ❌ Necessidade de timezone dinâmico por usuário

### Quando USAR esta configuração
- ✅ Sistema usado apenas no Brasil (região de Brasília)
- ✅ Requisito específico do cliente
- ✅ Banco de dados local sem replicação internacional
- ✅ Logs e dados precisam ser "legíveis" localmente

---

## 🔄 Como Reverter para UTC (se necessário)

### 1. DataSource
```typescript
timezone: 'Z', // UTC
```

### 2. Health Controller
```typescript
const now = new Date()
const healthCheck = {
  status: 'ok',
  timestamp: now.toISOString(), // UTC
  // ...
}
```

### 3. Testes
Adicionar validações de timezone se necessário.

---

## 📚 Referências

- [TypeORM Timezone](https://typeorm.io/)
- [MySQL Timezone](https://dev.mysql.com/doc/refman/8.0/en/time-zone-support.html)
- [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
- [Horário de Verão no Brasil (descontinuado)](https://pt.wikipedia.org/wiki/Hor%C3%A1rio_de_ver%C3%A3o_no_Brasil)

---

## ✨ Resumo

| Item | Status |
|------|--------|
| **Timezone configurado** | ✅ Brasil (UTC-3) |
| **DataSource atualizado** | ✅ timezone: '-03:00' |
| **Health check atualizado** | ✅ Timestamp Brasil |
| **Campo timezone removido** | ✅ |
| **Testes passando** | ✅ 2/2 |
| **Documentação atualizada** | ✅ |
| **Prompt atualizado** | ✅ |

---

**Status:** ✅ Configuração Completa  
**Versão:** 1.4.0  
**Data:** 07/01/2026  
**Timezone:** Brasil (UTC-3)

---

## 🇧🇷 Conclusão

O projeto agora está configurado para usar o timezone do Brasil (UTC-3) em todas as camadas:
- ✅ Banco de dados
- ✅ API responses
- ✅ Timestamps

Esta é uma **escolha consciente** para este projeto específico, adequada para sistemas usados exclusivamente no Brasil.

