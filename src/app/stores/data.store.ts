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
import { ISort } from '../models/i-sort';
import { sortTransactions } from '../extentions/sort-transactions';

export interface AppUsersState extends IState {
  appUsers: AppUser[];
  activeUser?: AppUser;
  types: TransactionType[];
  categories: TransactionCategory[];
  transactions: Transaction[];
  transactionsSortType: ISort;
}

export const initialAppUsersState: AppUsersState = {
  appUsers: [],
  types: [],
  categories: [],
  transactions: [],
  transactionsSortType: {
    sortBy: '',
    sortDirection: '',
  },
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

  readonly selectActiveUser$ = this.select((state) => state.activeUser);

  private readonly updateActiveUser = this.updater((state, activeUser: AppUser) => ({
    ...state,
    activeUser,
  }));

  readonly setActiveUser = this.effect<AppUser>((trigger$) =>
    trigger$.pipe(
      tap((activeUser) => {
        this.updateActiveUser(activeUser);
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
      tap(() => {
        this.saveTypesToLocalStorage();
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
      tap(() => {
        this.saveCategoriesToLocalStorage();
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
      tap(() => {
        this.saveTransactionsToLocalStorage();
      }),
    ),
  );

  readonly selectTransactionsSortType$ = this.select((state) => state.transactionsSortType);

  private readonly updateTransactionsSortType = this.updater((state, transactionsSort: ISort) => ({
    ...state,
    transactionsSortType: transactionsSort,
  }));

  readonly setTransactionsSortType = this.effect<ISort>((trigger$) =>
    trigger$.pipe(
      tap((transactionsSort) => {
        this.updateTransactionsSortType(transactionsSort);
      }),
      withLatestFrom(this.selectTransactions$),
      tap(([transactionsSort, transactions]) => {
        const sorted = sortTransactions(
          transactions,
          transactionsSort.sortBy,
          transactionsSort.sortDirection,
        );
        this.setTransactions(sorted);
      }),
    ),
  );

  ngrxOnStateInit() {
    if (!this.localStorageService.hasUsers()) {
      this.loadAppUsersFromWeb();
    }
    this.loadAppUsersFromLocalStorage();

    if (!this.localStorageService.hasTransactionTypes()) {
      this.loadTypesFromWeb();
    }
    this.loadTypesFromLocalStorage();

    if (!this.localStorageService.hasTransactionCategories()) {
      this.loadCategoriesFromWeb();
    }
    this.loadCategoriesFromLocalStorage();

    if (!this.localStorageService.hasTransactions()) {
      this.loadTransactionsFromWeb();
    }
    this.loadTransactionsFromLocalStorage();
  }

  ngrxOnStoreInit() {}

  private readonly saveAppUsersToLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.selectAppUsers$),
      tap(([, appUsers]) => this.localStorageService.saveUsers(appUsers)),
    ),
  );

  private readonly loadAppUsersFromWeb = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getAppUsers();
      }),
      tap((appUser) => {
        this.localStorageService.saveUsers(appUser);
      }),
    ),
  );

  private readonly loadAppUsersFromLocalStorage = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => {
        const appUsers = this.localStorageService.getAppUsers();
        this.setAppUsers(appUsers);
      }),
    ),
  );

  private readonly loadTypesFromWeb = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getTransactionTypes();
      }),
      tap((types) => {
        this.localStorageService.saveTransactionTypes(types);
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
      tap(() => {
        const types = this.localStorageService.getTransactionTypes();
        this.setTypes(types);
      }),
    ),
  );

  private readonly loadCategoriesFromWeb = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getTransactionCategories();
      }),
      tap((categories) => {
        this.localStorageService.saveTransactionCategories(categories);
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
      tap(() => {
        const categories = this.localStorageService.getTransactionCategories();
        this.setCategories(categories);
      }),
    ),
  );

  private readonly loadTransactionsFromWeb = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.uploadDataService.getTransactions();
      }),
      tap((transactions) => {
        this.localStorageService.saveTransactions(transactions);
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
      tap(() => {
        const transactions = this.localStorageService.getTransactions();
        this.setTransactions(transactions);
      }),
    ),
  );
}
