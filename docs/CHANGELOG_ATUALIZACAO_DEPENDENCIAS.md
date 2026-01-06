# 📦 Changelog - Atualização de Dependências

## 📅 Data: 06/01/2026

## 🎯 Objetivo

Atualizar dependências depreciadas para eliminar warnings do `npm install` e garantir compatibilidade com versões mais recentes das bibliotecas.

---

## ⚠️ Problema Identificado

Ao executar `npm install`, eram exibidos **9 warnings** de dependências depreciadas:

```bash
❌ npm warn deprecated inflight@1.0.6
❌ npm warn deprecated @humanwhocodes/config-array@0.13.0
❌ npm warn deprecated rimraf@2.7.1
❌ npm warn deprecated rimraf@3.0.2
❌ npm warn deprecated supertest@6.3.4
❌ npm warn deprecated glob@7.2.3
❌ npm warn deprecated @humanwhocodes/object-schema@2.0.3
❌ npm warn deprecated superagent@8.1.2
❌ npm warn deprecated eslint@8.57.1
```

---

## ✅ Solução Implementada

### 📊 Resultado: 9 warnings → 3 warnings

Após a atualização, apenas **3 warnings permanecem** (dependências transitivas que não podemos controlar diretamente):

```bash
⚠️ npm warn deprecated inflight@1.0.6 (transitivo de ts-jest)
⚠️ npm warn deprecated rimraf@2.7.1 (transitivo)
⚠️ npm warn deprecated glob@7.2.3 (transitivo)
```

### ✅ Warnings Eliminados (6):
- ✅ eslint@8.57.1 → eslint@9.17.0
- ✅ supertest@6.3.4 → supertest@7.0.0
- ✅ superagent@8.1.2 (resolvido com supertest v7)
- ✅ @humanwhocodes/config-array@0.13.0 (resolvido com ESLint v9)
- ✅ @humanwhocodes/object-schema@2.0.3 (resolvido com ESLint v9)
- ✅ rimraf@3.0.2 (uma das duas versões)

---

## 🔧 Atualizações Realizadas

### 1. **Dependências Atualizadas**

#### ESLint e Plugins
```diff
- "eslint": "^8.57.1"
+ "eslint": "^9.17.0"

- "@typescript-eslint/eslint-plugin": "^6.21.0"
- "@typescript-eslint/parser": "^6.21.0"
+ "@typescript-eslint/eslint-plugin": "^8.18.2"
+ "@typescript-eslint/parser": "^8.18.2"
+ "typescript-eslint": "^8.18.2"
```

**Por quê?**
- ESLint v8 não é mais suportado
- TypeScript ESLint v8+ necessário para ESLint v9
- Eliminação de warnings de @humanwhocodes packages

#### Supertest
```diff
- "supertest": "^6.3.3"
+ "supertest": "^7.0.0"
```

**Por quê?**
- Versão 6.3.3 deprecada
- Supertest v7+ tem melhorias de segurança e performance
- Elimina warning de superagent

---

### 2. **Configuração do ESLint**

#### ❌ Antes (ESLint v8)

**Arquivo:** `.eslintrc.js` (CommonJS)

```javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  // ...
}
```

**Arquivo separado:** `.eslintignore`

#### ✅ Depois (ESLint v9)

**Arquivo:** `eslint.config.mjs` (ESM - Flat Config)

```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', /* ... */],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
)
```

**Mudanças principais:**
- ✅ Arquivo `.eslintrc.js` removido
- ✅ Arquivo `.eslintignore` removido
- ✅ Novo arquivo `eslint.config.mjs` (flat config)
- ✅ Usa ESM (import/export) ao invés de CommonJS (require/module.exports)
- ✅ Ignores integrados no próprio config

---

### 3. **Scripts do package.json**

```diff
- "lint": "eslint . --ext .ts"
- "lint:fix": "eslint . --ext .ts --fix"
+ "lint": "eslint ."
+ "lint:fix": "eslint . --fix"
```

**Por quê?**
- ESLint v9 detecta automaticamente extensões TypeScript
- Sintaxe mais simples e limpa

---

### 4. **Correção de Código**

**Arquivo:** `src/shared/infra/http/controllers/health_controller.ts`

```diff
- } catch (error) {
+ } catch (_error) {
```

**Por quê?**
- Variável `error` não usada no catch
- Prefixo `_` indica variável intencionalmente não usada
- ESLint configurado para ignorar variáveis com prefixo `_`

---

## 🧪 Validação

### ✅ Testes
```bash
npm test
# ✅ PASS  2/2 tests
```

### ✅ Linting
```bash
npm run lint
# ✅ 0 errors, 1 warning (esperado)
```

### ✅ TypeScript
```bash
npx tsc --noEmit
# ✅ 0 errors
```

### ✅ Instalação
```bash
npm install
# ✅ 3 warnings (dependências transitivas apenas)
# ✅ 0 vulnerabilities
```

