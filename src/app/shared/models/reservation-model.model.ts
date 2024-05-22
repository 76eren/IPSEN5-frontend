import {Time} from "@angular/common";
import {locationsModel} from "./locations.model";

export class ReservationModelModel {
    id: string;
    location: locationsModel;
    wing: string;
    floor: number;
    room: string;
    type: string;
    startDateTime: Date;

    constructor(id: string, location: locationsModel, wing: string, floor: number, room: string,
                type: string, dateAndStartTime: Date) {
        this.id = id;
        this.location = location;
        this.wing = wing;
        this.floor = floor;
        this.room = room;
        this.type = type;
        this.startDateTime = dateAndStartTime;
    }

}
