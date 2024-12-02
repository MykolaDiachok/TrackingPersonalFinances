export interface Transaction {
  id?: number | null;
  userId?: number;
  name?: string;
  amount?: number;
  typeId?: number;
  categoryId?: number;
  date?: Date;
}
