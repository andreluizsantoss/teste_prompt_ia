-- =============================================
-- Script de Criação do Banco de Dados
-- Sistema ILPI Portaria API
-- SQL Server
-- =============================================

-- Criar banco de dados se não existir
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'ILPI_Portaria')
BEGIN
    CREATE DATABASE ILPI_Portaria;
    PRINT 'Banco de dados ILPI_Portaria criado com sucesso!';
END
ELSE
BEGIN
    PRINT 'Banco de dados ILPI_Portaria já existe.';
END
GO

-- Usar o banco de dados
USE ILPI_Portaria;
GO

-- =============================================
-- Tabela: TB_Configuracao
-- Descrição: Armazena configurações gerais do sistema
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Configuracao]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Configuracao] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Nome] VARCHAR(50) NULL,
        [CNPJ] VARCHAR(18) NULL,
        [Endereco] VARCHAR(50) NULL,
        [Bairro] VARCHAR(40) NULL,
        [CEP] VARCHAR(10) NULL,
        [Cidade] VARCHAR(50) NULL,
        [Estado] VARCHAR(2) NULL,
        [Telefone] VARCHAR(30) NULL,
        [E_Mail] VARCHAR(50) NULL,
        [Sistema_Atendimento] VARCHAR(3) NULL,
        [Logo_Empresa] IMAGE NULL,
        CONSTRAINT [PK_TB_Configuracao] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Configuracao criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Configuracao já existe.';
END
GO

-- =============================================
-- Tabela: TB_Funcionario
-- Descrição: Armazena dados dos funcionários
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Funcionario]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Funcionario] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Nome] VARCHAR(50) NULL,
        [Endereco] VARCHAR(50) NULL,
        [Bairro] VARCHAR(50) NULL,
        [Cidade] VARCHAR(50) NULL,
        [CEP] VARCHAR(10) NULL,
        [Estado] VARCHAR(2) NULL,
        [CPF] VARCHAR(14) NULL,
        [Celular] VARCHAR(20) NULL,
        [E_Mail] VARCHAR(50) NULL,
        [Cargo] VARCHAR(50) NULL,
        [Login] VARCHAR(3) NULL,
        [Senha] VARCHAR(20) NULL,
        [ios_token] TEXT NULL,
        [android_token] TEXT NULL,
        [refresh_token] TEXT NULL,
        [Status] VARCHAR(15) NULL,
        [Foto] IMAGE NULL,
        CONSTRAINT [PK_TB_Funcionario] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Funcionario criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Funcionario já existe.';
END
GO

-- =============================================
-- Tabela: TB_Funcionario_Ponto
-- Descrição: Armazena registros de ponto dos funcionários
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Funcionario_Ponto]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Funcionario_Ponto] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Codigo_Funcionario] DECIMAL(18,0) NULL,
        [Data_Entrada] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Entrada] DECIMAL(18,0) NULL,
        [Entrada_Veiculo_Proprio] VARCHAR(3) NULL,
        [Entrada_Observacao] VARCHAR(50) NULL,
        [Data_Saida] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Saida] DECIMAL(18,0) NULL,
        [Saida_Veiculo_Proprio] VARCHAR(3) NULL,
        [Saida_Observacao] VARCHAR(50) NULL,
        CONSTRAINT [PK_TB_Funcionario_Ponto] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Funcionario_Ponto criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Funcionario_Ponto já existe.';
END
GO

-- =============================================
-- Tabela: TB_Funcionario_Movimentacao
-- Descrição: Armazena movimentações de funcionários
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Funcionario_Movimentacao]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Funcionario_Movimentacao] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Codigo_Funcionario] DECIMAL(18,0) NULL,
        [Data_Saida] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Saida] DECIMAL(18,0) NULL,
        [Codigo_Viagem_Saida] DECIMAL(18,0) NULL,
        [Tipo] VARCHAR(30) NULL,
        [Data_Entrada] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Entrada] DECIMAL(18,0) NULL,
        [Codigo_Viagem_Entrada] DECIMAL(18,0) NULL,
        CONSTRAINT [PK_TB_Funcionario_Movimentacao] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Funcionario_Movimentacao criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Funcionario_Movimentacao já existe.';
END
GO

-- =============================================
-- Tabela: TB_Idoso
-- Descrição: Armazena dados dos idosos
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Idoso]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Idoso] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Nome] VARCHAR(80) NULL,
        [Apelido] VARCHAR(40) NULL,
        [Status] VARCHAR(15) NULL,
        [Foto] IMAGE NULL,
        CONSTRAINT [PK_TB_Idoso] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Idoso criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Idoso já existe.';
