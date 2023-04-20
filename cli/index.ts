import * as prompts from 'prompts';
import { createCommand } from './create-command';
import { createEvent } from './create-event';
import { createSaga } from './create-saga';
import { createModule } from './create-module';
import { readDir } from './utils';
const currentDir = process.cwd();

async function main() {
  const response = await prompts([
    {
      type: 'select',
      name: 'type',
      message: 'Que archivos quieres crear?',
      choices: [
        { title: 'Command', value: 'Command' },
        { title: 'Event', value: 'Event' },
        { title: 'Saga', value: 'Saga' },
        { title: 'Module', value: 'Module' },
      ],
    },
    {
      type: 'text',
      name: 'nameFile',
      message: `Dime el nombre del archivo/modulo?`,
    },
  ]);
  const directorios = readDir(`${currentDir}/src/business`);
  let direRes;
  switch (response.type) {
    case 'Command':
      direRes = await wichModule(directorios);
      createCommand(response.nameFile, direRes.type);
      break;
    case 'Event':
      direRes = await wichModule(directorios);
      createEvent(response.nameFile, direRes.type);
      break;
    case 'Saga':
      createSaga(response.nameFile);
      break;
    case 'Module':
      createModule(response.nameFile);
    default:
      console.log('Nop!');
  }
}

main().then((data) => {
  console.log(data);
});

async function wichModule(dirs: string[]) {
  const options = dirs.map((dir) => {
    return { title: dir, value: dir };
  });
  const moduleRess = await prompts([
    {
      type: 'select',
      name: 'type',
      message: 'En donde quieres?',
      choices: [...options],
    },
  ]);
  return moduleRess;
}
