export class Reservation{
  id: string;
  user: string;
  location: string;
  status: string;
  startDateTime: Date;
  endDateTime: Date;
  numberOfPeople: number;
  createdAt: Date;

  constructor(id: string, user: string, location: string, status: string,
              startDateTime: Date, endDateTime: Date, numberOfPeople: number,
              createdAt: Date){
    this.id = id;
    this.user = user;
    this.location = location;
    this.status = status;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    this.numberOfPeople = numberOfPeople;
    this.createdAt = createdAt;
  }

}