END
GO

-- =============================================
-- Tabela: TB_Idoso_Movimentacao
-- Descrição: Armazena movimentações de idosos
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Idoso_Movimentacao]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Idoso_Movimentacao] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Codigo_Idoso] DECIMAL(18,0) NULL,
        [Data_Saida] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Saida] DECIMAL(18,0) NULL,
        [Codigo_Viagem_Saida] DECIMAL(18,0) NULL,
        [Data_Entrada] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Entrada] DECIMAL(18,0) NULL,
        [Codigo_Viagem_Entrada] DECIMAL(18,0) NULL,
        [Numero_Autorizacao] DECIMAL(18,0) NULL,
        CONSTRAINT [PK_TB_Idoso_Movimentacao] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Idoso_Movimentacao criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Idoso_Movimentacao já existe.';
END
GO

-- =============================================
-- Tabela: TB_Autorizacao_Saida_Idoso
-- Descrição: Armazena autorizações de saída de idosos
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Autorizacao_Saida_Idoso]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Autorizacao_Saida_Idoso] (
        [Numero] DECIMAL(18,0) NOT NULL,
        [Codigo_Idoso] DECIMAL(18,0) NULL,
        [Data_Saida] DATETIME NULL,
        [Codigo_Funcionario_Autorizacao] DECIMAL(18,0) NULL,
        [Codigo_Funcionario_Acompanhante] DECIMAL(18,0) NULL,
        [Observacao] VARCHAR(MAX) NULL,
        CONSTRAINT [PK_TB_Autorizacao_Saida_Idoso] PRIMARY KEY CLUSTERED ([Numero] ASC)
    );
    PRINT 'Tabela TB_Autorizacao_Saida_Idoso criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Autorizacao_Saida_Idoso já existe.';
END
GO

-- =============================================
-- Tabela: TB_Prestador_Servico
-- Descrição: Armazena dados dos prestadores de serviço
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Prestador_Servico]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Prestador_Servico] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Nome] VARCHAR(50) NULL,
        [Endereco] VARCHAR(50) NULL,
        [Bairro] VARCHAR(50) NULL,
        [Cidade] VARCHAR(50) NULL,
        [CEP] VARCHAR(10) NULL,
        [Estado] VARCHAR(2) NULL,
        [Pessoa] VARCHAR(15) NULL,
        [CNPJ] VARCHAR(18) NULL,
        [CPF] VARCHAR(14) NULL,
        [Celular] VARCHAR(20) NULL,
        [E_Mail] VARCHAR(50) NULL,
        [Status] VARCHAR(15) NULL,
        [Foto] IMAGE NULL,
        CONSTRAINT [PK_TB_Prestador_Servico] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Prestador_Servico criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Prestador_Servico já existe.';
END
GO

-- =============================================
-- Tabela: TB_Servico_Movimentacao
-- Descrição: Armazena movimentações de prestadores de serviço
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Servico_Movimentacao]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Servico_Movimentacao] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Data_Entrada] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Entrada] DECIMAL(18,0) NULL,
        [Objetivo] VARCHAR(200) NULL,
        [Codigo_Funcionario_Responsavel] DECIMAL(18,0) NULL,
        [Data_Saida] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Saida] DECIMAL(18,0) NULL,
        [Codigo_Prestador_Servico] DECIMAL(18,0) NULL,
        CONSTRAINT [PK_TB_Servico_Movimentacao] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Servico_Movimentacao criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Servico_Movimentacao já existe.';
END
GO

-- =============================================
-- Tabela: TB_Veiculo
-- Descrição: Armazena dados dos veículos
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Veiculo]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Veiculo] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Placa] VARCHAR(10) NULL,
        [Marca] VARCHAR(50) NULL,
        [Modelo] VARCHAR(50) NULL,
        [Cor] VARCHAR(50) NULL,
        [Status] VARCHAR(15) NULL,
        CONSTRAINT [PK_TB_Veiculo] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Veiculo criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Veiculo já existe.';
END
GO

