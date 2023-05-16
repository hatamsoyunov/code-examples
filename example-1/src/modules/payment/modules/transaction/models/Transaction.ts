import { jsonProperty, Serializable } from 'ts-serializable';

import { TransactionStatus, TransactionType } from '../types/TransactionTypes';

export class Transaction extends Serializable {
  @jsonProperty(Number, null) id: number | null = null;
  @jsonProperty(String, null) createdAt: string | null = null;
  @jsonProperty(String, null) type: TransactionType | null = null;
  @jsonProperty(String, null) currency: string | null = null;
  @jsonProperty(Number, null) amount: number | null = null;
  @jsonProperty(String, null) paymentSystem: string | null = null;
  @jsonProperty(String, null) status: TransactionStatus | null = null;
  @jsonProperty(String, null) title: string | null = null;
}
