import { isNil } from 'lodash'
import { removeNameExtension } from 'utils/files'

export const API_URL = process.env.API_URL
export const WS_URL = process.env.WS_URL
export const SIGNAL_API_URL = process.env.SIGNAL_API_URL
export const SHAREDB_URL = process.env.SHAREDB_URL

interface IEnvironmentKeyFields {
  extension: string
  validFileRegex: RegExp
  name: string
  id: ENVIRONMENT_KEYS
  monacoId: string
  providerId: string
  pathPrefix: string
  execCmd: ((...args: any[]) => string)
  defaultFolderName: ((count?: number) => string)
  defaultFileName: ((count?: number) => string)
  defaultFileContents: ((...args: any[]) => string)
}

export type ENVIRONMENT_KEYS = 'java_default_free' | 'python_2_7_free'

export const validFolderRegex = /^[a-zA-Zа-яА-Я0-9_!]+$/
export const environmentKeyConfig: {
  [key: string]: IEnvironmentKeyFields
} = {
  java_default_free: {
    name: 'java', // public name
    id: 'java_default_free', // wsenv environmentKey, also maps to field name
    monacoId: 'java',
    providerId: 'java',
    extension: '.java',
    validFileRegex: /^[-_A-Za-z0-9]+\.java$/,
    pathPrefix: 'src/main/java/exlcode/',
    execCmd: (filePath: string) => {
      const formattedName = filePath
        .split('.')
        .slice(0, -1)
        .join('.')
        .replace('/', '.')
      return `javac /workspace/src/main/java/exlcode/*.java && java -cp /workspace/src/main/java exlcode.${formattedName}\r`
    },
    defaultFileName: (count?: number) =>
      !isNil(count) ? `NewFile${count}.java` : 'Main.java',
    defaultFolderName: (count?: number) =>
      !isNil(count) ? `NewFolder${count}` : 'NewFolder',
    defaultFileContents: (newName: string) =>
      `/**\n* This is the package name. \n* By default, projects in EXLcode have the \n* package name, exlcode.\n*/\npackage exlcode;\n\n/**\n* This is our class definition. \n* The name of the file must be identical \n* to the name of the class in Java\n*/\npublic class ${removeNameExtension(
        newName
      )}{\n    \n    /**\n    * This is our \"main method\".\n    * Click the run button above to execute \n    * this file starting here.\n    */\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}`
  },
  python_2_7_free: {
    name: 'python 2.7',
    id: 'python_2_7_free',
    monacoId: 'python',
    providerId: 'python_2_7',
    extension: '.py',
    validFileRegex: /^[_a-z0-9]\.py$/,
    pathPrefix: '',
    execCmd: (filePath: string) => `python /workspace/${filePath}\n`,
    defaultFileName: (count?: number) =>
      !isNil(count) ? `new_file_${count}.py` : 'new_file.py',
    defaultFolderName: (count?: number) =>
      !isNil(count) ? `newfolder${count}` : 'newfolder',
    defaultFileContents: (newName: string) =>
      '# Hello Python 2.7!\nprint("Hello World!")'
  }
}
