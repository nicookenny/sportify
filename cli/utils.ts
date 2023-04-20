import fs, { existsSync, readdirSync, statSync } from 'fs';
// Define la función camelCaseToSnakeCase
export function camelCaseToFileName(str: string) {
  // Reemplaza los caracteres que no sean letras o números por guiones bajos
  str = str.replace(/[^a-z0-9]/gi, '-');

  // Reemplaza las letras mayúsculas por letras minúsculas precedidas de un guión bajo
  str = str.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase());

  // Elimina los guiones bajos iniciales y finales
  str = str.replace(/^-|-$/g, '');

  return str;
}

//delay function to wait for a while on milliseconds
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function readDir(path: string): string[] {
  // Creamos un arreglo donde almacenaremos todos los directorios
  const directorios: string[] = [];
  readdirSync(path).forEach((file) => {
    // Obtenemos información sobre cada elemento utilizando el método fs.stat()
    const stat = statSync(`${path}/${file}`);

    // Si el elemento es un directorio, lo agregamos al arreglo directorios
    if (stat.isDirectory()) {
      directorios.push(file);
    }
  });

  // Mostramos todos los directorios encontrados
  return directorios;
}

//validate if a file exists
export function fileExists(filePath: string): boolean {
  try {
    return existsSync(filePath);
  } catch (err) {
    console.error(err);
    return false;
  }
}

//create a function to add value to a string at a specific index using slice
export function insertAt(str: string, index: number, value: string) {
  if (str[index - 1] === ',') index = index - 1;
  return str.slice(0, index) + value + str.slice(index) + ';';
}

export function parseIndexFile(indexFile: string, keySearch: string) {
  const lines = indexFile.replace(/(\r\n|\n|\r)/gm, '').split(';');
  const imports = lines.filter((line) => line.trim().includes('import'));
  const exports = lines.filter((line) => line.trim().includes('export'));
  const commands = lines.filter((line) => line.trim().includes(keySearch));

  return { imports, exports, commands };
}

export function buildIndexFile(
  indexFile: string,
  identifierName: string,
  identifierKind: string,
) {
  const { imports, exports, commands } = parseIndexFile(
    indexFile,
    identifierKind,
  );

  //si no hay comandos, crea el primer comando
  if (!commands[0]) {
    return `import { ${identifierName}Handler } from './${camelCaseToFileName(
      `${identifierName}`,
    )}.handler.js';
    export const ${identifierKind} = [${identifierName}Handler];`;
  }

  imports.push(
    `import { ${identifierName}Handler } from './${camelCaseToFileName(
      `${identifierName}`,
    )}.handler.js';`,
  );
  //find index of character of string
  const finaleHandler = commands[0].indexOf(']');
  const handlers = insertAt(
    commands[0],
    finaleHandler,
    `, ${identifierName}Handler`,
  );

  return imports.join(';\n') + '\n' + '\r' + handlers;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
