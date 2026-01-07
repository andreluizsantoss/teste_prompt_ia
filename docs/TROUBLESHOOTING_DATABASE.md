# 🔧 Troubleshooting - Conexão com Banco de Dados

## 📋 Índice

- [Erro: socket hang up](#erro-socket-hang-up)
- [Erro: getaddrinfo ENOTFOUND](#erro-getaddrinfo-enotfound)
- [Erro: Login failed](#erro-login-failed)
- [Verificações Básicas](#verificações-básicas)
- [Teste de Conectividade](#teste-de-conectividade)

---

## ❌ Erro: socket hang up

### Descrição do Erro:
```
ConnectionError: Failed to connect to 191.252.56.55:9533 - socket hang up
code: 'ESOCKET'
```

### Causas Possíveis:

1. **Firewall bloqueando a porta**
2. **SQL Server não está escutando na porta especificada**
3. **Configurações de SSL/TLS incorretas**
4. **Servidor SQL não aceita conexões remotas**
5. **Timeout de conexão muito curto**

### ✅ Soluções:

#### 1. Desabilitar Criptografia SSL/TLS

No seu `.env`, adicione ou modifique:

```env
ILPI_CONCIERGE_DB_ENCRYPT=false
ILPI_CONCIERGE_DB_TRUST_SERVER_CERTIFICATE=true
```

#### 2. Verificar Firewall

**Windows:**
```powershell
# Testar conectividade com a porta
Test-NetConnection -ComputerName 191.252.56.55 -Port 9533
```

**Resultado esperado:**
```
TcpTestSucceeded : True
```

**Linux/Mac:**
```bash
# Testar conectividade com a porta
nc -zv 191.252.56.55 9533
# ou
telnet 191.252.56.55 9533
```

#### 3. Verificar se o SQL Server está ativo

```sql
-- No SQL Server, execute:
SELECT @@VERSION
EXEC xp_readerrorlog 0, 1, N'Server is listening on'
```

#### 4. Verificar Configuração de Rede do SQL Server

No SQL Server Configuration Manager:
1. Abra **SQL Server Configuration Manager**
2. Vá em **SQL Server Network Configuration**
3. Clique em **Protocols for [INSTÂNCIA]**
4. Certifique-se que **TCP/IP** está **Enabled**
5. Clique com botão direito em **TCP/IP** > **Properties**
6. Vá na aba **IP Addresses**
7. Verifique se a porta está configurada corretamente

#### 5. Habilitar Conexões Remotas

```sql
-- No SQL Server, execute:
EXEC sp_configure 'remote access', 1
GO
RECONFIGURE
GO
```

#### 6. Testar com SQL Server Management Studio (SSMS)

Tente conectar usando SSMS com as mesmas credenciais:
- Server: `191.252.56.55,9533`
- Authentication: SQL Server Authentication
- Login: `LAR!2020#Atendimento`
- Password: (sua senha)

Se não conectar no SSMS, o problema não é com o Node.js/TypeORM.

---

## ❌ Erro: getaddrinfo ENOTFOUND

### Descrição do Erro:
```
getaddrinfo ENOTFOUND lar!2020
```

### Causa:
Username ou password contém caracteres especiais não codificados.

### ✅ Solução:

Use o script de encoding:

```bash
node scripts/encode-db-credentials.js
```

Veja também: [Scripts README](../scripts/README.md)

---

## ❌ Erro: Login failed

### Descrição do Erro:
```
Login failed for user 'LAR!2020#Atendimento'
```

### Causas Possíveis:

1. **Credenciais incorretas**
2. **Usuário não tem permissão para acessar o banco**
3. **Autenticação do SQL Server desabilitada**

### ✅ Soluções:

#### 1. Verificar Credenciais

Teste no SSMS primeiro para confirmar que as credenciais estão corretas.

#### 2. Verificar Permissões

```sql
-- No SQL Server, execute como admin:
USE [nome_do_banco]
GO

-- Verificar se o login existe
SELECT * FROM sys.server_principals WHERE name = 'LAR!2020#Atendimento'
GO

-- Verificar permissões do usuário
SELECT * FROM sys.database_principals WHERE name = 'LAR!2020#Atendimento'
GO

-- Dar permissões se necessário
ALTER SERVER ROLE sysadmin ADD MEMBER [LAR!2020#Atendimento]
GO
```

#### 3. Habilitar Autenticação SQL Server

No SQL Server:
1. Clique com botão direito no servidor
2. **Properties** > **Security**
3. Selecione **SQL Server and Windows Authentication mode**
4. Reinicie o serviço do SQL Server

---

## ✅ Verificações Básicas

### 1. Arquivo `.env` configurado corretamente?

```env
ILPI_CONCIERGE_DATABASE_URL=mssql://username:password@host:port/database
ILPI_CONCIERGE_DB_ENCRYPT=false
ILPI_CONCIERGE_DB_TRUST_SERVER_CERTIFICATE=true
```

### 2. Caracteres especiais estão URL-encoded?

| Caractere | Codificado |
|-----------|------------|
| `!` | `%21` |
| `#` | `%23` |
| `@` | `%40` |
| `:` | `%3A` |

### 3. Porta está correta?

- **Porta padrão SQL Server:** `1433`
- **Porta personalizada:** Verifique no SQL Server Configuration Manager

### 4. Servidor está acessível na rede?

```powershell
ping 191.252.56.55
```

---

## 🧪 Teste de Conectividade

### Script de Teste (Node.js)

Crie um arquivo `test-db-connection.js`:

```javascript
const sql = require('mssql')

const config = {
  server: '191.252.56.55',
  port: 9533,
  user: 'LAR!2020#Atendimento',
  password: 'sua_senha',
  database: 'seu_banco',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
}

async function testConnection() {
  try {
    console.log('🔌 Tentando conectar...')
    console.log('Server:', config.server)
    console.log('Port:', config.port)
    console.log('Database:', config.database)

    await sql.connect(config)
    console.log('✅ Conexão bem-sucedida!')

    const result = await sql.query('SELECT @@VERSION as version')
    console.log('📊 Versão do SQL Server:', result.recordset[0].version)

    await sql.close()
  } catch (err) {
    console.error('❌ Erro na conexão:', err.message)
    console.error('Código:', err.code)
  }
}

testConnection()
```

Execute:
```bash
node test-db-connection.js
```

---

## 🔍 Configurações Alternativas

### Opção 1: Sem SSL (Servidor Local)

```env
ILPI_CONCIERGE_DB_ENCRYPT=false
ILPI_CONCIERGE_DB_TRUST_SERVER_CERTIFICATE=true
```

### Opção 2: Com SSL (Azure SQL / Servidor Remoto)

```env
ILPI_CONCIERGE_DB_ENCRYPT=true
ILPI_CONCIERGE_DB_TRUST_SERVER_CERTIFICATE=true
```

### Opção 3: SSL com Certificado Válido (Produção)

```env
ILPI_CONCIERGE_DB_ENCRYPT=true
ILPI_CONCIERGE_DB_TRUST_SERVER_CERTIFICATE=false
```

---

## 📞 Ainda com Problemas?

### Checklist Final:

- [ ] Servidor SQL está rodando?
- [ ] Porta está aberta no firewall?
- [ ] TCP/IP está habilitado no SQL Server?
- [ ] Credenciais estão corretas?
- [ ] Credenciais estão URL-encoded?
- [ ] Banco de dados existe?
- [ ] Usuário tem permissão no banco?
- [ ] Conexões remotas estão habilitadas?
- [ ] Configurações SSL/TLS estão corretas?

### Informações para Suporte:

Ao pedir ajuda, forneça:

1. **Versão do SQL Server:**
   ```sql
   SELECT @@VERSION
   ```

2. **Mensagem de erro completa**

3. **Configurações usadas** (sem senha):
   ```
   Host: 191.252.56.55
   Porta: 9533
   Encrypt: false
   TrustServerCertificate: true
   ```

4. **Resultado do teste de porta:**
   ```powershell
   Test-NetConnection -ComputerName 191.252.56.55 -Port 9533
   ```

---

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Autor:** André Luiz dos Santos



