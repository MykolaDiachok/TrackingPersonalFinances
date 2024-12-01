import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataStore } from '../../stores/data.store';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Transaction } from '../../models/transaction';
import { TransactionType } from '../../models/transaction-type';
import { TransactionCategory } from '../../models/transaction-category';
import { ISort } from '../../models/i-sort';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AutoUnsubscribe } from '../../extentions/auto-unsubscribe';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { FilterAutocompletePipe } from '../../pipes/filter-autocomplete.pipe';

@Component({
  selector: 'app-transaction-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,

    MatInput,
    MatButton,
    MatIcon,
    FormsModule,
    MatIconButton,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    FilterAutocompletePipe,
  ],
  templateUrl: './transaction-list.component.html',
  standalone: true,
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent extends AutoUnsubscribe implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'amount', 'category', 'type', 'date', 'actions'];

  dataSource = new MatTableDataSource<Transaction>();

  transactionTypes: TransactionType[] = [];

  transactionCategories: TransactionCategory[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  filterValues: Record<string, string | undefined> = {};

  editingRow?: number;

  totalAmount = 0;

  transactions: Transaction[] = [];

  autocompleteFilterValues: { category: string; type: string } = {
    category: '',
    type: '',
  };

  editedTransaction: Transaction = {} as Transaction;

  constructor(private dataStore: DataStore) {
    super();
  }

  ngOnInit(): void {
    this.safeSubscribe(this.dataStore.selectDisplayedTransactions$, (transactions) => {
      this.dataSource.data = transactions;
      this.transactions = transactions;
    });

    this.safeSubscribe(this.dataStore.selectTypes$, (types) => {
      this.transactionTypes = types;
    });
    this.safeSubscribe(this.dataStore.selectCategories$, (categories) => {
      this.transactionCategories = categories;
    });

    this.safeSubscribe(this.dataStore.selectTotalAmount$, (totalAmount) => {
      this.totalAmount = totalAmount;
    });
  }

  ngAfterViewInit(): void {
    this.safeSubscribe(this.dataStore.selectTransactionsSortType$, (transactionSort) => {
      this.sort.active = transactionSort.sortBy;
      this.sort.direction = transactionSort.sortDirection;
      this.dataSource.sort = this.sort;
    });
  }

  getTypeName(typeId: number): string {
    const type = this.transactionTypes.find((t) => t.id === typeId);
    return type ? type.name : 'Unknown';
  }

  getCategoryName(categoryId: number): string {
    const category = this.transactionCategories.find((c) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  onSortChange($event: Sort) {
    this.dataStore.setTransactionsSortType({
      sortBy: $event.active,
      sortDirection: $event.direction,
    } as ISort);
  }

  applyFilter(column: string, value: string): void {
    this.filterValues[column] = value?.trim().toLowerCase();
    console.log('filterValues', this.filterValues);
    this.dataStore.setFilter(this.filterValues);
  }

  addTransaction() {}

  saveEdit() {}

  cancelEdit() {
    this.editingRow = undefined;
    this.editedTransaction = {} as Transaction;
  }

  startEdit(transaction: Transaction) {
    this.editingRow = transaction.id;
    this.editedTransaction = { ...transaction };
  }

  deleteTransaction(id: number) {
    this.dataStore.deleteTransaction(id);
  }
}
