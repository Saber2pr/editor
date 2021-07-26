import './style.css';
import React from '@saber2pr/tsx';
export interface Aside {
    onResize: (event: MouseEvent) => string;
    onDownload(): void;
    onRun(): void;
    sandboxRef: React.RefObj<HTMLIFrameElement>;
    ref: React.RefObj<HTMLDivElement>;
}
export declare const Aside: ({ ref, sandboxRef, onResize, onDownload, onRun, }: Aside) => JSX.Element;
