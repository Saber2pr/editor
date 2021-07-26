interface Defaults {
    javascript: string;
    typescript: string;
    css: string;
    html: string;
    json: string;
}
export declare const loadSamples: () => Promise<Defaults>;
export declare const settings: {
    script: string;
};
export declare const loadScript: () => Promise<string>;
export {};
