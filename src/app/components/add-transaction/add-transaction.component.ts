import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe } from '../../extentions/auto-unsubscribe';
import { DataStore } from '../../stores/data.store';
import { TransactionType } from '../../models/transaction-type';
import { TransactionCategory } from '../../models/transaction-category';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Transaction } from '../../models/transaction';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-transaction',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  templateUrl: './add-transaction.component.html',
  standalone: true,
  styleUrl: './add-transaction.component.css',
})
export class AddTransactionComponent extends AutoUnsubscribe implements OnInit {
  transactionTypes: TransactionType[] = [];

  transactionCategories: TransactionCategory[] = [];

  date = new Date();

  minDate = new Date(2020, 0, 1);

  maxDate = new Date();

  transactionForm: FormGroup;

  constructor(
    private dataStore: DataStore,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.transactionForm = this.formBuilder.group({
      name: [undefined, Validators.required],
      amount: [undefined, [Validators.required, Validators.min(0.01)]],
      categoryId: [undefined, Validators.required],
      typeId: [undefined, Validators.required],
      date: [undefined, Validators.required],
    });
  }

  ngOnInit(): void {
    this.safeSubscribe(this.dataStore.selectTypes$, (types) => {
      this.transactionTypes = types;
    });
    this.safeSubscribe(this.dataStore.selectCategories$, (categories) => {
      this.transactionCategories = categories;
    });
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const newTransaction: Transaction = {
        ...this.transactionForm.value,
        id: null, // ID генерується на стороні сервісу
      };
      this.dataStore.addNewTransaction(newTransaction);
      this.transactionForm.reset();
    }
  }
}
