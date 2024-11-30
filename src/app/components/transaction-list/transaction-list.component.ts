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

@Component({
  selector: 'app-transaction-list',
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  templateUrl: './transaction-list.component.html',
  standalone: true,
  styleUrl: './transaction-list.component.css',
})
export class TransactionListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'amount', 'category', 'type', 'date'];

  dataSource = new MatTableDataSource<Transaction>();

  transactionTypes: TransactionType[] = [];

  transactionCategories: TransactionCategory[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataStore: DataStore) {}

  ngOnInit(): void {
    this.dataStore.selectTransactions$.subscribe((transactions) => {
      this.dataSource.data = transactions;
    });
    this.dataStore.selectTypes$.subscribe((types) => {
      this.transactionTypes = types;
    });
    this.dataStore.selectCategories$.subscribe((categories) => {
      this.transactionCategories = categories;
    });
    this.dataStore.selectTransactionsSortType$.subscribe((sort) => {});
  }

  ngAfterViewInit(): void {
    this.dataStore.selectTransactionsSortType$.subscribe((transactionSort) => {
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
}
