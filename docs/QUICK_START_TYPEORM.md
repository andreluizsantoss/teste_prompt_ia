# 🚀 Quick Start - TypeORM com SQL Server

## ⚡ Início Rápido

### 1️⃣ Instalar Dependências

```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente

Copie o conteúdo do arquivo `ENV_EXAMPLE.txt` para um novo arquivo `.env` na raiz do projeto:

```env
NODE_ENV=dev
PORT=3333

# Database Configuration - SQL Server
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=SuaSenhaAqui
DB_DATABASE=ILPI_Portaria

# CORS
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=sua_chave_secreta_com_no_minimo_32_caracteres_aqui_12345678
ACCESS_TOKEN_LIFE=15m
REFRESH_TOKEN_SECRET=sua_chave_secreta_refresh_com_32_caracteres_aqui_12345
REFRESH_TOKEN_LIFE=7d
REFRESH_TOKEN_NOT_BEFORE=0
```

### 3️⃣ Criar Banco de Dados

Abra o **SQL Server Management Studio (SSMS)** e execute o script:

```
database/create-database.sql
```

Ou via linha de comando:

```bash
sqlcmd -S localhost -U sa -P SuaSenha -i database/create-database.sql
```

### 4️⃣ Iniciar Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 Exemplo Básico de Uso

```typescript
import { AppDataSource } from '@shared/infra/database/data-source'
import { Funcionario } from '@modules/funcionario/domain/entities/Funcionario'

// Obter repositório
const funcionarioRepository = AppDataSource.getRepository(Funcionario)

// Buscar todos
const funcionarios = await funcionarioRepository.find()

// Buscar um
const funcionario = await funcionarioRepository.findOne({
  where: { codigo: 1 }
})

// Criar
const novo = funcionarioRepository.create({
  codigo: 1,
  nome: 'João Silva',
  status: 'Ativo'
})
await funcionarioRepository.save(novo)

// Atualizar
await funcionarioRepository.update(
  { codigo: 1 },
  { nome: 'João da Silva' }
)

// Deletar
await funcionarioRepository.delete({ codigo: 1 })
```

## 📁 Estrutura de Entidades

```
src/modules/
├── configuracao/domain/entities/Configuracao.ts
├── funcionario/domain/entities/
│   ├── Funcionario.ts
│   ├── FuncionarioPonto.ts
│   └── FuncionarioMovimentacao.ts
├── idoso/domain/entities/
│   ├── Idoso.ts
│   ├── IdosoMovimentacao.ts
│   └── AutorizacaoSaidaIdoso.ts
├── prestador-servico/domain/entities/
│   ├── PrestadorServico.ts
│   └── ServicoMovimentacao.ts
├── veiculo/domain/entities/
│   ├── Veiculo.ts
│   └── VeiculoMovimentacao.ts
├── visitante/domain/entities/
│   ├── Visitante.ts
│   ├── GrupoVisitante.ts
│   └── VisitanteMovimentacao.ts
└── mensagem/domain/entities/
    ├── Mensagem.ts
    ├── MensagemFuncionario.ts
    ├── DisparoEmail.ts
    └── Intercorrencia.ts
```

## 🔗 Documentação Completa

- **Migração Prisma → TypeORM**: `docs/MIGRACAO_PRISMA_TYPEORM.md`
- **Scripts do Banco**: `database/README.md`
- **Lista de Arquivos**: `ARQUIVOS_CRIADOS.md`

## ✅ Alterações Principais

| Item | Antes | Depois |
|------|-------|--------|
| **Banco de Dados** | MySQL | SQL Server |
| **Porta** | 3306 | 1433 |
| **Driver** | `mysql2` | `mssql` |
| **ORM** | Prisma | TypeORM |

## 🆘 Problemas Comuns

### Erro de Conexão

Verifique:
- SQL Server está rodando
- Porta 1433 está aberta
- Credenciais estão corretas no `.env`
- Autenticação SQL está habilitada

### Erro: "Login failed"

- Verifique usuário e senha
- Certifique-se de que o modo "Mixed Mode Authentication" está ativo

### Banco não existe

Execute o script `database/create-database.sql` primeiro!

## 📞 Ajuda

Para mais detalhes, consulte a documentação completa em `docs/MIGRACAO_PRISMA_TYPEORM.md`.

---

**Pronto para usar!** 🎉

