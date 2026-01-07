#!/usr/bin/env node

/**
 * Script para codificar credenciais do banco de dados para uso em DATABASE_URL
 *
 * Uso:
 *   node scripts/encode-db-credentials.js "LAR!2020#Atendimento" "senha123"
 *   ou simplesmente: node scripts/encode-db-credentials.js
 */

const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function encodeCredential(credential) {
  return encodeURIComponent(credential)
}

function promptForCredentials() {
  rl.question('Digite o username: ', (username) => {
    rl.question('Digite a password (ou deixe em branco): ', (password) => {
      rl.question('Digite o host: ', (host) => {
        rl.question('Digite a porta (padrão 1433): ', (port) => {
          rl.question('Digite o nome do banco de dados: ', (database) => {
            const encodedUsername = encodeCredential(username)
            const encodedPassword = password
              ? encodeCredential(password)
              : ''
            const finalPort = port || '1433'

            const url = password
              ? `mssql://${encodedUsername}:${encodedPassword}@${host}:${finalPort}/${database}`
              : `mssql://${encodedUsername}@${host}:${finalPort}/${database}`

            console.log('\n✅ DATABASE_URL codificada:')
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log(url)
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            console.log(
              '\n📝 Copie a linha acima e cole no seu arquivo .env',
            )
            console.log('   ILPI_CONCIERGE_DATABASE_URL=' + url)

            console.log('\n📋 Detalhes:')
            console.log(`   Username original: ${username}`)
            console.log(`   Username codificado: ${encodedUsername}`)
            if (password) {
              console.log(`   Password original: ${password}`)
              console.log(`   Password codificado: ${encodedPassword}`)
            }

            rl.close()
          })
        })
      })
    })
  })
}

// Se receber argumentos, usa eles, senão pede interativamente
const args = process.argv.slice(2)

if (args.length >= 4) {
  const [username, password, host, port, database] = args
  const encodedUsername = encodeCredential(username)
  const encodedPassword = password ? encodeCredential(password) : ''
  const finalPort = port || '1433'

  const url = password
    ? `mssql://${encodedUsername}:${encodedPassword}@${host}:${finalPort}/${database}`
    : `mssql://${encodedUsername}@${host}:${finalPort}/${database}`

  console.log('\n✅ DATABASE_URL codificada:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(url)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
} else {
  console.log('🔐 Gerador de DATABASE_URL com Encoding')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(
    'Este script irá codificar suas credenciais para uso seguro na URL\n',
  )
  promptForCredentials()
}

