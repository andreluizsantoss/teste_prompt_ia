# 🔒 TypeORM Synchronize - Configuração de Segurança

## ⚙️ Configuração Atual

```typescript
synchronize: false
```

## ✅ O Que Isso Significa?

Com `synchronize: false`, o TypeORM está configurado para **NUNCA modificar a estrutura do banco de dados**, independentemente do ambiente (DEV, TEST ou PRODUCTION).

### ❌ O TypeORM NÃO VAI:
- Criar tabelas automaticamente
- Alterar estrutura de tabelas existentes
- Adicionar ou remover colunas
- Modificar tipos de dados
- Adicionar ou remover índices
- Criar ou modificar constraints (FK, PK, etc)
- Fazer QUALQUER alteração no schema

### ✅ O TypeORM VAI:
- Executar consultas SELECT
- Executar INSERT, UPDATE, DELETE
- Mapear dados entre objetos TypeScript e tabelas SQL
- Validar tipos em runtime (TypeScript)
- Funcionar normalmente para CRUD

## 🎯 Está Correto para DEV?

**SIM! ✅ Está perfeito!**

Mesmo em ambiente de desenvolvimento, manter `synchronize: false` é a prática recomendada porque:

1. **Segurança**: Previne alterações acidentais no banco
2. **Controle**: Você decide quando e como modificar o schema
3. **Rastreabilidade**: Mudanças no banco são feitas via migrations/scripts controlados
4. **Consistência**: Mesma configuração em todos os ambientes
5. **Prevenção de Erros**: Evita que o TypeORM "adivinhe" mudanças incorretas

## ⚠️ Quando Usar `synchronize: true`?

**NUNCA em produção!** ❌

Use `synchronize: true` **APENAS** se:
- ✅ Você está em um banco de dados de TESTES local
- ✅ Você quer prototipar rapidamente
- ✅ Você aceita que o TypeORM pode DESTRUIR dados
- ✅ O banco é descartável e pode ser recriado a qualquer momento

**Exemplo de configuração condicional (NÃO recomendado):**
```typescript
// ❌ NÃO FAÇA ISSO no seu projeto
synchronize: env.NODE_ENV === 'test' && env.USE_SYNC === 'true'
```

## 📊 Comparação

| Aspecto | `synchronize: false` (Atual) | `synchronize: true` |
|---------|------------------------------|---------------------|
| Segurança | ✅ Alta | ❌ Baixa |
| Controle | ✅ Total | ❌ Automático |
| Produção | ✅ Seguro | ❌ NUNCA USE |
| DEV | ✅ Recomendado | ⚠️ Apenas para prototipagem |
| Risco de Perda de Dados | ✅ Zero | ❌ Alto |
| Migrations | ✅ Necessárias | ❌ Desnecessárias |

## 🔧 Como Gerenciar Mudanças no Schema?

Com `synchronize: false`, você tem 3 opções para alterar a estrutura do banco:

### Opção 1: Scripts SQL Manuais (Recomendado)
```sql
-- Criar nova coluna
ALTER TABLE TB_Funcionario 
ADD Nova_Coluna VARCHAR(50) NULL;

-- Atualizar dados
UPDATE TB_Funcionario SET Nova_Coluna = 'Valor Padrão';
```

**Vantagens:**
- ✅ Controle total
- ✅ Reversível
- ✅ Documentado
- ✅ Versionável no Git

### Opção 2: TypeORM Migrations
```bash
# Criar migration
npm run typeorm migration:create src/shared/infra/database/migrations/AddNovaColuna

# Rodar migrations
npm run typeorm migration:run

# Reverter migrations
npm run typeorm migration:revert
```

**Vantagens:**
- ✅ Integrado com TypeORM
- ✅ Versionado automaticamente
- ✅ Reversível
- ✅ Funciona com código TypeScript

### Opção 3: SQL Server Management Studio (SSMS)
- Use o SSMS para fazer alterações visuais
- Exporte o script de alteração
- Versione no Git

## 🛡️ Boas Práticas

### ✅ FAZER

1. **Manter `synchronize: false` sempre**
   ```typescript
   synchronize: false  // ✅ Sempre
   ```

2. **Usar migrations ou scripts SQL para mudanças**
   ```sql
   -- Versionar no Git: database/migrations/001_add_column.sql
   ALTER TABLE TB_Funcionario ADD Nova_Coluna VARCHAR(50);
   ```

