export declare const readFile: (file: File) => Promise<FileInfo>;
export declare type FileInfo = {
    name: string;
    type: string;
    content: string;
};
