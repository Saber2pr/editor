interface DefaultValues {
    [type: string]: string;
}
export declare function createEditor(editorContainer: HTMLElement, defaultValues: DefaultValues): {
    setValue: (type: string, value?: string) => void;
    getValue: (type?: string) => string;
    getInstance: () => import("monaco-editor").editor.IStandaloneCodeEditor;
    changeModel: (type: string) => void;
    getData: () => {
        [k: string]: {
            state: any;
            model: import("monaco-editor").editor.ITextModel;
        };
    };
    setSize: (width: number, height: number) => void;
    getSize: () => import("monaco-editor").editor.EditorLayoutInfo;
    getModel: (type?: string) => import("monaco-editor").editor.ITextModel;
    getState: (type: string) => any;
    setState: (type: string, state: any) => void;
};
export declare type EditorAPI = ReturnType<typeof createEditor>;
export {};