-- =============================================
-- Tabela: TB_Veiculo_Movimentacao
-- Descrição: Armazena movimentações de veículos
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Veiculo_Movimentacao]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Veiculo_Movimentacao] (
        [Codigo_Viagem] DECIMAL(18,0) NOT NULL,
        [Codigo_Veiculo] DECIMAL(18,0) NULL,
        [Data_Saida] DATETIME NULL,
        [KM_Saida] DECIMAL(18,0) NULL,
        [Codigo_Funcionario_Portaria_Saida] DECIMAL(18,0) NULL,
        [Observacao_Saida] VARCHAR(50) NULL,
        [Data_Entrada] DATETIME NULL,
        [KM_Entrada] DECIMAL(18,0) NULL,
        [Codigo_Funcionario_Portaria_Entrada] DECIMAL(18,0) NULL,
        [Intercorrencia_Veiculo] VARCHAR(3) NULL,
        [Intercorrencia_Observacao] VARCHAR(50) NULL,
        CONSTRAINT [PK_TB_Veiculo_Movimentacao] PRIMARY KEY CLUSTERED ([Codigo_Viagem] ASC)
    );
    PRINT 'Tabela TB_Veiculo_Movimentacao criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Veiculo_Movimentacao já existe.';
END
GO

-- =============================================
-- Tabela: TB_Visitante
-- Descrição: Armazena dados dos visitantes
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Visitante]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Visitante] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Nome] VARCHAR(50) NULL,
        [Endereco] VARCHAR(50) NULL,
        [Bairro] VARCHAR(50) NULL,
        [Cidade] VARCHAR(50) NULL,
        [CEP] VARCHAR(10) NULL,
        [Estado] VARCHAR(2) NULL,
        [Codigo_Idoso] DECIMAL(18,0) NULL,
        [Grau_Parentesco] VARCHAR(50) NULL,
        [CPF] VARCHAR(14) NULL,
        [Celular] VARCHAR(20) NULL,
        [E_Mail] VARCHAR(50) NULL,
        [Status] VARCHAR(15) NULL,
        [Foto] IMAGE NULL,
        CONSTRAINT [PK_TB_Visitante] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Visitante criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Visitante já existe.';
END
GO

-- =============================================
-- Tabela: TB_Grupo_Visitante
-- Descrição: Armazena grupos de visitantes
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Grupo_Visitante]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Grupo_Visitante] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Descricao] VARCHAR(50) NULL,
        CONSTRAINT [PK_TB_Grupo_Visitante] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Grupo_Visitante criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Grupo_Visitante já existe.';
END
GO

-- =============================================
-- Tabela: TB_Visitante_Movimentacao
-- Descrição: Armazena movimentações de visitantes
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Visitante_Movimentacao]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Visitante_Movimentacao] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Codigo_Visitante] DECIMAL(18,0) NULL,
        [Codigo_Grupo] DECIMAL(18,0) NULL,
        [Numero_Pessoas_grupo] DECIMAL(18,0) NULL,
        [Codigo_Idoso] DECIMAL(18,0) NULL,
        [Data_Entrada] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Entrada] DECIMAL(18,0) NULL,
        [Motivo_Visita] VARCHAR(200) NULL,
        [Data_Saida] DATETIME NULL,
        [Codigo_Funcionario_Portaria_Saida] DECIMAL(18,0) NULL,
        CONSTRAINT [PK_TB_Visitante_Movimentacao] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Visitante_Movimentacao criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Visitante_Movimentacao já existe.';
END
GO

-- =============================================
-- Tabela: TB_Mensagem
-- Descrição: Armazena mensagens do sistema
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Mensagem]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Mensagem] (
        [Codigo] DECIMAL(18,0) NOT NULL,
        [Mensagem] VARCHAR(MAX) NULL,
        [Data_Inicial] DATE NULL,
        [Data_Final] DATE NULL,
        CONSTRAINT [PK_TB_Mensagem] PRIMARY KEY CLUSTERED ([Codigo] ASC)
    );
    PRINT 'Tabela TB_Mensagem criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Mensagem já existe.';
END
GO

-- =============================================
-- Tabela: TB_Mensagem_Funcionario
-- Descrição: Relacionamento entre mensagens e funcionários
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Mensagem_Funcionario]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Mensagem_Funcionario] (
        [Codigo_Mensagem] DECIMAL(18,0) NOT NULL,
        [Codigo_Funcionario] DECIMAL(18,0) NOT NULL,
        [Visualizado] VARCHAR(3) NULL,
        CONSTRAINT [PK_TB_Mensagem_Funcionario] PRIMARY KEY CLUSTERED 
        (
            [Codigo_Mensagem] ASC,
            [Codigo_Funcionario] ASC
        )
    );
    PRINT 'Tabela TB_Mensagem_Funcionario criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Mensagem_Funcionario já existe.';
END
GO

