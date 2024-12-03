import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, shareReplay } from 'rxjs';
import { AppUser } from '../models/app-user';
import { AppData } from '../models/app-data';
import { TransactionType } from '../models/transaction-type';
import { TransactionCategory } from '../models/transaction-category';
import { Transaction } from '../models/transaction';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadDataService {
  private dataUrl = environment.dataUrl;
  private appDataCache$?: Observable<AppData>;

  constructor(private http: HttpClient) {}

  getAppData(): Observable<AppData> {
    if (!this.appDataCache$) {
      console.log('url', this.dataUrl);
      this.appDataCache$ = this.http.get<AppData>(this.dataUrl).pipe(shareReplay(1));
    }
    return this.appDataCache$;
  }

  getAppUsers(): Observable<AppUser[]> {
    return this.getAppData().pipe(map((data) => data.users));
  }

  getTransactionTypes(): Observable<TransactionType[]> {
    return this.getAppData().pipe(map((data) => data.types));
  }

  getTransactionCategories(): Observable<TransactionCategory[]> {
    return this.getAppData().pipe(map((data) => data.categories));
  }

  getTransactions(): Observable<Transaction[]> {
    return this.getAppData().pipe(map((data) => data.transactions));
  }
}
