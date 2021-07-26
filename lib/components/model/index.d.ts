import './style.css';
declare type ModelAPI = {
    close: Function;
};
export declare const openModel: (message: (api: ModelAPI) => JSX.Element) => {
    close: () => void;
};
export {};
