# Scripts de Banco de Dados

Este diretório contém os scripts SQL necessários para criar e configurar o banco de dados do sistema ILPI Portaria API.

## 📋 Pré-requisitos

- SQL Server 2016 ou superior
- SQL Server Management Studio (SSMS) ou Azure Data Studio
- Permissões de criação de banco de dados no servidor

## 🚀 Como executar o script

### Opção 1: Via SQL Server Management Studio (SSMS)

1. Abra o SQL Server Management Studio
2. Conecte-se ao seu servidor SQL Server
3. Abra o arquivo `create-database.sql`
4. Execute o script (F5 ou clique em "Execute")

### Opção 2: Via Azure Data Studio

1. Abra o Azure Data Studio
2. Conecte-se ao seu servidor SQL Server
3. Abra o arquivo `create-database.sql`
4. Execute o script (F5 ou clique em "Run")

### Opção 3: Via sqlcmd (Linha de comando)

```bash
sqlcmd -S <servidor> -U <usuario> -P <senha> -i create-database.sql
```

Exemplo:
```bash
sqlcmd -S localhost -U sa -P MinhaSenh@123 -i create-database.sql
```

## 📝 O que o script faz

O script `create-database.sql` executa as seguintes operações:

1. **Cria o banco de dados** `ILPI_Portaria` (se não existir)
2. **Cria 17 tabelas**:
   - TB_Configuracao
   - TB_Funcionario
   - TB_Funcionario_Ponto
   - TB_Funcionario_Movimentacao
   - TB_Idoso
   - TB_Idoso_Movimentacao
   - TB_Autorizacao_Saida_Idoso
   - TB_Prestador_Servico
   - TB_Servico_Movimentacao
   - TB_Veiculo
   - TB_Veiculo_Movimentacao
   - TB_Visitante
   - TB_Grupo_Visitante
   - TB_Visitante_Movimentacao
   - TB_Mensagem
   - TB_Mensagem_Funcionario
   - TB_Disparo_Email
   - TB_Intercorrencia

3. **Cria Foreign Keys** para relacionamentos entre tabelas
4. **Cria Índices** para otimizar consultas

## ⚙️ Configuração do Projeto

Após executar o script, configure as variáveis de ambiente no arquivo `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=ILPI_Portaria
```

### Exemplo de configuração completa do .env

```env
NODE_ENV=dev
PORT=3333

# Database
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=MinhaSenh@123
DB_DATABASE=ILPI_Portaria

# CORS
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=sua_chave_secreta_com_no_minimo_32_caracteres_aqui
ACCESS_TOKEN_LIFE=15m
REFRESH_TOKEN_SECRET=sua_chave_secreta_refresh_com_32_caracteres
REFRESH_TOKEN_LIFE=7d
REFRESH_TOKEN_NOT_BEFORE=0
```

## 🔧 Instalação das dependências

Após configurar o banco de dados, instale as dependências do projeto:

```bash
npm install
```

Isso instalará o driver `mssql` necessário para conectar ao SQL Server.

## 🏃 Executando a aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📦 Estrutura das Entidades TypeORM

As entidades TypeORM foram criadas nos seguintes diretórios:

```
src/modules/
├── configuracao/domain/entities/
│   └── Configuracao.ts
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

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- Nunca commite o arquivo `.env` no repositório
- Use senhas fortes para o banco de dados
- Em produção, configure `encrypt: true` para conexões seguras
- Altere as chaves JWT para valores únicos e seguros

## 📚 Documentação Adicional

- [TypeORM Documentation](https://typeorm.io/)
- [SQL Server Documentation](https://docs.microsoft.com/sql/)
- [Node.js mssql driver](https://www.npmjs.com/package/mssql)

## 🐛 Troubleshooting

### Erro de conexão com SQL Server

Se você encontrar erros de conexão:

1. Verifique se o SQL Server está rodando
2. Verifique se a autenticação SQL Server está habilitada
3. Verifique as credenciais no arquivo `.env`
4. Verifique se a porta 1433 está aberta no firewall

### Erro: "Login failed for user"

Certifique-se de que:
- O usuário tem permissões adequadas
- A senha está correta
- O modo de autenticação do SQL Server está configurado para "SQL Server and Windows Authentication"

### Erro: "SELF_SIGNED_CERT_IN_CHAIN"

Se estiver usando um certificado auto-assinado, certifique-se de que `trustServerCertificate: true` está configurado no `data-source.ts`.

## 📞 Suporte

Para questões e suporte, entre em contato com a equipe de desenvolvimento.

