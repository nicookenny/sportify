import { exec } from 'child_process';
import * as fs from 'fs';

//get current directory
const currentDir = process.cwd();

//function to create module using nest cli
export const createModule = (moduleName: string) => {
  const arrayFolders = ['commands', 'events', 'queries', 'sagas', 'aggregates'];

  exec(`nest g module business/${moduleName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    arrayFolders.forEach((folder) => {
      createFolder(folder, moduleName);
    });
  });
};
//function to create directory using fs mod
const createFolder = (folderName: string, moduleName) => {
  fs.mkdirSync(`${currentDir}/src/business/${moduleName}/${folderName}`);
};
