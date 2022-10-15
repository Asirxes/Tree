import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() thingFromHomeComponent: any;
  isInput: boolean = false;
  message: string = "";

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
  }

  Delete(){
    if(this.thingFromHomeComponent.name=="root"){
       return window.alert("can't delete root folder!")
    }
    this.http.get(`https://localhost:7089/api/things/delete/${this.thingFromHomeComponent.id}`).subscribe(response =>{
      console.log(response);
      window.location.reload()
    }, error => {
      console.log(error)
    })
  }
}
