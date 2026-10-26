import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbarModule, MatToolbar} from "@angular/material/toolbar";
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-guest-toolbar',
    templateUrl: './guest-toolbar.component.html',
  imports: [
    MatToolbarModule,
    MatIcon,
    MatIconButton,
    MatToolbar,
    MatButton,
    RouterLink
  ],
    styleUrls: ['./guest-toolbar.component.css']
})
export class GuestToolbarComponent {



}
