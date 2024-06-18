import {Wing} from "./wing.model";

export enum LocationType {
  WORKPLACE = "WORKPLACE",
  ROOM = "ROOM"
}

export const locationTypeTranslations = {
  [LocationType.WORKPLACE]: 'Flexplek',
  [LocationType.ROOM]: 'Vergaderruimte'
};

export class Location {
  private _id: string;
  private _wing: Wing;
  private _name: string;
  private _type: LocationType;
  private _capacity: number;
  private _multireservable: boolean;
  private _createdAt: Date;
  private _isEdit: boolean = false;

  constructor(id: string, wing: Wing, name: string, type: LocationType, capacity: number, multireservable: boolean, createdAt: Date) {
    this._id = id;
    this._wing = wing;
    this._name = name;
    this._type = type;
    this._capacity = capacity;
    this._multireservable = multireservable;
    this._createdAt = createdAt;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get wing(): Wing {
    return this._wing;
  }

  set wing(value: Wing) {
    this._wing = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get type(): LocationType {
    return this._type;
  }

  set type(value: LocationType) {
    this._type = value;
  }

  get capacity(): number {
    return this._capacity;
  }

  set capacity(value: number) {
    this._capacity = value;
  }

  get multireservable(): boolean {
    return this._multireservable;
  }

  set multireservable(value: boolean) {
    this._multireservable = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get isEdit(): boolean {
    return this._isEdit;
  }

  set isEdit(value: boolean) {
    this._isEdit = value;
  }
}
