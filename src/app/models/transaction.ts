export interface Transaction {
  id: number;
  userId: number;
  name: string;
  amount: number;
  typeId: number;
  categoryId: number;
  date: Date;
}
