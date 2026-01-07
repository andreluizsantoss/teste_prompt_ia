# 📦 Template de Módulo

Este guia mostra como criar um novo módulo seguindo Clean Architecture.

## 🏗️ Estrutura de um Módulo

```
src/modules/[nome_modulo]/
├── domain/
│   ├── entities/              # Entidades TypeORM
│   │   └── [Nome].ts
│   ├── models/                # Interfaces/DTOs
│   │   ├── I[Nome].ts
│   │   └── ICreate[Nome]DTO.ts
│   └── repositories/          # Interfaces de repositórios
│       └── I[Nome]Repository.ts
├── infra/
│   ├── http/
│   │   ├── controllers/       # Controllers
│   │   │   └── [Nome]Controller.ts
│   │   ├── routes/            # Rotas
│   │   │   └── [nome].routes.ts
│   │   └── validators/        # Validações Zod
│   │       └── [nome].validator.ts
│   └── repositories/          # Implementações
│       └── [Nome]Repository.ts
├── services/                  # Casos de uso
│   ├── Create[Nome]Service.ts
│   ├── List[Nome]Service.ts
│   ├── Show[Nome]Service.ts
│   ├── Update[Nome]Service.ts
│   └── Delete[Nome]Service.ts
└── __tests__/
    ├── unit/                  # Testes unitários
    │   └── Create[Nome]Service.spec.ts
    └── integration/           # Testes de integração
        └── [nome].spec.ts
```

---

## 📝 Exemplo: Módulo User

### 1. Entidade (domain/entities/User.ts)

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
```

### 2. Interface do Repositório (domain/repositories/IUsersRepository.ts)

```typescript
import { User } from '../entities/User'

export interface ICreateUserDTO {
  name: string
  email: string
  password: string
}

export interface IUsersRepository {
  create(data: ICreateUserDTO): User
  save(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
  delete(id: string): Promise<void>
}
```

### 3. Implementação do Repositório (infra/repositories/UsersRepository.ts)

```typescript
import { Repository } from 'typeorm'
import { AppDataSource } from '@shared/infra/database/data-source'
import { User } from '@modules/user/domain/entities/User'
import {
  IUsersRepository,
  ICreateUserDTO,
} from '@modules/user/domain/repositories/IUsersRepository'

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>

  constructor() {
    this.repository = AppDataSource.getRepository(User)
  }

  create(data: ICreateUserDTO): User {
    return this.repository.create(data)
  }

  async save(user: User): Promise<User> {
    return await this.repository.save(user)
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } })
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find()
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id)
  }
}
```

### 4. Service (services/CreateUserService.ts)

```typescript
import { inject, injectable } from 'tsyringe'
import { hash } from 'bcryptjs'
import { AppError } from '@shared/errors/AppError'
import { User } from '../domain/entities/User'
import { IUsersRepository } from '../domain/repositories/IUsersRepository'

interface IRequest {
  name: string
  email: string
  password: string
}

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ name, email, password }: IRequest): Promise<User> {
    // Validar se email já existe
    const userExists = await this.usersRepository.findByEmail(email)

    if (userExists) {
      throw new AppError('Email already in use', 400)
    }

    // Hash da senha
    const hashedPassword = await hash(password, 10)

    // Criar usuário
    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    // Salvar no banco
    await this.usersRepository.save(user)

    return user
  }
}
```

### 5. Validator (infra/http/validators/user.validator.ts)

```typescript
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3, 'Name must have at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must have at least 6 characters'),
})

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
})

export type CreateUserDTO = z.infer<typeof createUserSchema>
export type UpdateUserDTO = z.infer<typeof updateUserSchema>
```

### 6. Controller (infra/http/controllers/UsersController.ts)

```typescript
import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { CreateUserService } from '@modules/user/services/CreateUserService'
import { createUserSchema } from '../validators/user.validator'

export class UsersController {
  async create(req: Request, res: Response): Promise<Response> {
    // Validar dados
    const { name, email, password } = createUserSchema.parse(req.body)

    // Executar service
    const createUser = container.resolve(CreateUserService)
    const user = await createUser.execute({ name, email, password })

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user

    return res.status(201).json(userWithoutPassword)
  }
}
```

### 7. Routes (infra/http/routes/user.routes.ts)

```typescript
import { Router } from 'express'
import { UsersController } from '../controllers/UsersController'

const userRoutes = Router()
const usersController = new UsersController()

userRoutes.post('/', usersController.create.bind(usersController))

export { userRoutes }
```

### 8. Registrar no Container (shared/infra/http/container/index.ts)

```typescript
import { container } from 'tsyringe'
import { IUsersRepository } from '@modules/user/domain/repositories/IUsersRepository'
import { UsersRepository } from '@modules/user/infra/repositories/UsersRepository'

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
)

export { container }
```

### 9. Registrar Rotas (shared/infra/http/routes/v1/index.ts)

```typescript
import { Router } from 'express'
import { apiVersionMiddleware } from '@shared/middlewares/apiVersion'
import { userRoutes } from '@modules/user/infra/http/routes/user.routes'

const v1Routes = Router()

v1Routes.use(
  apiVersionMiddleware({
    version: '1.0',
    deprecated: false,
  }),
)

// Registrar rotas
v1Routes.use('/users', userRoutes)

export { v1Routes }
```

### 10. Teste Unitário (__tests__/unit/CreateUserService.spec.ts)

```typescript
import { CreateUserService } from '@modules/user/services/CreateUserService'
import { IUsersRepository } from '@modules/user/domain/repositories/IUsersRepository'
import { AppError } from '@shared/errors/AppError'

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
  })

  it('should not create user with existing email', async () => {
    usersRepository.findByEmail.mockResolvedValue({
      id: '1',
      email: 'john@example.com',
    } as any)

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
```

---

## 🚀 Checklist para Novo Módulo

- [ ] Criar estrutura de pastas
- [ ] Criar entidade TypeORM
- [ ] Criar interface do repositório
- [ ] Implementar repositório
- [ ] Criar services (CRUD)
- [ ] Criar validators (Zod)
- [ ] Criar controller
- [ ] Criar rotas
- [ ] Registrar no DI container
- [ ] Registrar rotas no v1
- [ ] Criar testes unitários
- [ ] Criar testes de integração
- [ ] Atualizar documentação

---

## 📚 Padrões e Convenções

### Nomenclatura
- **Entidades:** PascalCase singular (User, Product)
- **Tabelas:** snake_case plural (users, products)
- **Arquivos:** PascalCase (UserRepository.ts)
- **Rotas:** kebab-case (/user-profiles)

### Estrutura de Response
```typescript
// Sucesso
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2026-01-06T20:00:00.000Z"
}

// Erro
{
  "status": "error",
  "message": "Email already in use"
}
```

### Status HTTP
- `200` - OK (leitura/atualização com sucesso)
- `201` - Created (recurso criado)
- `204` - No Content (deleção com sucesso)
- `400` - Bad Request (validação falhou)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (não autorizado)
- `404` - Not Found (recurso não encontrado)
- `500` - Internal Server Error (erro no servidor)

---

## 🎯 Próximos Passos

1. Copie esta estrutura para criar seu módulo
2. Adapte os nomes para seu domínio
3. Implemente a lógica de negócio
4. Escreva testes
5. Documente endpoints

**Boa sorte! 🚀**

