import { Routes } from '@angular/router';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { CategoryListComponent } from './components/caterogy-list/category-list.component';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';

export const routes: Routes = [
  { path: '', component: TransactionListComponent, pathMatch: 'prefix' },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'add', component: AddTransactionComponent },
];
