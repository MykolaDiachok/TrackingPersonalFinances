import { Transaction } from '../models/transaction';
import { TransactionCategory } from '../models/transaction-category';
import { TransactionType } from '../models/transaction-type';

export function filterTransactions(
  transactions: Transaction[],
  filter: Partial<Record<keyof Transaction, string | undefined>>,
  categories: TransactionCategory[],
  types: TransactionType[],
): Transaction[] {
  return transactions.filter((transaction) =>
    Object.keys(filter).every((key) => {
      const filterValue = filter[key as keyof Transaction];
      if (!filterValue) {
        return true;
      }
      const transactionValue = transaction[key as keyof Transaction];
      if (key === 'categoryId') {
        const category = categories.find((cat) => cat.id === transaction.categoryId);
        return category ? category.name.toLowerCase().includes(filterValue.toLowerCase()) : false;
      }

      if (key === 'typeId') {
        const type = types.find((type) => type.id === transaction.typeId);
        return type ? type.name.toLowerCase().includes(filterValue.toLowerCase()) : false;
      }

      return transactionValue
        ? transactionValue.toString().toLowerCase().includes(filterValue.toLowerCase())
        : false;
    }),
  );
}
