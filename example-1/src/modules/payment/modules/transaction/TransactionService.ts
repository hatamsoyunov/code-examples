import { modelFactory } from '../../../../base/ModelFactory';
import TransactionApiRepository from './TransactionApiRepository';
import { TransactionsListDto } from './dto/TransactionsListDto';
import { Transaction } from './models/Transaction';

export default class TransactionService {
  apiRepository: TransactionApiRepository;

  constructor() {
    this.apiRepository = new TransactionApiRepository();
  }

  getTransactions = async (dto: TransactionsListDto) => {
    const { data } = await this.apiRepository.getTransactions(dto);

    return modelFactory.createPaginationList(Transaction, (data as any)?.data);
  };
}
