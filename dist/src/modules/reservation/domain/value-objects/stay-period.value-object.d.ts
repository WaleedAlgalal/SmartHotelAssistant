export declare class StayPeriod {
    private readonly _checkIn;
    private readonly _checkOut;
    private constructor();
    static create(checkInInput: Date | string, checkOutInput: Date | string): StayPeriod;
    get checkIn(): Date;
    get checkOut(): Date;
    extendTo(newCheckOutInput: Date | string): StayPeriod;
    equals(other: StayPeriod): boolean;
}
