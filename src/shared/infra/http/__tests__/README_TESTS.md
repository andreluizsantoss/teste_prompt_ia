# 🧪 Guia de Testes

## Estrutura de Testes

Este projeto utiliza **Jest** e **Supertest** para testes unitários e de integração.

## 📁 Organização

```
__tests__/
├── unit/          # Testes unitários (isolados)
└── integration/   # Testes de integração (com banco)
```

## 🎯 Tipos de Testes

### 1. Testes de Integração (API)
Testam endpoints completos incluindo banco de dados.

**Exemplo:** `health.spec.ts`
```typescript
import request from 'supertest'
import { app } from '@shared/infra/http/app'
import { AppDataSource } from '@shared/infra/database/data-source'

describe('GET /health', () => {
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
  })

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })

  it('should return health status', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'ok')
  })
})
```

### 2. Testes Unitários (Services)
Testam lógica de negócio isoladamente usando mocks.

**Exemplo:** Teste de Service
```typescript
import { CreateUserService } from '@modules/user/services/CreateUserService'
import { IUsersRepository } from '@modules/user/domain/repositories/IUsersRepository'

describe('CreateUserService', () => {
  let createUser: CreateUserService
  let usersRepository: jest.Mocked<IUsersRepository>

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findByEmail: jest.fn(),
    } as any

    createUser = new CreateUserService(usersRepository)
  })

  it('should create a new user', async () => {
    usersRepository.findByEmail.mockResolvedValue(null)
    usersRepository.save.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    } as any)

    const result = await createUser.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    expect(result).toHaveProperty('id')
    expect(result.name).toBe('John Doe')
    expect(usersRepository.save).toHaveBeenCalled()
  })
})
```

## 🚀 Comandos

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de código
npm run test:coverage
```

## 📊 Boas Práticas

### ✅ DO (Faça)
- ✅ Teste comportamentos, não implementação
- ✅ Use nomes descritivos (`should create user when email is valid`)
- ✅ Arrange, Act, Assert (AAA pattern)
- ✅ Mock dependências externas
- ✅ Limpe o banco após testes de integração
- ✅ Use `beforeEach` para setup comum
- ✅ Teste casos de sucesso E erro

### ❌ DON'T (Não faça)
- ❌ Testar implementação interna
- ❌ Compartilhar estado entre testes
- ❌ Testes dependentes de ordem
- ❌ Hardcode de dados sensíveis
- ❌ Ignorar testes que falham

## 🎯 Padrões de Teste

### Arrange, Act, Assert (AAA)
```typescript
it('should do something', async () => {
  // Arrange - Preparar dados e mocks
  const mockData = { name: 'Test' }
  repository.findOne.mockResolvedValue(mockData)

  // Act - Executar ação
  const result = await service.execute()

  // Assert - Verificar resultado
  expect(result).toEqual(mockData)
})
```

### Given-When-Then
```typescript
it('should create user when email is unique', async () => {
  // Given - Estado inicial
  const userData = { email: 'unique@test.com', name: 'Test' }
  repository.findByEmail.mockResolvedValue(null)

  // When - Ação
  const result = await createUser.execute(userData)

  // Then - Resultado esperado
  expect(result).toHaveProperty('id')
  expect(repository.save).toHaveBeenCalledWith(
    expect.objectContaining({ email: userData.email })
  )
})
```

## 📝 Checklist de Testes

Para cada feature, crie testes para:

- [ ] Caso de sucesso (happy path)
- [ ] Validações de entrada
- [ ] Casos de erro esperados
- [ ] Autenticação/Autorização
- [ ] Casos limite (edge cases)

## 🔍 Cobertura de Código

Meta: **>= 80%** de cobertura

Verificar com:
```bash
npm run test:coverage
```

Áreas que **devem** ter 100% de cobertura:
- Services (lógica de negócio)
- Validators
- Middlewares críticos

Áreas que podem ter cobertura menor:
- Controllers (testados via integração)
- Entidades TypeORM
- Arquivos de configuração

## 🐛 Debugging Testes

```typescript
// Adicionar console.log
it('should do something', () => {
  console.log('Debug:', someVariable)
  expect(someVariable).toBe(true)
})

// Usar fit para rodar só um teste
fit('should run only this test', () => {
  // ...
})

// Usar fdescribe para rodar só uma suite
fdescribe('Only this suite', () => {
  // ...
})
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Lembre-se:** Bons testes são investimento, não custo! 🚀

