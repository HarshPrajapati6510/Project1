import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import {MatTableModule} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
declare var LeaderLine: any;

const ELEMENT_DATA:any[] = [
  {name: 'Foo', isHeader: true},
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C',isHeader: true},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {name: 'Baz', isHeader: true},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements AfterViewInit{
  title = 'angular_firebase';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  @ViewChild('startEl') startEl!: ElementRef;
  @ViewChild('endEl') endEl!: ElementRef;
  lines: any[] = []; // Array to store multiple lines
  tripList:any[]=[] ;
  startPoint:string=''
  endPoint:string=''

  isHeader(index: number, item: any) {
    return item.isHeader;
  }

  constructor(){}

 ngAfterViewInit(): void {
  // const start = document.getElementById('start');
  // const end = document.getElementById('end');
  //   this.line = new LeaderLine(
  //     LeaderLine.pointAnchor(start,{x:30,y:15}),
  //     LeaderLine.pointAnchor(end,{x:20,y:15}),
  //     {
  //       color: 'red',
  //       endPlug: 'arrow',
  //       path: 'straight'
  //     }
  //   );
  }



  addTrip(){
    if (this.startPoint && this.endPoint) {
      let tripData:any = {
        start: this.startPoint,
        end: this.endPoint
      }

      if (this.tripList.length > 0) {
        tripData = {...tripData, ...this.checkTripCondition(tripData)};
      }

      this.tripList.push(tripData);

      // Only add a line if there are at least 2 points
      if (this.tripList.length > 1) {
        this.addDynamicLine();
      }

      this.startPoint = '';
      this.endPoint = '';
      console.log('trip list===>', this.tripList);
    }
  }

  checkTripCondition(tripData:any){
    let tempData={}
    const lastTripIndex= this.tripList.length-1;
    console.log('tripData',tripData);
    console.log('tripList',this.tripList[lastTripIndex]);
    if (this.startPoint==this.tripList[lastTripIndex].end) {
      tempData={leval:1,color:'red',path:'straight', endPlug: 'disc'}
      console.log('continue====>>1',tempData);
    }
    if(!(this.endPoint==this.tripList[lastTripIndex].start)){
      tempData={leval:1,color:'red',path:'straight', endPlug: 'arrow'}
      console.log('not continued====>>1',tempData);
    }
    if(this.startPoint==this.tripList[lastTripIndex].start && this.endPoint==this.tripList[lastTripIndex].end){
      this.tripList[lastTripIndex].leval=2;
      this.tripList[lastTripIndex].path='fluid';
      this.tripList[lastTripIndex].endPlug='behind';
      tempData={leval:2,color:'red',path:'straight', endPlug: 'behind'}
    }
    return tempData
  }

  addDynamicLine(){
    if (this.tripList.length > 1) {
      const currentIndex = this.tripList.length - 1;
      const prevIndex = currentIndex - 1;

      console.log('Drawing line between trip points:', prevIndex, 'and', currentIndex);

      setTimeout(() => {
        const start = document.getElementById(`tripPoint${prevIndex}`);
        const end = document.getElementById(`tripPoint${currentIndex}`);

        if (!start || !end) {
          console.error('Could not find start or end elements:',
                      `tripPoint${prevIndex}`, `tripPoint${currentIndex}`);
          return;
        }

        console.log('Creating line with:', start, end);

        try {
          // Find circle elements inside the trip point
          const startCircle = start.querySelector('.point-circle');
          const endCircle = end.querySelector('.point-circle');

          if (!startCircle || !endCircle) {
            console.error('Could not find circle elements inside trip points');
            return;
          }

          // Get trip data and styles
          const tripData = this.tripList[currentIndex];
          const lineColor = tripData.color || 'blue';
          const lineEndPlug = tripData.endPlug || 'arrow';
          const linePath = tripData.path || 'straight';

          console.log('Line styles:', lineColor, lineEndPlug, linePath);

          const newLine = new LeaderLine(
            startCircle,
            endCircle,
            {
              color: lineColor,
              endPlug: lineEndPlug,
              path: linePath,
              startSocket: 'right',
              endSocket: 'left',
              size: 2
            }
          );

          // Store the line in the array
          this.lines.push(newLine);

        } catch (error) {
          console.error('Error creating LeaderLine:', error);
        }
      }, 100); // Small delay to ensure DOM elements are rendered
    } else {
      console.log('Not enough trip points to draw a line');
    }
  }

  // Add a method to clear all lines if needed
  clearAllLines() {
    if (this.lines.length > 0) {
      this.lines.forEach(line => {
        if (line) {
          line.remove();
        }
      });
      this.lines = [];
    }
  }

  // Handle component cleanup
  ngOnDestroy() {
    this.clearAllLines();
  }

  // Reset all trips and lines
  resetTrips() {
    this.clearAllLines();
    this.tripList = [];
    this.startPoint = '';
    this.endPoint = '';
  }

}
