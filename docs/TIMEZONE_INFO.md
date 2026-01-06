# ⏰ Informações sobre Timezone

## 🌍 Por que UTC no Backend?

O backend **sempre** trabalha com UTC (Coordinated Universal Time) por várias razões:

### ✅ Vantagens do UTC

1. **Padrão Internacional** - Entendido em todo o mundo
2. **Sem Horário de Verão** - UTC não muda com DST (Daylight Saving Time)
3. **Simplicidade** - Um único fuso horário para toda a lógica
4. **Compatibilidade** - Bancos de dados e APIs usam UTC
5. **Cálculos Precisos** - Evita problemas com mudanças de horário

### ❌ Problemas de usar Timezone Local no Backend

- Horário de verão causa bugs
- Servidores em diferentes regiões ficam inconsistentes
- Cálculos de diferença de tempo ficam complexos
- Dificulta auditoria e logs

---

## 🔧 Como Está Configurado

### Backend (UTC)

```typescript
// health_controller.ts
const now = new Date()
const timestamp = now.toISOString() // "2026-01-06T20:17:52.281Z"
```

### Banco de Dados (UTC)

```typescript
// data-source.ts
export const AppDataSource = new DataSource({
  // ...
  timezone: 'Z', // UTC
})
```

### Resposta da API

```json
{
  "timestamp": "2026-01-06T20:17:52.281Z",  // UTC
  "timezone": {
    "offset": "-3",        // Horas de diferença do UTC
    "description": "UTC-3" // Descrição legível
  }
}
```

---

## 🌎 Entendendo o Offset

### Exemplos de Timezones

| Região | Offset | Descrição |
|--------|--------|-----------|
| **Brasil (Brasília)** | `-3` | UTC-3 |
| **Brasil (Acre)** | `-5` | UTC-5 |
| **Portugal** | `+0` ou `+1` | UTC+0 (inverno) / UTC+1 (verão) |
| **Estados Unidos (EST)** | `-5` | UTC-5 |
| **Japão** | `+9` | UTC+9 |
| **Índia** | `+5.5` | UTC+5:30 |

### Como Funciona

Se no Brasil (UTC-3) são **17:17**:
- UTC será: **20:17** (17:17 + 3 horas)
- Timestamp: `2026-01-06T20:17:52.281Z`
- Offset: `-3`

Se em Tóquio (UTC+9) são **05:17** do dia seguinte:
- UTC será: **20:17** do dia anterior (05:17 - 9 horas)
- Timestamp: `2026-01-06T20:17:52.281Z` (mesmo timestamp!)
- Offset: `+9`

---

## 💻 Como Usar no Frontend

### JavaScript Puro

```javascript
// Recebe da API
const response = {
  timestamp: "2026-01-06T20:17:52.281Z",
  timezone: { offset: "-3", description: "UTC-3" }
}

// Converte para horário local do navegador
const date = new Date(response.timestamp)

// Exibe no formato local
console.log(date.toLocaleString())
// "06/01/2026 17:17:52" (no Brasil)

// Exibe apenas a hora
console.log(date.toLocaleTimeString())
// "17:17:52" (no Brasil)
```

### React Example

```jsx
function DisplayTime({ timestamp }) {
  const localDate = new Date(timestamp)
  
  return (
    <div>
      <p>Horário: {localDate.toLocaleString('pt-BR')}</p>
      <p>Data: {localDate.toLocaleDateString('pt-BR')}</p>
      <p>Hora: {localDate.toLocaleTimeString('pt-BR')}</p>
    </div>
  )
}
```

### Bibliotecas Recomendadas

#### date-fns
```javascript
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const date = parseISO("2026-01-06T20:17:52.281Z")
const formatted = format(date, "dd/MM/yyyy HH:mm:ss", { locale: ptBR })
// "06/01/2026 17:17:52"
```

#### Luxon
```javascript
import { DateTime } from 'luxon'

const dt = DateTime.fromISO("2026-01-06T20:17:52.281Z")
console.log(dt.setLocale('pt-BR').toLocaleString(DateTime.DATETIME_FULL))
// "6 de janeiro de 2026 17:17:52 BRT"
```

#### Day.js
```javascript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const local = dayjs("2026-01-06T20:17:52.281Z")
  .tz('America/Sao_Paulo')
  .format('DD/MM/YYYY HH:mm:ss')
// "06/01/2026 17:17:52"
```

---

## 🗄️ Banco de Dados

### Salvando Datas

```typescript
// Entity
@Entity('events')
export class Event {
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date  // Salvo em UTC automaticamente
}

// Service
const event = repository.create({
  name: 'Evento Teste',
  // createdAt é preenchido automaticamente em UTC
})
```

### Consultando Datas

```typescript
// Buscar eventos de hoje (no timezone local)
const today = new Date()
today.setHours(0, 0, 0, 0)

const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

const events = await repository.find({
  where: {
    createdAt: Between(today, tomorrow)
  }
})
// TypeORM converte automaticamente para UTC
```

---

## 🧪 Testando Timezone

### Teste do Health Check

```typescript
it('should return timezone information', async () => {
  const response = await request(app).get('/health')

  expect(response.body).toHaveProperty('timestamp')
  expect(response.body).toHaveProperty('timezone')
  expect(response.body.timezone).toHaveProperty('offset')
  expect(response.body.timezone).toHaveProperty('description')

  // Verifica se timestamp é ISO 8601 UTC
  expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
})
```

---

## ⚠️ Problemas Comuns

### ❌ Erro: "Horário errado no banco"

**Causa:** Comparando UTC com horário local

**Solução:**
```typescript
// ❌ Errado
const agora = new Date()
console.log(agora.getHours()) // 17 (local)

// ✅ Correto
const agora = new Date()
console.log(agora.toISOString()) // "2026-01-06T20:17:52.281Z" (UTC)
```

### ❌ Erro: "Data de ontem aparece como hoje"

**Causa:** Não convertendo UTC para local antes de comparar

**Solução:**
```typescript
// ❌ Errado
if (event.createdAt.getDate() === new Date().getDate()) { ... }

// ✅ Correto
const eventDate = new Date(event.createdAt).toLocaleDateString()
const today = new Date().toLocaleDateString()
if (eventDate === today) { ... }
```

---

## 📚 Boas Práticas

### ✅ DO (Faça)

1. **Sempre salve em UTC** no backend e banco
2. **Converta para local** apenas na apresentação (frontend)
3. **Use ISO 8601** para timestamps (`toISOString()`)
4. **Teste** com diferentes timezones
5. **Documente** o timezone usado

### ❌ DON'T (Não faça)

1. **Não salve** horário local no banco
2. **Não faça** cálculos com Date direto (use bibliotecas)
3. **Não assuma** que todos estão no mesmo timezone
4. **Não ignore** horário de verão
5. **Não converta** para local no backend

---

## 🎯 Resumo

| Camada | Timezone | Formato |
|--------|----------|---------|
| **Backend** | UTC | ISO 8601 (`2026-01-06T20:17:52.281Z`) |
| **Banco de Dados** | UTC | DATETIME (UTC) |
| **API Response** | UTC | ISO 8601 + timezone info |
| **Frontend** | Local do usuário | Formatado (ex: `06/01/2026 17:17`) |

---

## 🔗 Referências

- [ISO 8601 Standard](https://en.wikipedia.org/wiki/ISO_8601)
- [UTC Explained](https://www.timeanddate.com/time/aboututc.html)
- [TypeORM Timezone Docs](https://typeorm.io/)
- [JavaScript Date MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

---

**Lembre-se:** UTC no backend, conversão no frontend! 🌍⏰

