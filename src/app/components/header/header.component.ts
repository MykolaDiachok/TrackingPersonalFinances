import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from '../../extentions/auto-unsubscribe';
import { DataStore } from '../../stores/data.store';
import { AppUser } from '../../models/app-user';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [
    MatMenu,
    MatToolbar,
    MatMenuTrigger,
    MatButton,
    MatMenuItem,
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule,
    NgForOf,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent extends AutoUnsubscribe implements OnInit {
  constructor(private dataStore: DataStore) {
    super();
  }
  users: AppUser[] = [];
  activeUser?: AppUser;

  ngOnInit(): void {
    this.safeSubscribe(this.dataStore.selectAppUsers$, (users) => {
      this.users = users;
    });
    this.safeSubscribe(this.dataStore.selectActiveUser$, (user) => {
      this.activeUser = user;
    });
  }

  onUserChange(event: MatSelectChange) {
    this.dataStore.setActiveUser(event.value);
  }
}