-- =============================================
-- Tabela: TB_Disparo_Email
-- Descrição: Armazena configurações de disparo de email
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Disparo_Email]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Disparo_Email] (
        [Codigo_Rotina] DECIMAL(18,0) NOT NULL,
        [Codigo_Situacao] DECIMAL(18,0) NOT NULL,
        [Identificacao] VARCHAR(50) NULL,
        [E_Mail1] VARCHAR(100) NULL,
        [E_Mail2] VARCHAR(100) NULL,
        [E_Mail3] VARCHAR(100) NULL,
        CONSTRAINT [PK_TB_Disparo_Email] PRIMARY KEY CLUSTERED 
        (
            [Codigo_Rotina] ASC,
            [Codigo_Situacao] ASC
        )
    );
    PRINT 'Tabela TB_Disparo_Email criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Disparo_Email já existe.';
END
GO

-- =============================================
-- Tabela: TB_Intercorrencia
-- Descrição: Armazena intercorrências registradas
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[TB_Intercorrencia]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[TB_Intercorrencia] (
        [Sequencia] DECIMAL(18,0) NOT NULL,
        [Data_Intercorrencia] DATE NULL,
        [Descricao_Intercorrencia] VARCHAR(MAX) NULL,
        [Conduta] VARCHAR(MAX) NULL,
        [Data_Atualizacao] DATE NULL,
        [Codigo_Funcionario_Registro] DECIMAL(18,0) NOT NULL,
        CONSTRAINT [PK_TB_Intercorrencia] PRIMARY KEY CLUSTERED ([Sequencia] ASC)
    );
    PRINT 'Tabela TB_Intercorrencia criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela TB_Intercorrencia já existe.';
END
GO

-- =============================================
-- Criar Foreign Keys (Chaves Estrangeiras)
-- =============================================
PRINT '';
PRINT '==========================================';
PRINT 'Criando Foreign Keys...';
PRINT '==========================================';
GO

-- FK: TB_Funcionario_Ponto -> TB_Funcionario
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TB_Funcionario_Ponto_TB_Funcionario')
BEGIN
    ALTER TABLE [dbo].[TB_Funcionario_Ponto]
    ADD CONSTRAINT [FK_TB_Funcionario_Ponto_TB_Funcionario] 
    FOREIGN KEY ([Codigo_Funcionario]) 
    REFERENCES [dbo].[TB_Funcionario] ([Codigo]);
    
    PRINT 'FK_TB_Funcionario_Ponto_TB_Funcionario criada com sucesso!';
END
GO

-- FK: TB_Idoso_Movimentacao -> TB_Idoso
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TB_Idoso_Movimentacao_TB_Idoso')
BEGIN
    ALTER TABLE [dbo].[TB_Idoso_Movimentacao]
    ADD CONSTRAINT [FK_TB_Idoso_Movimentacao_TB_Idoso] 
    FOREIGN KEY ([Codigo_Idoso]) 
    REFERENCES [dbo].[TB_Idoso] ([Codigo]);
    
    PRINT 'FK_TB_Idoso_Movimentacao_TB_Idoso criada com sucesso!';
END
GO

-- FK: TB_Servico_Movimentacao -> TB_Prestador_Servico
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TB_Servico_Movimentacao_TB_Prestador_Servico')
BEGIN
    ALTER TABLE [dbo].[TB_Servico_Movimentacao]
    ADD CONSTRAINT [FK_TB_Servico_Movimentacao_TB_Prestador_Servico] 
    FOREIGN KEY ([Codigo_Prestador_Servico]) 
    REFERENCES [dbo].[TB_Prestador_Servico] ([Codigo]);
    
    PRINT 'FK_TB_Servico_Movimentacao_TB_Prestador_Servico criada com sucesso!';
END
GO

-- FK: TB_Servico_Movimentacao -> TB_Funcionario
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TB_Servico_Movimentacao_TB_Funcionario')
BEGIN
    ALTER TABLE [dbo].[TB_Servico_Movimentacao]
    ADD CONSTRAINT [FK_TB_Servico_Movimentacao_TB_Funcionario] 
    FOREIGN KEY ([Codigo_Funcionario_Responsavel]) 
    REFERENCES [dbo].[TB_Funcionario] ([Codigo]);
    
    PRINT 'FK_TB_Servico_Movimentacao_TB_Funcionario criada com sucesso!';
END
GO

