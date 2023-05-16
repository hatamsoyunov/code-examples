import { Nullable } from '../../../base/types/BaseTypes';
import { CardType } from '../../card/types/CardTypes';

export class PaymentRenderHelper {
  static showOldPrice = (oldPrice: number | null | undefined, price: number): boolean => {
    if (!oldPrice) {
      return false;
    }

    return oldPrice > price;
  };

  static isActiveCard = (activeCardId: number | null | undefined, id: Nullable<number>) => {
    return activeCardId === id;
  };

  static isNewCard = (type: string | null | undefined) => {
    return type === CardType.NEW_CARD;
  };
}
