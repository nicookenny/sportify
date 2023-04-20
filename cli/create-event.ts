import * as fs from 'fs';
import {
  buildIndexFile,
  camelCaseToFileName,
  fileExists,
} from './utils';

//get current directory
const currentDir = process.cwd();

export function createEvent(eventName: string, module: string): void {
  const indexExists = fileExists(
    `${currentDir}/src/business/${module}/events/handlers/index.ts`,
  );
  if (!indexExists) {
    fs.writeFileSync(
      `${currentDir}/src/business/${module}/events/handlers/index.ts`,
      '',
    );
  }

  const indexFile = fs.readFileSync(
    `${currentDir}/src/business/${module}/events/handlers/index.ts`,
    'utf8',
  );
  // Crea el contenido del archivo de comando
  const eventContent = `export class ${eventName}Event {
  constructor(public readonly data: any) {}
}
`;

  // Crea el contenido del archivo de manejador de comandos
  const handlerContent = `import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
  import { ${eventName}Event } from '../impl/${camelCaseToFileName(
    eventName,
  )}.event.js';
  import { PlsCommandBus } from '../../../../core/CommandBus.service.js';
  
  @EventsHandler(${eventName}Event)
  export class ${eventName}Handler implements IEventHandler<${eventName}Event> {
    constructor(private readonly commandBus: PlsCommandBus) {}
    
    handle(event: ${eventName}Event) {
      console.log('Async ${eventName}Event...');
      console.log(JSON.stringify(event));
    }
  }
`;

  // Escribe el archivo de comando
  fs.writeFileSync(
    `${currentDir}/src/business/${module}/events/impl/${camelCaseToFileName(
      eventName,
    )}.event.ts`,
    eventContent,
  );

  // Escribe el archivo de manejador de comandos
  fs.writeFileSync(
    `${currentDir}/src/business/${module}/events/handlers/${camelCaseToFileName(
      eventName,
    )}.handler.ts`,
    handlerContent,
  );

  fs.writeFileSync(
    `${currentDir}/src/business/${module}/events/handlers/index.ts`,
    buildIndexFile(indexFile, eventName, 'EventHandlers'),
  );

  console.log(`Se ha creado el comando y manejador de comandos "${eventName}"`);
}
