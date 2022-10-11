import {Component} from "@angular/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  rolled: boolean = true;

  changeRoll() {
    this.rolled = !this.rolled;
  }
}
