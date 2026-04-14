"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AICommand = void 0;
class AICommand {
    intent;
    confidence;
    payload;
    rawInput;
    constructor(intent, confidence, payload, rawInput) {
        this.intent = intent;
        this.confidence = confidence;
        this.payload = payload;
        this.rawInput = rawInput;
    }
}
exports.AICommand = AICommand;
//# sourceMappingURL=ai-command.entity.js.map