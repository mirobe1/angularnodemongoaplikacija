import { Component } from '@angular/core';
import { Recipe } from './models/Recipe';
import { HttpServiceService } from './services/http-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  title = 'angularproject';
}
