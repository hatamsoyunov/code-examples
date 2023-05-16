import AbstractApiRepository from '../../../../base/api/AbstractApiRepository';
import ApiHelper from '../../../../base/api/ApiHelper';
import { TransactionsListDto } from './dto/TransactionsListDto';

export default class TransactionApiRepository extends AbstractApiRepository {
  getTransactions = (data: TransactionsListDto) => {
    const params = ApiHelper.getURLSearchParams(data);

    return this.apiClient.get({ url: `/payments/transactions?${params}` });
  };
}
