#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function copyFile(source, destination) {
  fs.readFile(source, 'utf8', (err, data) => {
    if (err) {
      console.error(`Erro ao ler o arquivo ${source}: ${err}`);
      return;
    }

    const destPath = path.join(destination, path.basename(source));

    fs.writeFile(destPath, data, 'utf8', (err) => {
      if (err) {
        console.error(`Erro ao escrever no arquivo ${destPath}: ${err}`);
        return;
      }
      console.log(`Arquivo copiado com sucesso para ${destPath}`);
    });
  });
}


const component = process.argv[3];

if (!component) {
  console.error('Informe o nome do componente');
  process.exit(1);
}

const sourceFile = path.resolve(__dirname, '..', 'native-nog-ui', 'components', 'ui', `${component}.tsx`);
const destination = path.resolve(process.cwd(), 'src', 'components', 'ui');

fs.access(sourceFile, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`O arquivo ${sourceFile} não existe.`);
    process.exit(1);
  }

  fs.access(destination, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(destination, { recursive: true }, (err) => {
        if (err) throw err;
        console.log(`Diretório ${destination} criado.`);
        copyFile(sourceFile, destination);
      });
    } else {
      copyFile(sourceFile, destination);
    }
  });
});