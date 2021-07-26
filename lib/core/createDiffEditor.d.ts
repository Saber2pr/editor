export declare const createDiffEditor: (container: HTMLElement, original: string, modified: string) => {
    instance: import("monaco-editor").editor.IStandaloneDiffEditor;
    setSize: (width: number, height: number) => void;
    originalModel: import("monaco-editor").editor.ITextModel;
    modifiedModel: import("monaco-editor").editor.ITextModel;
};
export declare type DiffEditorAPI = ReturnType<typeof createDiffEditor>;