-- FK: TB_Veiculo_Movimentacao -> TB_Veiculo
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TB_Veiculo_Movimentacao_TB_Veiculo')
BEGIN
    ALTER TABLE [dbo].[TB_Veiculo_Movimentacao]
    ADD CONSTRAINT [FK_TB_Veiculo_Movimentacao_TB_Veiculo] 
    FOREIGN KEY ([Codigo_Veiculo]) 
    REFERENCES [dbo].[TB_Veiculo] ([Codigo]);
    
    PRINT 'FK_TB_Veiculo_Movimentacao_TB_Veiculo criada com sucesso!';
END
GO

-- FK: TB_Visitante_Movimentacao -> TB_Grupo_Visitante
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TB_Visitante_Movimentacao_TB_Grupo_Visitante')
BEGIN
    ALTER TABLE [dbo].[TB_Visitante_Movimentacao]
    ADD CONSTRAINT [FK_TB_Visitante_Movimentacao_TB_Grupo_Visitante] 
    FOREIGN KEY ([Codigo_Grupo]) 
    REFERENCES [dbo].[TB_Grupo_Visitante] ([Codigo]);
    
    PRINT 'FK_TB_Visitante_Movimentacao_TB_Grupo_Visitante criada com sucesso!';
END
GO

-- FK: TB_Mensagem_Funcionario -> TB_Mensagem
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_TB_Mensagem_Funcionario_TB_Mensagem')
BEGIN
    ALTER TABLE [dbo].[TB_Mensagem_Funcionario]
    ADD CONSTRAINT [FK_TB_Mensagem_Funcionario_TB_Mensagem] 
    FOREIGN KEY ([Codigo_Mensagem]) 
    REFERENCES [dbo].[TB_Mensagem] ([Codigo]);
    
    PRINT 'FK_TB_Mensagem_Funcionario_TB_Mensagem criada com sucesso!';
END
GO

-- =============================================
-- Criar Índices para Melhor Performance
-- =============================================
PRINT '';
PRINT '==========================================';
PRINT 'Criando Índices...';
PRINT '==========================================';
GO

-- Índices para TB_Funcionario
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Funcionario_CPF')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Funcionario_CPF] 
    ON [dbo].[TB_Funcionario] ([CPF]);
    PRINT 'Índice IX_TB_Funcionario_CPF criado com sucesso!';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Funcionario_Status')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Funcionario_Status] 
    ON [dbo].[TB_Funcionario] ([Status]);
    PRINT 'Índice IX_TB_Funcionario_Status criado com sucesso!';
END
GO

-- Índices para TB_Idoso
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Idoso_Status')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Idoso_Status] 
    ON [dbo].[TB_Idoso] ([Status]);
    PRINT 'Índice IX_TB_Idoso_Status criado com sucesso!';
END
GO

-- Índices para TB_Visitante
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Visitante_CPF')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Visitante_CPF] 
    ON [dbo].[TB_Visitante] ([CPF]);
    PRINT 'Índice IX_TB_Visitante_CPF criado com sucesso!';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Visitante_Codigo_Idoso')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Visitante_Codigo_Idoso] 
    ON [dbo].[TB_Visitante] ([Codigo_Idoso]);
    PRINT 'Índice IX_TB_Visitante_Codigo_Idoso criado com sucesso!';
END
GO

-- Índices para TB_Veiculo
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Veiculo_Placa')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Veiculo_Placa] 
    ON [dbo].[TB_Veiculo] ([Placa]);
    PRINT 'Índice IX_TB_Veiculo_Placa criado com sucesso!';
END
GO

-- Índices para Movimentações
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Funcionario_Ponto_Data_Entrada')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Funcionario_Ponto_Data_Entrada] 
    ON [dbo].[TB_Funcionario_Ponto] ([Data_Entrada]);
    PRINT 'Índice IX_TB_Funcionario_Ponto_Data_Entrada criado com sucesso!';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Idoso_Movimentacao_Data_Saida')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Idoso_Movimentacao_Data_Saida] 
    ON [dbo].[TB_Idoso_Movimentacao] ([Data_Saida]);
    PRINT 'Índice IX_TB_Idoso_Movimentacao_Data_Saida criado com sucesso!';
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_TB_Visitante_Movimentacao_Data_Entrada')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_TB_Visitante_Movimentacao_Data_Entrada] 
    ON [dbo].[TB_Visitante_Movimentacao] ([Data_Entrada]);
    PRINT 'Índice IX_TB_Visitante_Movimentacao_Data_Entrada criado com sucesso!';
END
GO

-- =============================================
-- Script Finalizado
-- =============================================
PRINT '';
PRINT '==========================================';
PRINT 'Script executado com sucesso!';
PRINT 'Banco de dados ILPI_Portaria está pronto para uso.';
PRINT '==========================================';
GO

