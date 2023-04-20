import * as fs from 'fs';
import {
  buildIndexFile,
  camelCaseToFileName,
  fileExists,
  capitalize,
} from './utils';

//get current directory
const currentDir = process.cwd();

export function createRepository(repoName: string, module: string): void {
  const indexExists = fileExists(
    `${currentDir}/src/business/${module}/repositories/index.ts`,
  );
  if (!indexExists) {
    fs.writeFileSync(
      `${currentDir}/src/business/${module}/repositories/index.ts`,
      '',
    );
  }

  const indexFile = fs.readFileSync(
    `${currentDir}/src/business/${module}/repositories/index.ts`,
    'utf8',
  );
  // Crea el contenido del archivo de comando
  const repoContent = `export class ${repoName}Repository implements IRepository<${capitalize(
    module,
  )}> {
        get(props: any): Promise<Result<${capitalize(module)}>> {
            throw new Error('Method not implemented.');
        }
        getById(id: string): Promise<Result<${capitalize(module)}>> {
            throw new Error('Method not implemented.');
        }
        save(props: ${capitalize(module)}): Promise<Result<void>> {
            throw new Error('Method not implemented.');
        }
        exist(pro: string, prop?: any): Promise<Result<boolean>> {
            throw new Error('Method not implemented.');
        }
}
`;

  // Escribe el archivo de comando
  fs.writeFileSync(
    `${currentDir}/src/business/${module}/repository/${camelCaseToFileName(
      repoName,
    )}.event.ts`,
    repoContent,
  );

  fs.writeFileSync(
    `${currentDir}/src/business/${module}//index.ts`,
    buildIndexFile(indexFile, repoName, 'Repositories'),
  );

  console.log(`Se ha creado el comando y manejador de comandos "${repoName}"`);
}
