import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() thingsFromHomeComponent: any;
  @Input() thingFromHomeComponent: any;
  isInput: boolean = false;
  message: string = "";
  inputString: string = "";
  isAddFolder: boolean = false;
  isAddFile: boolean = false;
  badChars: string[] = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];
  temp: boolean = false;

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
    if (this.inputString.trim() == "") {
      return window.alert("please enter a text!")
    }
    for (let badChar of this.badChars) {
      if (this.inputString.includes(badChar)) {
        return window.alert('can\'t use < > : " / \\ | ? * chars in names');
      }
    }
    if (this.isAddFolder) {
      for (let thing of this.thingsFromHomeComponent) {
        if (this.inputString == thing.name) {
          return window.alert('name already taken')
        }
      }
      this.http.get(`https://localhost:7089/api/things/add-folder?name=${this.inputString}&parentName=${this.thingFromHomeComponent.name}`).subscribe(response => {
        window.location.reload()
      }, error => {
        console.log(error)
      })
    } else if (this.isAddFile) {
      for (let thing of this.thingsFromHomeComponent) {
        if (this.inputString == thing.name) {
          return window.alert('name already taken')
        }
      }
      this.http.get(`https://localhost:7089/api/things/add-file?name=${this.inputString}&parentName=${this.thingFromHomeComponent.name}`).subscribe(response => {
        window.location.reload()
      }, error => {
        console.log(error)
      })
    } else if (this.isInput) {
      if (this.message == "Enter a folder name to move to:") {
        if (this.inputString == this.thingFromHomeComponent.name) {
          return window.alert('can\'t move to itself')
        }
        if (this.inputString == this.thingFromHomeComponent.parentName) {
          return window.alert('already in this folder')
        }
        for (let thing of this.thingsFromHomeComponent) {
          if (this.inputString == thing.name && thing.isFolder == true) {
            this.temp = true;
          }
        }
        if (!this.temp) {
          return window.alert('folder with this name does not exist')
        }
        this.http.get(`https://localhost:7089/api/things/move/${this.thingFromHomeComponent.id}?name=${this.inputString}`).subscribe(response => {
          window.location.reload()
        }, error => {
          console.log(error)
        })
      } else {
        for (let thing of this.thingsFromHomeComponent) {
          if (this.inputString == thing.name) {
            return window.alert('name already taken')
          }
        }
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