---

## 📊 Comparação Antes e Depois

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Warnings no npm install** | 9 | 3 | 🔻 66% |
| **ESLint** | v8.57.1 (deprecado) | v9.17.0 (atual) | ✅ Atualizado |
| **Supertest** | v6.3.3 (deprecado) | v7.0.0 (atual) | ✅ Atualizado |
| **TypeScript ESLint** | v6.21.0 | v8.18.2 | ✅ Atualizado |
| **Configuração ESLint** | `.eslintrc.js` | `eslint.config.mjs` | ✅ Flat Config |
| **Arquivos de config** | 2 (.eslintrc + .eslintignore) | 1 (eslint.config.mjs) | 🔻 50% |
| **Testes** | ✅ Passando | ✅ Passando | ✅ OK |
| **Vulnerabilidades** | 0 | 0 | ✅ OK |

---

## 🎯 Benefícios da Atualização

### 🚀 Performance
- ✅ ESLint v9 é mais rápido que v8
- ✅ Supertest v7 tem melhorias de performance

### 🔒 Segurança
- ✅ Versões mais recentes com patches de segurança
- ✅ Dependências depreciadas removidas

### 🛠️ Manutenibilidade
- ✅ Código mais limpo (flat config)
- ✅ Menos arquivos de configuração
- ✅ Sintaxe moderna (ESM)

### 📦 Compatibilidade
- ✅ Pronto para futuras atualizações
- ✅ Seguindo padrões atuais
- ✅ Suporte ativo das bibliotecas

---

## 📝 Atualizações no Prompt

**Arquivo:** `.ia/prompts/setup_backend_nodejs_typeorm.md`

### Versões Atualizadas
- ✅ eslint: ^9.17.0
- ✅ @typescript-eslint/eslint-plugin: ^8.18.2
- ✅ @typescript-eslint/parser: ^8.18.2
- ✅ typescript-eslint: ^8.18.2
- ✅ supertest: ^7.0.0

### Configuração Atualizada
- ✅ Seção "Configuração ESLint" reescrita
- ✅ Exemplo de `eslint.config.mjs` (flat config)
- ✅ Notas sobre ESLint v9
- ✅ Scripts do package.json atualizados
- ✅ Checklists atualizados

---

## 🔍 Warnings Restantes (Transitivos)

Estes 3 warnings são de **dependências transitivas** que não podemos controlar:

### 1. inflight@1.0.6
**Usado por:** `glob@7.2.3` → `ts-jest`
**Status:** Aguardando atualização do ts-jest

### 2. rimraf@2.7.1
**Usado por:** Dependências transitivas
**Status:** Será resolvido quando dependências atualizarem

### 3. glob@7.2.3
**Usado por:** `ts-jest`
**Status:** Aguardando atualização do ts-jest

**Nota:** Estes warnings **não afetam** a funcionalidade do projeto e serão resolvidos automaticamente quando as bibliotecas upstream atualizarem suas dependências.

---

## 🚀 Como Aplicar em Projetos Existentes

### 1. Atualizar package.json
```bash
# Copiar as versões atualizadas do package.json
```

### 2. Criar eslint.config.mjs
```bash
# Criar o novo arquivo de configuração flat config
```

### 3. Remover arquivos antigos
```bash
rm .eslintrc.js
rm .eslintignore
```

### 4. Limpar e reinstalar
```bash
rm -rf node_modules package-lock.json
npm install
```

### 5. Testar
```bash
npm run lint
npm test
```

---

## 📖 Referências

- [ESLint v9 Migration Guide](https://eslint.org/docs/latest/use/migrate-to-9.0.0)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [TypeScript ESLint v8](https://typescript-eslint.io/)
- [Supertest v7 Release Notes](https://github.com/ladjs/supertest/releases/tag/v7.0.0)

---

## ✨ Resumo

| Item | Status |
|------|--------|
| **Warnings reduzidos** | ✅ 9 → 3 (66%) |
| **ESLint atualizado** | ✅ v8 → v9 |
| **Supertest atualizado** | ✅ v6 → v7 |
| **Flat config implementado** | ✅ |
| **Testes passando** | ✅ 2/2 |
| **Linting OK** | ✅ 0 errors |
| **TypeScript OK** | ✅ 0 errors |
| **Prompt atualizado** | ✅ |
| **Documentação criada** | ✅ |

---

**Status:** ✅ Atualização Completa  
**Versão:** 1.3.0  
**Data:** 06/01/2026  
**Warnings Eliminados:** 6 de 9 (66%)

---

## 🎉 Conclusão

A atualização foi realizada com sucesso! O projeto agora usa as versões mais recentes das bibliotecas, com configuração moderna (ESLint flat config) e apenas 3 warnings transitivos que não afetam a funcionalidade.

**Próximos passos:** Continue desenvolvendo com confiança sabendo que suas dependências estão atualizadas e sem warnings evitáveis!

