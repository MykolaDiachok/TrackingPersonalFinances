import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DataStore } from '../../stores/data.store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Transaction } from '../../models/transaction';
import { TransactionType } from '../../models/transaction-type';
import { TransactionCategory } from '../../models/transaction-category';
import { ISort } from '../../models/i-sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoUnsubscribe } from '../../extentions/auto-unsubscribe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FilterAutocompletePipe } from '../../pipes/filter-autocomplete.pipe';
import { NgxMaskDirective } from 'ngx-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-transaction-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatAutocompleteModule,
    MatSelectModule,
    FormsModule,
    NgxMaskDirective,
    FilterAutocompletePipe,
    MatNativeDateModule,
    CurrencyPipe,
    MatButtonModule,
    MatIconModule,
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

  editingRow?: number | null;

  totalAmount = 0;

  transactions: Transaction[] = [];

  autocompleteFilterValues: { category: string; type: string } = {
    category: '',
    type: '',
  };

  editedTransaction: Transaction = {} as Transaction;

  date = new Date();

  minDate = new Date(2020, 0, 1);

  maxDate = new Date();

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

  addTransaction() {
    this.editedTransaction = {
      id: null,
      name: '',
      userId: undefined,
      amount: 0,
      categoryId: undefined,
      typeId: undefined,
      date: new Date(),
    };
    this.editingRow = null;
    this.dataSource.data = [...this.dataSource.data, this.editedTransaction];
  }

  saveEdit() {
    if (this.editedTransaction.id) {
      this.dataStore.editExistingTransaction(this.editedTransaction);
    } else {
      this.dataStore.addNewTransaction(this.editedTransaction);
    }

    this.editingRow = undefined;
    this.editedTransaction = {} as Transaction;
  }

  cancelEdit() {
    if (this.editingRow === null) {
      this.dataSource.data = this.dataSource.data.filter((t) => t.id !== null);
    }

    this.editingRow = undefined;
    this.editedTransaction = {} as Transaction;
  }

  startEdit(transaction: Transaction) {
    this.editingRow = transaction.id;
    this.editedTransaction = {
      ...transaction,
      date: transaction.date || new Date(),
    };
  }

  deleteTransaction(id: number) {
    this.dataStore.deleteTransaction(id);
  }

  getValidationErrors(): string[] {
    const errors: string[] = [];

    if (!this.editedTransaction?.name) {
      errors.push('Name is required.');
    }

    if (!this.editedTransaction?.amount || this.editedTransaction.amount <= 0) {
      errors.push('Amount must be greater than 0.');
    }

    if (!this.editedTransaction?.categoryId) {
      errors.push('Category is required.');
    }

    if (!this.editedTransaction?.typeId) {
      errors.push('Type is required.');
    }

    if (!this.editedTransaction?.date) {
      errors.push('Date is required.');
    }

    return errors;
  }

  onAmountChange(value: string) {
    this.editedTransaction.amount = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
  }

  selectAll(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.select();
  }
}
