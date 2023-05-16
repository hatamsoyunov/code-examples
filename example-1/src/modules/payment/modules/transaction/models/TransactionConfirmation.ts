import { jsonProperty, Serializable } from 'ts-serializable';

export class TransactionConfirmation extends Serializable {
  @jsonProperty(String, null) url: String | null = null;
}
