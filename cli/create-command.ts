import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { buildIndexFile, camelCaseToFileName, fileExists } from './utils';

//get current directory
const currentDir = process.cwd();

export function createCommand(commandName: string, module: string): void {
  const indexExists = fileExists(
    `${currentDir}/src/business/${module}/commands/handlers/index.ts`,
  );
  if (!indexExists) {
    writeFileSync(
      `${currentDir}/src/business/${module}/commands/handlers/index.ts`,
      '',
    );
    console.log('here');
  }
  const indexFile = readFileSync(
    `${currentDir}/src/business/${module}/commands/handlers/index.ts`,
    'utf8',
  );

  // Crea el contenido del archivo de comando
  const commandContent = `export class ${commandName}Command {
  constructor(public readonly data: any) {}
}
`;

  // Crea el contenido del archivo de manejador de comandos
  const handlerContent = `import {
    CommandHandler,
    EventPublisher,
    ICommandHandler,
    EventBus,
  } from '@nestjs/cqrs';
  import { Logger } from '@nestjs/common';
  import { Validate } from '../../../../shared/Validate.js';
  import { Result } from '../../../../shared/Result.js';
import { ${commandName}Command } from '../impl/${camelCaseToFileName(
    commandName,
  )}.command.js';
@CommandHandler(${commandName}Command)
export class ${commandName}Handler implements ICommandHandler<${commandName}Command>{
    constructor(
        private readonly publisher: EventPublisher,
        private readonly logger: Logger,
        private readonly eventBus: EventBus,
      ) {}
  async execute(command: ${commandName}Command): Promise<Result<any>>  {
    // Aquí va el código para manejar el comando
    const validate = this.validate(command);
    if (validate.isFailure) {
      this.logger.error('${commandName}Handler', validate.error);
      return validate;
    }
    // Publica un evento después de manejar el comando
    this.publisher.mergeObjectContext(object).publish(new MyEvent());
  }
  validate(command: ${commandName}Command) {
    // Aquí va el código para validar el comando
    const validation = Validate.isRequiredBulk([]);
    if (!validation.success) {
      return Result.fail<string>(validation.message);
    }
    return Result.ok();
  }
}
`;

  // Crea el directorio de resultados si no existe
  if (!existsSync(`${currentDir}/cli/result`)) {
    mkdirSync(`${currentDir}/cli/result`);
  }
  // Escribe el archivo de comando
  writeFileSync(
    `${currentDir}/src/business/${module}/commands/impl/${camelCaseToFileName(
      commandName,
    )}.command.ts`,
    commandContent,
  );

  // Escribe el archivo de manejador de comandos
  writeFileSync(
    `${currentDir}/src/business/${module}/commands/handlers/${camelCaseToFileName(
      commandName,
    )}.handler.ts`,
    handlerContent,
  );
  writeFileSync(
    `${currentDir}/src/business/${module}/commands/handlers/index.ts`,
    buildIndexFile(indexFile, commandName, 'CommandHandlers'),
  );
  console.log(
    `Se ha creado el comando y manejador de comandos "${commandName}"`,
  );
}
