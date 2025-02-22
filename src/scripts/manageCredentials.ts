import { CredentialsManager } from '../utils/credentials';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('Gerenciador de Credenciais\n');
  
  const action = await askQuestion('Você quer [S]alvar ou [C]arregar credenciais? ');

  if (action.toLowerCase() === 's') {
    const username = await askQuestion('Digite o nome de usuário: ');
    const password = await askQuestion('Digite a senha: ');
    const omieKey = await askQuestion('Digite a chave da API Omie: ');
    const omieSecret = await askQuestion('Digite o secret da API Omie: ');

    const credentials = {
      ADMIN_USERNAME: username,
      ADMIN_PASSWORD: password,
      OMIE_APP_KEY: omieKey,
      OMIE_APP_SECRET: omieSecret
    };

    CredentialsManager.saveCredentials(credentials);
    console.log('\nCredenciais salvas com sucesso!');
  } else if (action.toLowerCase() === 'c') {
    const credentials = CredentialsManager.loadCredentials();
    console.log('\nCredenciais carregadas:');
    console.log(credentials);
  }

  rl.close();
}

main().catch(console.error); 