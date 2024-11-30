import { Transaction } from '../models/transaction';

export function sortTransactions(
  transactions: Transaction[],
  sortBy: keyof Transaction | '',
  sortDirection: 'asc' | 'desc' | '',
): Transaction[] {
  if (!sortBy || !sortDirection) {
    sortBy = 'id';
    sortDirection = 'asc';
  }

  return [...transactions].sort((a, b) => {
    const valueA = a[sortBy] as string | number | Date;
    const valueB = b[sortBy] as string | number | Date;

    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
}
