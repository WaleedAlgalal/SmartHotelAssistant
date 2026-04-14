export declare class AICommand {
    readonly intent: string;
    readonly confidence: number;
    readonly payload: any;
    readonly rawInput: string;
    constructor(intent: string, confidence: number, payload: any, rawInput: string);
}
