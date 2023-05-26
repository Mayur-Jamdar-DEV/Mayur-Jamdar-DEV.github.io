import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  seatArrangement: number[][] = [];
  selectedSeats: number[] = [];
  seatLimit = 7;
  numSeatsToBook = 0;
  disableButton: boolean = false;

  constructor() {
    const seatsPerRow = 7;
    const totalSeats = 80;
    let row = 1;
    let seatNumber = 1;

    for (let i = 0; i < totalSeats; i++) {
      if (i % seatsPerRow === 0) {
        this.seatArrangement.push([]);
        row++;
      }

      this.seatArrangement[row - 2].push(seatNumber++);
    }
  }

  bookSeats() {
    if (this.numSeatsToBook > 0 && this.numSeatsToBook <= this.seatLimit) {
      let seatsBooked = 0;
      let availableSeats: number[] = [];

      // Collect all available seats in a flat array
      for (let i = 0; i < this.seatArrangement.length; i++) {
        for (let j = 0; j < this.seatArrangement[i].length; j++) {
          if (this.seatArrangement[i][j] !== 0) {
            availableSeats.push(this.seatArrangement[i][j]);
          }
        }
      }

      // Check if the number of seats to book can be accommodated in one row
      if (this.numSeatsToBook <= availableSeats.length) {
        // Find a row with enough available seats
        for (let i = 0; i < this.seatArrangement.length; i++) {
          const rowSeats = this.seatArrangement[i].filter(seat => availableSeats.includes(seat));
          if (rowSeats.length >= this.numSeatsToBook) {
            this.selectedSeats = rowSeats.slice(0, this.numSeatsToBook);
            seatsBooked = this.numSeatsToBook;
            break;
          }
        }
      }

      // If seats couldn't be booked in one row, book remaining seats randomly
      while (seatsBooked < this.numSeatsToBook && availableSeats.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSeats.length);
        const seatNumber = availableSeats[randomIndex];

        // Remove the selected seat from the available seats
        availableSeats.splice(randomIndex, 1);

        this.selectedSeats.push(seatNumber);
        seatsBooked++;
      }

      // Update the seatArrangement by marking booked seats as 0
      for (let i = 0; i < this.seatArrangement.length; i++) {
        for (let j = 0; j < this.seatArrangement[i].length; j++) {
          if (this.selectedSeats.includes(this.seatArrangement[i][j])) {
            this.seatArrangement[i][j] = 0;
          }
        }
      }
    }
  }

  isSeatAvailable(row: number, column: number): boolean {
    return this.seatArrangement[row][column] !== 0;
  }

  isSeatBooked(row: number, column: number): boolean {
    return this.seatArrangement[row][column] === 0;
  }

  getSeatNumber(row: number, column: number): number {
    return this.seatArrangement[row][column];
  }
}
