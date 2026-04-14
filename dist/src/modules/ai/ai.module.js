"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const reservation_module_1 = require("../reservation/reservation.module");
const ai_intent_service_1 = require("./application/services/ai-intent.service");
const llm_service_1 = require("./infrastructure/llm/llm.service");
const ai_controller_1 = require("./presentation/controllers/ai.controller");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [reservation_module_1.ReservationModule],
        controllers: [ai_controller_1.AIController],
        providers: [ai_intent_service_1.AIIntentService, llm_service_1.LLMService],
    })
], AiModule);
//# sourceMappingURL=ai.module.js.map