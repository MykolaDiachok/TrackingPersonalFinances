import { Injectable } from '@angular/core';
import { UploadDataService } from './upload-data.service';
import { AppUser } from '../models/app-user';
import { TransactionType } from '../models/transaction-type';
import { TransactionCategory } from '../models/transaction-category';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly APP_USERS_KEY = 'appUsers';
  private readonly TRANSACTION_TYPES_KEY = 'transactionTypes';
  private readonly TRANSACTION_CATEGORIES_KEY = 'transactionCategories';
  private readonly TRANSACTIONS_KEY = 'transactions';

  constructor(private uploadDataService: UploadDataService) {}

  getUsers(): AppUser[] {
    return this.getFromLocalStorage<AppUser[]>(this.APP_USERS_KEY) || [];
  }

  saveUsers(users: AppUser[]): void {
    this.saveToLocalStorage(this.APP_USERS_KEY, users);
  }

  getTransactionTypes(): TransactionType[] {
    return this.getFromLocalStorage<TransactionType[]>(this.TRANSACTION_TYPES_KEY) || [];
  }

  saveTransactionTypes(types: TransactionType[]): void {
    this.saveToLocalStorage(this.TRANSACTION_TYPES_KEY, types);
  }

  getTransactionCategories(): TransactionCategory[] {
    return this.getFromLocalStorage<TransactionCategory[]>(this.TRANSACTION_CATEGORIES_KEY) || [];
  }

  saveTransactionCategories(categories: TransactionCategory[]): void {
    this.saveToLocalStorage(this.TRANSACTION_CATEGORIES_KEY, categories);
  }

  getTransactions(): Transaction[] {
    return this.getFromLocalStorage<Transaction[]>(this.TRANSACTIONS_KEY) || [];
  }

  saveTransactions(transactions: Transaction[]): void {
    this.saveToLocalStorage(this.TRANSACTIONS_KEY, transactions);
  }

  saveToLocalStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
