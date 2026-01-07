# 🔧 Scripts Utilitários

## 📋 Índice

- [Encoder de Credenciais do Banco de Dados](#encoder-de-credenciais-do-banco-de-dados)

---

## 🔐 Encoder de Credenciais do Banco de Dados

### Problema

Quando suas credenciais do banco de dados contêm caracteres especiais como `!`, `#`, `@`, `:`, etc., eles precisam ser **URL-encoded** para uso na `DATABASE_URL`.

### Solução

Use o script `encode-db-credentials.js` para gerar automaticamente a URL correta.

### Como Usar

#### Modo Interativo (Recomendado)

```bash
node scripts/encode-db-credentials.js
```

O script irá perguntar:
1. Username
2. Password
3. Host
4. Porta (padrão: 1433)
5. Nome do banco de dados

E irá gerar a `DATABASE_URL` codificada corretamente.

#### Modo Direto (Com Argumentos)

```bash
node scripts/encode-db-credentials.js "username" "password" "host" "porta" "database"
```

**Exemplo:**

```bash
node scripts/encode-db-credentials.js "LAR!2020#Atendimento" "senha123" "191.252.56.55" "9533" "ilpi_portaria"
```

**Saída:**

```
✅ DATABASE_URL codificada:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
mssql://LAR%212020%23Atendimento:senha123@191.252.56.55:9533/ilpi_portaria
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Tabela de Caracteres Especiais

| Caractere | URL-Encoded | Descrição |
|-----------|-------------|-----------|
| `!` | `%21` | Ponto de exclamação |
| `#` | `%23` | Hashtag/Cerquilha |
| `$` | `%24` | Cifrão |
| `%` | `%25` | Porcentagem |
| `&` | `%26` | E comercial |
| `@` | `%40` | Arroba |
| `:` | `%3A` | Dois pontos |
| `/` | `%2F` | Barra |
| `=` | `%3D` | Igual |
| `+` | `%2B` | Mais |
| ` ` (espaço) | `%20` | Espaço |

### Exemplo Prático

#### Credenciais Originais:
- **Username:** `LAR!2020#Atendimento`
- **Password:** `Senha@2024!`
- **Host:** `191.252.56.55`
- **Porta:** `9533`
- **Database:** `ilpi_portaria`

#### Processo:

1. Encode o username:
   - `LAR!2020#Atendimento` → `LAR%212020%23Atendimento`

2. Encode a password:
   - `Senha@2024!` → `Senha%402024%21`

3. Monte a URL:
   ```
   mssql://LAR%212020%23Atendimento:Senha%402024%21@191.252.56.55:9533/ilpi_portaria
   ```

4. Cole no seu `.env`:
   ```env
   ILPI_CONCIERGE_DATABASE_URL=mssql://LAR%212020%23Atendimento:Senha%402024%21@191.252.56.55:9533/ilpi_portaria
   ```

### Testando a Conexão

Após configurar a `DATABASE_URL` corretamente, teste a conexão:

```bash
npm run dev
```

Você deve ver:
```
✅ Database connected successfully!
```

### Troubleshooting

#### Erro: `getaddrinfo ENOTFOUND`

**Causa:** Username ou password não está URL-encoded corretamente.

**Solução:** Use o script `encode-db-credentials.js` para gerar a URL.

#### Erro: `Login failed for user`

**Causa:** Credenciais incorretas ou banco de dados inacessível.

**Solução:** 
1. Verifique se as credenciais estão corretas
2. Verifique se o servidor SQL está acessível na rede
3. Verifique as configurações de firewall

#### Erro: `DATABASE_URL inválida`

**Causa:** Formato da URL está incorreto.

**Solução:** Certifique-se de usar o formato:
```
mssql://username:password@host:port/database
```

---

## 📚 Outros Scripts

*(Adicione aqui outros scripts conforme necessário)*

---

**Versão:** 1.0.0  
**Data:** Janeiro 2026  
**Autor:** André Luiz dos Santos

