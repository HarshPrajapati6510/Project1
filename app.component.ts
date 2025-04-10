import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {MatTableModule} from '@angular/material/table';
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
  imports: [RouterOutlet,MatTableModule,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements AfterViewInit{
  title = 'angular_firebase';
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  @ViewChild('startEl') startEl!: ElementRef;
  @ViewChild('endEl') endEl!: ElementRef;
  line:any;
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
  loginWithGoogle(){
    const auth = getAuth();
signInWithPopup(auth, new GoogleAuthProvider)
  .then((result) => {
    console.log('result=======>',result);
    
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log('credential=======>',credential);
    const token = credential?.accessToken;
    console.log('token=======>',token);
    // The signed-in user info.
    const user = result.user;
    console.log('user=======>',user);
    
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }

  addTrip(){
    if (this.startPoint&&this.endPoint) {
      let tripData:any={
        start:this.startPoint,
        end:this.endPoint
      }
      if (this.tripList.length>0) {
        tripData={...tripData,...this.checkTripCondition(tripData)};
      }
      this.tripList.push(tripData)
      this.addDynamicLine()
      this.startPoint=''
      this.endPoint=''
      console.log('trip list===>',this.tripList);
      
    }
  }

  checkTripCondition(tripData:any){
    let tempData={}
    const lastTripIndex= this.tripList.length-1;
    console.log('tripData',tripData);
    console.log('tripList',this.tripList[lastTripIndex]);
    if (this.startPoint==this.tripList[lastTripIndex].end) {
      tempData={leval:1,color:'yellow',path:'straight', endPlug: 'disc'}
      console.log('asdfdasfasdfsda',tempData);
    }else if(!(this.startPoint==this.tripList[lastTripIndex].end)){
      tempData={leval:1,color:'yellow',path:'straight', endPlug: 'arrow'}
    }else if(this.startPoint==this.tripList[lastTripIndex].start && this.endPoint==this.tripList[lastTripIndex].end){
      tempData={leval:2,color:'yellow',path:'fluid', endPlug: 'behind'}
    }
    return tempData
  }

  addDynamicLine(){
    if (this.tripList.length>1) {
      const currentIndex=this.tripList.length-1
      const start = document.getElementById(`tripPoint${currentIndex-1}`);
      const end = document.getElementById(`tripPoint${currentIndex}`);
        this.line = new LeaderLine(
          start,end,
          {
            color: this.tripList[currentIndex].color,
            endPlug: this.tripList[currentIndex].endPlug,
            path: this.tripList[currentIndex].path
          }
        );
      
    }
  }


}
