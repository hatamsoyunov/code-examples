import { jsonProperty, Serializable } from 'ts-serializable';

export class TransactionDto extends Serializable {
  @jsonProperty(Number, null) transactionId: number | null = null;
  @jsonProperty(Number, null) tokenId: number | null = null;
}
