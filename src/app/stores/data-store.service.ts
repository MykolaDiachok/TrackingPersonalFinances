import { AppUser } from '../models/app-user';
import { Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, OnStoreInit } from '@ngrx/component-store';
import { LocalStorageService } from '../services/local-storage.service';
import { UploadDataService } from '../services/upload-data.service';
import { switchMap, tap, withLatestFrom } from 'rxjs';
import { TransactionType } from '../models/transaction-type';
import { TransactionCategory } from '../models/transaction-category';
import { Transaction } from '../models/transaction';
import { IState } from './i-state';
import { linkToGlobalState } from './component-state.reducer';
import { Store } from '@ngrx/store';

export interface AppUsersState extends IState {
  appUsers: AppUser[];
  types: TransactionType[];
  categories: TransactionCategory[];
  transactions: Transaction[];
}

export const initialAppUsersState: AppUsersState = {
  appUsers: [],
  types: [],
  categories: [],
  transactions: [],
};

@Injectable()
export class DataStore extends ComponentStore<AppUsersState> implements OnStoreInit, OnStateInit {
  constructor(
    protected globalStore: Store,
    private localStorageService: LocalStorageService,
    private uploadDataService: UploadDataService,
  ) {
    super(initialAppUsersState);
    linkToGlobalState(this.state$, 'DataStore', this.globalStore);
  }

  readonly selectAppUsers$ = this.select((state) => state.appUsers);

  private readonly updateAppUsers = this.updater((state, appUsers: AppUser[]) => ({
    ...state,
    appUsers: [...appUsers],
  }));

  readonly setAppUsers = this.effect<AppUser[]>((trigger$) =>
    trigger$.pipe(
      tap((appUsers) => {
        this.updateAppUsers(appUsers);
      }),
      tap(() => {
        this.saveAppUsersToLocalStorage();
      }),
    ),
  );

  readonly selectTypes$ = this.select((state) => state.types);

  private readonly updateTypes = this.updater((state, types: TransactionType[]) => ({
    ...state,
    types: [...types],
  }));

  readonly setTypes = this.effect<TransactionType[]>((trigger$) =>
    trigger$.pipe(
      tap((types) => {
        this.updateTypes(types);
      }),
    ),
  );

  readonly selectCategories$ = this.select((state) => state.categories);

  private readonly updateCategories = this.updater((state, categories: TransactionCategory[]) => ({
    ...state,
    categories: [...categories],
  }));

  readonly setCategories = this.effect<TransactionCategory[]>((trigger$) =>
    trigger$.pipe(
      tap((categories) => {
        this.updateCategories(categories);
      }),
    ),
  );

  readonly selectTransactions$ = this.select((state) => state.transactions);

  private readonly updateTransactions = this.updater((state, transactions: Transaction[]) => ({
    ...state,
    transactions: [...transactions],
  }));

  readonly setTransactions = this.effect<Transaction[]>((trigger$) =>
    trigger$.pipe(
      tap((transactions) => {
        this.updateTransactions(transactions);
      }),
    ),
  );

  ngrxOnStateInit() {
    this.loadAppUserFromLocalStorage();
    this.loadTypesFromLocalStorage();
    this.loadCategoriesFromLocalStorage();
    this.loadTransactionsFromLocalStorage();
    console.log('DataStore ngrxOnStateInit');
  }

  ngrxOnStoreInit() {
    console.log('DataStore ngrxOnStoreInit');
  }

  private readonly saveAppUsersToLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.selectAppUsers$),
      tap(([, appUsers]) => this.localStorageService.saveUsers(appUsers)),
    ),
  );

  private readonly loadAppUserFromLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getAppUsers();
      }),
      tap((appUser) => {
        this.setAppUsers(appUser);
      }),
    ),
  );

  private readonly saveTypesToLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.selectTypes$),
      tap(([, types]) => this.localStorageService.saveTransactionTypes(types)),
    ),
  );

  private readonly loadTypesFromLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getTransactionTypes();
      }),
      tap((types) => {
        this.setTypes(types);
      }),
    ),
  );

  private readonly saveCategoriesToLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.selectCategories$),
      tap(([, categories]) => this.localStorageService.saveTransactionCategories(categories)),
    ),
  );

  private readonly loadCategoriesFromLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getTransactionCategories();
      }),
      tap((categories) => {
        this.setCategories(categories);
      }),
    ),
  );

  private readonly saveTransactionsToLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.selectTransactions$),
      tap(([, transactions]) => this.localStorageService.saveTransactions(transactions)),
    ),
  );

  private readonly loadTransactionsFromLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getTransactions();
      }),
      tap((transactions) => {
        this.setTransactions(transactions);
      }),
    ),
  );
}
