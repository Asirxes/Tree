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

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('https://localhost:7089/api/things').subscribe(response => {
      this.things = response;
    }, error => {
      console.log(error)
    })
  }
}
