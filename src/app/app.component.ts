import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';

@Component({
  selector: 'app-root',
  imports: [TransactionListComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'tpf';
}
