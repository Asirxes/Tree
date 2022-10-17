import {Component, OnInit} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'tree'
  things: any
  toShow: string[] = ['root'];
  notShow: string[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('https://localhost:7089/api/things/add-root-folder').subscribe(()=>{
    },error =>{
    })
    if (localStorage.getItem('Data') != null) {
      this.getStatus()
    } else {
      this.http.get('https://localhost:7089/api/things').subscribe(response => {
        // @ts-ignore
        for (let thing of response) {
          if (thing.name != 'root') {
            this.notShow.push(thing.name);
          }
        }
        this.things = response;
        this.saveState();
      }, error => {
        console.log(error)
      })
    }
  }

  openClose(event: string) {
    for (let thing of this.things) {
      if (thing.name == event) {
        for (let child of thing.childrens) {
          if (this.toShow.indexOf(child) == -1) {
            this.toShow.push(child)
            this.notShow.splice(this.notShow.indexOf(child), 1)
          } else {
            this.closeChilds(child)
          }
        }
      }
    }
    this.saveState();
  }

  closeChilds(name: string) {
    for (let thing of this.things) {
      if (thing.name == name) {
        if (thing.isFolder == false || thing.childrens == 0) {
          this.notShow.push(thing.name)
          this.toShow.splice(this.toShow.indexOf(thing.name), 1)
        } else {
          for (let child of thing.childrens) {
            if (this.notShow.indexOf(child) == -1) {
              this.closeChilds(child)
            }
          }
          this.notShow.push(name)
          this.toShow.splice(this.toShow.indexOf(name), 1)
        }
      }
    }
    this.saveState();
  }

  expand() {
    for (let item of this.notShow) {
      this.toShow.push(item)
    }
    this.notShow = [];
    this.saveState();
  }

  test() {
    console.log(this.toShow)
    console.log(this.notShow)
    console.log(this.things)
  }

  refresh() {
    this.http.get('https://localhost:7089/api/things').subscribe(response => {
      // @ts-ignore
      for (let thing of response) {
        if (!this.toShow.includes(thing.name) && !this.toShow.includes(thing.name)) {
          this.toShow.push(thing.name);
        }
      }
      this.things = response;
      this.saveState();
    }, error => {
      console.log(error)
    })

  }

  saveState() {
    localStorage.setItem('Data', JSON.stringify(this.things))
    localStorage.setItem('toShow', JSON.stringify(this.toShow))
    localStorage.setItem('notShow', JSON.stringify(this.notShow))
  }

  getStatus() {
    // @ts-ignore
    this.things = JSON.parse(localStorage.getItem('Data'))
    // @ts-ignore
    this.toShow = JSON.parse(localStorage.getItem('toShow'))
    // @ts-ignore
    this.notShow = JSON.parse(localStorage.getItem('notShow'))
  }
}
