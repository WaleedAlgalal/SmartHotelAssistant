"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StayPeriod = void 0;
class StayPeriod {
    _checkIn;
    _checkOut;
    constructor(checkIn, checkOut) {
        this._checkIn = checkIn;
        this._checkOut = checkOut;
    }
    static create(checkInInput, checkOutInput) {
        const checkIn = new Date(checkInInput);
        const checkOut = new Date(checkOutInput);
        if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
            throw new Error("StayPeriod dates must be valid.");
        }
        if (checkOut.getTime() <= checkIn.getTime()) {
            throw new Error("Check-out must be after check-in.");
        }
        return new StayPeriod(new Date(checkIn.getTime()), new Date(checkOut.getTime()));
    }
    get checkIn() {
        return new Date(this._checkIn.getTime());
    }
    get checkOut() {
        return new Date(this._checkOut.getTime());
    }
    extendTo(newCheckOutInput) {
        return StayPeriod.create(this._checkIn, newCheckOutInput);
    }
    equals(other) {
        return (this._checkIn.getTime() === other._checkIn.getTime() &&
            this._checkOut.getTime() === other._checkOut.getTime());
    }
}
exports.StayPeriod = StayPeriod;
//# sourceMappingURL=stay-period.value-object.js.map