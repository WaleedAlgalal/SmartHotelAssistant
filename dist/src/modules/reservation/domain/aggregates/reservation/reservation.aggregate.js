"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
const reservation_confirmed_event_1 = require("../../events/reservation-confirmed.event");
const reservation_created_event_1 = require("../../events/reservation-created.event");
const stay_period_value_object_1 = require("../../value-objects/stay-period.value-object");
class Reservation {
    _id;
    _guestId;
    _roomId;
    _stayPeriod;
    _status;
    _createdAt;
    _updatedAt;
    _domainEvents = [];
    constructor(id, guestId, roomId, stayPeriod, status, createdAt, updatedAt) {
        this._id = id;
        this._guestId = guestId;
        this._roomId = roomId;
        this._stayPeriod = stayPeriod;
        this._status = status;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }
    static create(props) {
        if (!props.id || !props.guestId || !props.roomId) {
            throw new Error("Reservation id, guestId, and roomId are required.");
        }
        const stayPeriod = stay_period_value_object_1.StayPeriod.create(props.checkIn, props.checkOut);
        const reservation = new Reservation(props.id, props.guestId, props.roomId, stayPeriod, "PENDING", new Date(), new Date());
        reservation.recordEvent(new reservation_created_event_1.ReservationCreatedEvent(props.id, props.guestId, props.roomId));
        return reservation;
    }
    static rehydrate(props) {
        if (!props.id || !props.guestId || !props.roomId) {
            throw new Error("Reservation id, guestId, and roomId are required.");
        }
        const createdAt = new Date(props.createdAt);
        const updatedAt = new Date(props.updatedAt);
        if (Number.isNaN(createdAt.getTime()) || Number.isNaN(updatedAt.getTime())) {
            throw new Error("Reservation timestamps must be valid.");
        }
        const stayPeriod = stay_period_value_object_1.StayPeriod.create(props.checkIn, props.checkOut);
        return new Reservation(props.id, props.guestId, props.roomId, stayPeriod, props.status, createdAt, updatedAt);
    }
    confirm() {
        if (this._status === "CONFIRMED") {
            throw new Error("Reservation is already confirmed.");
        }
        if (this._status === "CANCELLED") {
            throw new Error("Cancelled reservations cannot be confirmed.");
        }
        this._status = "CONFIRMED";
        this.touch();
        this.recordEvent(new reservation_confirmed_event_1.ReservationConfirmedEvent(this._id));
    }
    cancel() {
        if (this._status === "CONFIRMED") {
            throw new Error("Confirmed reservations cannot be cancelled.");
        }
        if (this._status === "CANCELLED") {
            throw new Error("Reservation is already cancelled.");
        }
        this._status = "CANCELLED";
        this.touch();
    }
    extendStay(newCheckOut) {
        if (this._status === "CANCELLED") {
            throw new Error("Cancelled reservations cannot be extended.");
        }
        this._stayPeriod = this._stayPeriod.extendTo(newCheckOut);
        this.touch();
    }
    pullDomainEvents() {
        const events = [...this._domainEvents];
        this._domainEvents.length = 0;
        return events;
    }
    get id() {
        return this._id;
    }
    get guestId() {
        return this._guestId;
    }
    get roomId() {
        return this._roomId;
    }
    get stayPeriod() {
        return this._stayPeriod;
    }
    get status() {
        return this._status;
    }
    get createdAt() {
        return new Date(this._createdAt.getTime());
    }
    get updatedAt() {
        return new Date(this._updatedAt.getTime());
    }
    recordEvent(event) {
        this._domainEvents.push(event);
    }
    touch() {
        this._updatedAt = new Date();
    }
}
exports.Reservation = Reservation;
//# sourceMappingURL=reservation.aggregate.js.map