export class AICommand {
  constructor(
    public readonly intent: string,
    public readonly confidence: number,
    public readonly payload: any,
    public readonly rawInput: string,
  ) {}
}