3. **Documentar todas as mudanças de schema**
   ```markdown
   ## Migration 001: Adicionar coluna Nova_Coluna
   - Data: 2026-01-07
   - Motivo: Suporte a nova funcionalidade X
   - Rollback: ALTER TABLE TB_Funcionario DROP COLUMN Nova_Coluna;
   ```

4. **Testar mudanças em ambiente de DEV primeiro**

5. **Fazer backup antes de qualquer alteração**

### ❌ NÃO FAZER

1. **Usar `synchronize: true` em produção**
   ```typescript
   synchronize: true  // ❌ NUNCA!
   ```

2. **Confiar que o TypeORM vai "fazer a coisa certa"**
   - TypeORM pode interpretar mudanças de forma errada
   - Pode dropar colunas/tabelas acidentalmente

3. **Modificar entidades sem planejar a migration**
   ```typescript
   // ❌ Adicionar campo na entidade sem migration
   @Column()
   novoCampo: string  // TypeORM não vai criar isso no banco!
   ```

4. **Usar `synchronize: true` baseado em ambiente**
   ```typescript
   // ❌ Perigoso!
   synchronize: env.NODE_ENV === 'dev'  
   ```

## 🧪 Como Validar

### Teste 1: Verificar que não altera tabelas

1. Adicione uma coluna temporária em uma entidade:
   ```typescript
   @Column()
   coluna_teste?: string
   ```

2. Rode a aplicação:
   ```bash
   npm run dev
   ```

3. Verifique no banco de dados:
   ```sql
   SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_NAME = 'TB_Funcionario' AND COLUMN_NAME = 'coluna_teste'
   ```

4. **Resultado esperado**: ❌ Coluna NÃO deve existir no banco
   - Isso confirma que `synchronize: false` está funcionando

5. Remova a coluna do código

### Teste 2: Verificar logs

Com `logging: true` em DEV, você verá apenas queries SQL, NUNCA DDL:

```typescript
// ✅ Você vai ver (queries normais)
SELECT * FROM TB_Funcionario
INSERT INTO TB_Funcionario (...)
UPDATE TB_Funcionario SET ...

// ❌ Você NUNCA vai ver (DDL)
CREATE TABLE TB_Funcionario ...
ALTER TABLE TB_Funcionario ADD COLUMN ...
DROP TABLE ...
```

## 📝 Exemplo de Workflow

### Cenário: Adicionar campo "observacoes" na tabela Funcionario

**Passo 1: Atualizar a entidade**
```typescript
@Entity('TB_Funcionario')
export class Funcionario {
  // ... campos existentes
  
  @Column({ name: 'Observacoes', type: 'text', nullable: true })
  observacoes?: string
}
```

**Passo 2: Criar script SQL**
```sql
-- database/migrations/002_add_observacoes_funcionario.sql
-- Data: 2026-01-07
-- Descrição: Adicionar campo de observações

ALTER TABLE TB_Funcionario 
ADD Observacoes TEXT NULL;

-- Rollback
-- ALTER TABLE TB_Funcionario DROP COLUMN Observacoes;
```

**Passo 3: Executar script**
```bash
# Via SQL Server Management Studio
# OU
sqlcmd -S localhost -d ILPI_Portaria -i database/migrations/002_add_observacoes_funcionario.sql
```

**Passo 4: Testar**
```bash
npm run dev
# Verificar que a aplicação funciona normalmente
```

**Passo 5: Commitar**
```bash
git add .
git commit -m "feat: adicionar campo observações em Funcionario"
```

## 🎓 Resumo

### Sua Configuração Atual: ✅ PERFEITA!

```typescript
synchronize: false
```

**Esta configuração garante que:**
- ✅ Seu banco de dados está SEGURO
- ✅ Nada será alterado automaticamente
- ✅ Você tem controle total sobre mudanças
- ✅ Funciona perfeitamente em DEV, TEST e PRODUCTION
- ✅ É a melhor prática recomendada pela comunidade TypeORM

### Pode Rodar em DEV Sem Preocupação! 🚀

Com `synchronize: false`, você pode rodar sua aplicação em desenvolvimento quantas vezes quiser. O TypeORM **NUNCA** vai modificar a estrutura das suas tabelas.

---

## 📚 Referências

- [TypeORM Synchronize Documentation](https://typeorm.io/data-source-options#common-data-source-options)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)
- [Best Practices for Production](https://typeorm.io/usage-in-production)

---

**Mantenha `synchronize: false` sempre!** 🔒

Seu banco de dados agradece! 😊

