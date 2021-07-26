import { monaco } from './monaco';
declare const typescriptDefaults: import("monaco-editor").languages.typescript.LanguageServiceDefaults;
export declare const addExtraLib: (content: string, filePath?: string) => import("monaco-editor").IDisposable;
export declare const compileTS: (uri: InstanceType<typeof monaco.Uri>) => Promise<string>;
export declare const updateCompilerOptions: (options: Parameters<typeof typescriptDefaults.setCompilerOptions>[0]) => void;
export declare const createTSXModel: (content: string) => import("monaco-editor").editor.ITextModel;
export declare const addModuleDeclaration: (url: string, moduleName?: string) => Promise<any>;
export {};
