import {Component, Input, OnInit, Output} from '@angular/core';
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
  inputString: string = "";
  isAddFolder: boolean = false;
  isAddFile: boolean = false;

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
  }

  addFolder() {
    this.message = "Enter new folder name: "
    this.isAddFolder = true;
  }

  addFile() {
    this.message = "Enter new file name: "
    this.isAddFile = true;
  }

  edit() {
    this.message = "Enter new name: "
    this.isInput = true;
  }

  sort() {

  }

  move() {
    this.message = "Enter a folder name to move to:"
    this.isInput = true;
  }

  delete() {
    this.http.get(`https://localhost:7089/api/things/delete/${this.thingFromHomeComponent.id}`).subscribe(response => {
      window.location.reload()
    }, error => {
      console.log(error)
    })
  }

  input() {
    if (this.isAddFolder) {
      this.http.get(`https://localhost:7089/api/things/add-folder?name=${this.inputString}&parentName=${this.thingFromHomeComponent.name}`).subscribe(response => {
        window.location.reload()
      }, error => {
        console.log(error)
      })
    }else if(this.isAddFile){
      this.http.get(`https://localhost:7089/api/things/add-file?name=${this.inputString}&parentName=${this.thingFromHomeComponent.name}`).subscribe(response => {
        window.location.reload()
      }, error => {
        console.log(error)
      })
    }else if(this.isInput){
      if(this.message == "Enter a folder name to move to:"){
        this.http.get(`https://localhost:7089/api/things/move/${this.thingFromHomeComponent.id}?name=${this.inputString}`).subscribe(response => {
          window.location.reload()
        }, error => {
          console.log(error)
        })
      }else{
        this.http.get(`https://localhost:7089/api/things/rename/${this.thingFromHomeComponent.id}?name=${this.inputString}`).subscribe(response => {
          window.location.reload()
        }, error => {
          console.log(error)
        })
      }
    }
  }

  cancel() {
    this.inputString = ""
    this.isInput = false;
    this.isAddFile = false;
    this.isAddFolder = false;
  }
}
