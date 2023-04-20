import * as fs from 'fs';
import { camelCaseToFileName } from './utils';

//get current directory
const currentDir = process.cwd();

export function createSaga(sagaName: string): void {
  // Crea el contenido del archivo de manejador de comandos
  const sagaContent = `import { Injectable } from '@nestjs/common';
  import { ICommand, ofType, Saga } from '@nestjs/cqrs';
  import { Observable, of } from 'rxjs';
  import { delay, map } from 'rxjs/operators';
  @Injectable()
export class ${sagaName}Sagas {
  @Saga()
  <method> = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(<event>),
      delay(1000),
      map((event) => {
        console.log(
          'Inside [<saga>] Saga', JSON.stringify(event),
        );
        return new <Command>({ ...event.event });
      })
    );
  };
}
`;

  // Crea el directorio de resultados si no existe
  if (!fs.existsSync(`${currentDir}/cli/result`)) {
    fs.mkdirSync(`${currentDir}/cli/result`);
  }
  // Escribe el archivo de manejador de comandos
  fs.writeFileSync(
    `${currentDir}/cli/result/${camelCaseToFileName(sagaName)}.saga.ts`,
    sagaContent,
  );

  console.log(`Se ha creado el comando y manejador de comandos "${sagaName}"`);
}
