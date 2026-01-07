// Setup de variáveis de ambiente para testes
process.env.ILPI_CONCIERGE_NODE_ENV = 'test'
process.env.ILPI_CONCIERGE_PORT = '3333'
process.env.ILPI_CONCIERGE_FRONTEND_PERMISSION = 'http://localhost:3000'
process.env.ILPI_CONCIERGE_KILOMETRAGEM = '100'
process.env.ILPI_CONCIERGE_DATABASE_URL =
  'mssql://test:test@localhost:1433/test_db'
process.env.ILPI_CONCIERGE_JWT_SECRET =
  'test_jwt_secret_key_minimum_32_characters_long'
process.env.ILPI_CONCIERGE_ACCESS_TOKEN_LIFE = '15m'
process.env.ILPI_CONCIERGE_REFRESH_TOKEN_SECRET =
  'test_refresh_token_secret_key_minimum_32_characters'
process.env.ILPI_CONCIERGE_REFRESH_TOKEN_LIFE = '7d'
process.env.ILPI_CONCIERGE_REFRESH_TOKEN_NOT_BEFORE = '0'
process.env.ILPI_CONCIERGE_REFRESH_TOKEN_LIFE_MS = '604800000'
process.env.ILPI_CONCIERGE_MAIL_DRIVER = 'ethereal'
process.env.ILPI_CONCIERGE_HOST_EMAIL = 'smtp.ethereal.email'
process.env.ILPI_CONCIERGE_NAME_EMAIL = 'Test'
process.env.ILPI_CONCIERGE_CREDENTIAL_EMAIL = 'test@test.com'
process.env.ILPI_CONCIERGE_CREDENTIAL_PASSWORD = 'testpassword'
process.env.ILPI_CONCIERGE_PORT_EMAIL = '587'
process.env.ILPI_CONCIERGE_GOOGLE_APPLICATION_CREDENTIALS = ''
