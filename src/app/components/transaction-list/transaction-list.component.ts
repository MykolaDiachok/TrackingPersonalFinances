import { Component, OnInit } from '@angular/core';
import { DataStore } from '../../stores/data-store.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AppUser } from '../../models/app-user';

@Component({
  selector: 'app-transaction-list',
  imports: [AsyncPipe, JsonPipe],
  templateUrl: './transaction-list.component.html',
  standalone: true,
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit {
  appUsers$: Observable<AppUser[]> | undefined;

  constructor(private dataStore: DataStore) {}

  ngOnInit(): void {
    this.appUsers$ = this.dataStore.selectAppUsers$;
  }
}
