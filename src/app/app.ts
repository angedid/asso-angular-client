import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar, MatToolbarModule} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {GuestToolbarComponent} from './guest-toolbar/guest-toolbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GuestToolbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('asso-angular-client');
}
