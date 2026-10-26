import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);

  constructor() {
    console.log("HOME DATA: " + JSON.stringify(this.authService.getAccessToken()));
  }
}
