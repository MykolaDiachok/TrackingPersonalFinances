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

  constructor() {}

  getAppUsers(): AppUser[] {
    return this.getFromLocalStorage<AppUser[]>(this.APP_USERS_KEY) || [];
  }

  saveUsers(users: AppUser[]): void {
    this.saveToLocalStorage(this.APP_USERS_KEY, users);
  }

  hasUsers(): boolean {
    return this.hasKey(this.APP_USERS_KEY);
  }

  getTransactionTypes(): TransactionType[] {
    return this.getFromLocalStorage<TransactionType[]>(this.TRANSACTION_TYPES_KEY) || [];
  }

  saveTransactionTypes(types: TransactionType[]): void {
    this.saveToLocalStorage(this.TRANSACTION_TYPES_KEY, types);
  }

  hasTransactionTypes(): boolean {
    return this.hasKey(this.TRANSACTION_TYPES_KEY);
  }

  getTransactionCategories(): TransactionCategory[] {
    return this.getFromLocalStorage<TransactionCategory[]>(this.TRANSACTION_CATEGORIES_KEY) || [];
  }

  saveTransactionCategories(categories: TransactionCategory[]): void {
    this.saveToLocalStorage(this.TRANSACTION_CATEGORIES_KEY, categories);
  }

  hasTransactionCategories(): boolean {
    return this.hasKey(this.TRANSACTION_CATEGORIES_KEY);
  }

  getTransactions(): Transaction[] {
    return this.getFromLocalStorage<Transaction[]>(this.TRANSACTIONS_KEY) || [];
  }

  saveTransactions(transactions: Transaction[]): void {
    this.saveToLocalStorage(this.TRANSACTIONS_KEY, transactions);
  }

  hasTransactions(): boolean {
    return this.hasKey(this.TRANSACTIONS_KEY);
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

  hasKey(key: string): boolean {
    const data = localStorage.getItem(key);
    return data !== null && data.trim().length > 0;
  }
}
