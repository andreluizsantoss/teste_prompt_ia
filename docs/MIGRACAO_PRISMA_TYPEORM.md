# Migração Prisma → TypeORM

Este documento descreve a migração do projeto do Prisma para o TypeORM com SQL Server.

## 📋 Sumário

- [Alterações Realizadas](#alterações-realizadas)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Principais Diferenças](#principais-diferenças)
- [Como Usar](#como-usar)
- [Exemplos de Código](#exemplos-de-código)

## ✅ Alterações Realizadas

### 1. Dependências

**Removido:**
- `mysql2` (driver MySQL)

**Adicionado:**
- `mssql` (driver SQL Server)

### 2. Configuração do Data Source

O arquivo `src/shared/infra/database/data-source.ts` foi atualizado:

```typescript
// Antes (MySQL)
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  // ...
  charset: 'utf8mb4',
  timezone: '-03:00',
})

// Depois (SQL Server)
export const AppDataSource = new DataSource({
  type: 'mssql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  // ...
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
})
```

### 3. Variáveis de Ambiente

Porta padrão alterada:

```env
# Antes (MySQL)
DB_PORT=3306

# Depois (SQL Server)
DB_PORT=1433
```

### 4. Entidades TypeORM Criadas

Foram criadas 17 entidades TypeORM baseadas no schema Prisma:

| Módulo | Entidade | Arquivo |
|--------|----------|---------|
| Configuração | Configuracao | `src/modules/configuracao/domain/entities/Configuracao.ts` |
| Funcionário | Funcionario | `src/modules/funcionario/domain/entities/Funcionario.ts` |
| Funcionário | FuncionarioPonto | `src/modules/funcionario/domain/entities/FuncionarioPonto.ts` |
| Funcionário | FuncionarioMovimentacao | `src/modules/funcionario/domain/entities/FuncionarioMovimentacao.ts` |
| Idoso | Idoso | `src/modules/idoso/domain/entities/Idoso.ts` |
| Idoso | IdosoMovimentacao | `src/modules/idoso/domain/entities/IdosoMovimentacao.ts` |
| Idoso | AutorizacaoSaidaIdoso | `src/modules/idoso/domain/entities/AutorizacaoSaidaIdoso.ts` |
| Prestador | PrestadorServico | `src/modules/prestador-servico/domain/entities/PrestadorServico.ts` |
| Prestador | ServicoMovimentacao | `src/modules/prestador-servico/domain/entities/ServicoMovimentacao.ts` |
| Veículo | Veiculo | `src/modules/veiculo/domain/entities/Veiculo.ts` |
| Veículo | VeiculoMovimentacao | `src/modules/veiculo/domain/entities/VeiculoMovimentacao.ts` |
| Visitante | Visitante | `src/modules/visitante/domain/entities/Visitante.ts` |
| Visitante | GrupoVisitante | `src/modules/visitante/domain/entities/GrupoVisitante.ts` |
| Visitante | VisitanteMovimentacao | `src/modules/visitante/domain/entities/VisitanteMovimentacao.ts` |
| Mensagem | Mensagem | `src/modules/mensagem/domain/entities/Mensagem.ts` |
| Mensagem | MensagemFuncionario | `src/modules/mensagem/domain/entities/MensagemFuncionario.ts` |
| Mensagem | DisparoEmail | `src/modules/mensagem/domain/entities/DisparoEmail.ts` |
| Mensagem | Intercorrencia | `src/modules/mensagem/domain/entities/Intercorrencia.ts` |

## 📁 Estrutura de Arquivos

```
ilpi_portaria_api/
├── database/
│   ├── create-database.sql      # Script SQL para criar banco e tabelas
│   └── README.md                # Documentação do banco de dados
├── example/
│   └── schema.prisma            # Schema Prisma original (referência)
├── src/
│   ├── modules/
│   │   ├── configuracao/
│   │   │   └── domain/entities/
│   │   │       └── Configuracao.ts
│   │   ├── funcionario/
│   │   │   └── domain/entities/
│   │   │       ├── Funcionario.ts
│   │   │       ├── FuncionarioPonto.ts
│   │   │       └── FuncionarioMovimentacao.ts
│   │   ├── idoso/
│   │   │   └── domain/entities/
│   │   │       ├── Idoso.ts
│   │   │       ├── IdosoMovimentacao.ts
│   │   │       └── AutorizacaoSaidaIdoso.ts
│   │   ├── prestador-servico/
│   │   │   └── domain/entities/
│   │   │       ├── PrestadorServico.ts
│   │   │       └── ServicoMovimentacao.ts
│   │   ├── veiculo/
│   │   │   └── domain/entities/
│   │   │       ├── Veiculo.ts
│   │   │       └── VeiculoMovimentacao.ts
│   │   ├── visitante/
│   │   │   └── domain/entities/
│   │   │       ├── Visitante.ts
│   │   │       ├── GrupoVisitante.ts
│   │   │       └── VisitanteMovimentacao.ts
│   │   └── mensagem/
│   │       └── domain/entities/
│   │           ├── Mensagem.ts
│   │           ├── MensagemFuncionario.ts
│   │           ├── DisparoEmail.ts
│   │           └── Intercorrencia.ts
│   └── shared/
│       ├── env/
│       │   └── index.ts         # Configuração de variáveis de ambiente
│       └── infra/
│           └── database/
│               └── data-source.ts  # Configuração do TypeORM
└── ENV_EXAMPLE.txt              # Exemplo de variáveis de ambiente
```

## 🔄 Principais Diferenças

### Prisma vs TypeORM

| Aspecto | Prisma | TypeORM |
|---------|--------|---------|
| **Definição de Schema** | `schema.prisma` (arquivo único) | Classes TypeScript com decorators |
| **Tipagem** | Gerada automaticamente | Manual com decorators |
| **Migrations** | `prisma migrate` | TypeORM CLI ou scripts SQL |
| **Queries** | `prisma.model.findMany()` | `repository.find()` |
| **Relações** | Automáticas | Decorators `@ManyToOne`, `@OneToMany` |

### Exemplo de Mapeamento

**Prisma:**
```prisma
model ModelFuncionario {
  codigo        Decimal @id @map("Codigo") @db.Decimal(18, 0)
  nome          String? @map("Nome") @db.VarChar(50)
  
  @@map("TB_Funcionario")
}
```

**TypeORM:**
```typescript
@Entity('TB_Funcionario')
export class Funcionario {
  @PrimaryColumn({ name: 'Codigo', type: 'decimal', precision: 18, scale: 0 })
  codigo!: number

  @Column({ name: 'Nome', type: 'varchar', length: 50, nullable: true })
  nome?: string
}
```

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o conteúdo de `ENV_EXAMPLE.txt` para um arquivo `.env` e configure:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=SuaSenha
DB_DATABASE=ILPI_Portaria
```

### 3. Executar Script SQL

Execute o arquivo `database/create-database.sql` no SQL Server para criar o banco e tabelas.

### 4. Iniciar Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 💻 Exemplos de Código

### Buscar Todos os Funcionários

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'

const funcionarioRepository = AppDataSource.getRepository(Funcionario)

// Buscar todos
const funcionarios = await funcionarioRepository.find()

// Buscar com condição
const funcionariosAtivos = await funcionarioRepository.find({
  where: { status: 'Ativo' }
})

// Buscar um por código
const funcionario = await funcionarioRepository.findOne({
  where: { codigo: 1 }
})
```

### Buscar com Relacionamentos

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'

const funcionarioRepository = AppDataSource.getRepository(Funcionario)

// Buscar funcionário com seus pontos
const funcionario = await funcionarioRepository.findOne({
  where: { codigo: 1 },
  relations: ['pontos']
})

// Buscar com múltiplos relacionamentos
const funcionario = await funcionarioRepository.findOne({
  where: { codigo: 1 },
  relations: ['pontos', 'servicoMovimentacoes']
})
```

### Criar um Novo Registro

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'

const funcionarioRepository = AppDataSource.getRepository(Funcionario)

const novoFuncionario = funcionarioRepository.create({
  codigo: 1,
  nome: 'João Silva',
  cpf: '123.456.789-00',
  status: 'Ativo'
})

await funcionarioRepository.save(novoFuncionario)
```

### Atualizar um Registro

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'

const funcionarioRepository = AppDataSource.getRepository(Funcionario)

// Opção 1: Update direto
await funcionarioRepository.update(
  { codigo: 1 },
  { nome: 'João da Silva' }
)

// Opção 2: Find + Save
const funcionario = await funcionarioRepository.findOne({
  where: { codigo: 1 }
})

if (funcionario) {
  funcionario.nome = 'João da Silva'
  await funcionarioRepository.save(funcionario)
}
```

### Deletar um Registro

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'

const funcionarioRepository = AppDataSource.getRepository(Funcionario)

// Opção 1: Delete direto
await funcionarioRepository.delete({ codigo: 1 })

// Opção 2: Soft delete (se configurado)
await funcionarioRepository.softDelete({ codigo: 1 })
```

### Query Builder (Queries Complexas)

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'

const funcionarios = await AppDataSource
  .getRepository(Funcionario)
  .createQueryBuilder('f')
  .where('f.status = :status', { status: 'Ativo' })
  .andWhere('f.cargo LIKE :cargo', { cargo: '%Enfermeiro%' })
  .orderBy('f.nome', 'ASC')
  .getMany()
```

### Transações

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'
import { FuncionarioPonto } from '@modules/funcionario/domain/entities/FuncionarioPonto'

await AppDataSource.transaction(async (transactionalEntityManager) => {
  const funcionario = await transactionalEntityManager.findOne(Funcionario, {
    where: { codigo: 1 }
  })

  const ponto = transactionalEntityManager.create(FuncionarioPonto, {
    codigo: 100,
    codigoFuncionario: funcionario.codigo,
    dataEntrada: new Date()
  })

  await transactionalEntityManager.save(ponto)
})
```

## 📝 Notas Importantes

### Tipos de Dados

- **Decimal**: No Prisma mapeado como `Decimal`, no TypeORM como `number`
- **DateTime**: No SQL Server, usar tipo `datetime` ou `datetime2`
- **Date**: Usar tipo `date` para datas sem hora
- **Image**: Tipo `image` do SQL Server para armazenar imagens (deprecated, considerar `varbinary(max)`)
- **VARCHAR(MAX)**: Para textos longos

### Nomenclatura

Todas as entidades mantêm:
- **Nomes de tabelas originais** (ex: `TB_Funcionario`)
- **Nomes de colunas originais** (ex: `Codigo`, `Nome`)
- **Propriedades em camelCase** (ex: `codigo`, `nome`)

### Performance

- Índices foram criados no script SQL para campos frequentemente consultados
- Foreign Keys foram configuradas para integridade referencial
- Considere usar `select` específicos ao invés de buscar todos os campos

## 🔗 Recursos Adicionais

- [TypeORM Documentation](https://typeorm.io/)
- [TypeORM Decorators Reference](https://typeorm.io/decorator-reference)
- [TypeORM Relations](https://typeorm.io/relations)
- [TypeORM Query Builder](https://typeorm.io/select-query-builder)

## ❓ FAQ

### Como faço migrations?

TypeORM suporta migrations automáticas e manuais. Para este projeto, foi criado um script SQL inicial. Para alterações futuras, você pode:

1. Usar migrations TypeORM
2. Criar scripts SQL manuais
3. Usar `synchronize: true` apenas em desenvolvimento (não recomendado para produção)

### Posso usar Prisma e TypeORM juntos?

Tecnicamente sim, mas não é recomendado. Escolha uma ferramenta ORM para manter o código consistente.

### Como faço backup do banco?

```sql
BACKUP DATABASE ILPI_Portaria 
TO DISK = 'C:\Backup\ILPI_Portaria.bak'
WITH FORMAT, COMPRESSION
```

### Como restauro um backup?

```sql
RESTORE DATABASE ILPI_Portaria 
FROM DISK = 'C:\Backup\ILPI_Portaria.bak'
WITH REPLACE
```

## 🐛 Problemas Conhecidos

1. **Tipo Image está deprecated**: Considere migrar para `varbinary(max)` futuramente
2. **Decimal(18,0)**: Pode causar problemas com números muito grandes
3. **Conexões**: Certifique-se de fechar conexões adequadamente para evitar pool exhaustion

---

**Data da Migração:** Janeiro 2026  
**Autor:** André Luiz dos Santos

