import { AppUser } from './app-user';
import { TransactionType } from './transaction-type';
import { Transaction } from './transaction';
import { TransactionCategory } from './transaction-category';

export interface AppData {
  users: AppUser[];
  types: TransactionType[];
  categories: TransactionCategory[];
  transactions: Transaction[];
}
