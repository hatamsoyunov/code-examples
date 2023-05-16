import { makeAutoObservable } from 'mobx';

import { appConfig } from '../../../../appConfig';
import { Dto } from '../../../../base/Dto';
import { Pagination } from '../../../../base/modules/pagination/Pagination';
import TransactionService from './TransactionService';
import { TransactionsListDto } from './dto/TransactionsListDto';
import { Transaction } from './models/Transaction';

export class TransactionStore {
  transactionsList: Transaction[] = [];
  transactionsListOffset: number = 0;
  hasMoreTransactionsList: boolean = true;
  transactionsListLoading: boolean = false;
  isTransactionsListLoaded: boolean = true;
  transactionsListMoreLoading: boolean = false;
  transactionsListRefreshLoading: boolean = false;

  private transactionService: TransactionService;

  constructor() {
    makeAutoObservable(this);
    this.transactionService = new TransactionService();
  }

  // API

  getTransactions = (isLoadMore: boolean = false) => {
    if (!this.hasMoreTransactionsList || this.transactionsListLoading || this.transactionsListMoreLoading) {
      return;
    }

    this.setTransactionsListLoading(isLoadMore, true);

    const dto = Dto.populate<TransactionsListDto>(TransactionsListDto, {
      limit: appConfig.listLimits.transaction,
      offset: this.transactionsListOffset,
    });

    return this.transactionService
      .getTransactions(dto)
      .then(res => {
        this.setTransactionsList([...this.transactionsList, ...res.items]);
        this.setTransactionsListPagination(res.pagination);
        this.setIsTransactionsListLoaded(true);
      })
      .catch(() => {
        this.setIsTransactionsListLoaded(false);
      })
      .finally(() => {
        this.setTransactionsListLoading(isLoadMore, false);
      });
  };

  refreshTransactions = () => {
    this.setTransactionsListRefreshLoading(true);

    const dto = Dto.populate<TransactionsListDto>(TransactionsListDto, {
      limit: appConfig.listLimits.transaction,
      offset: 0,
    });

    return this.transactionService
      .getTransactions(dto)
      .then(res => {
        this.setTransactionsList(res.items);
        this.setTransactionsListPagination(res.pagination);
        this.setIsTransactionsListLoaded(true);
      })
      .catch(() => {
        this.setIsTransactionsListLoaded(false);
      })
      .finally(() => {
        this.setTransactionsListRefreshLoading(false);
      });
  };

  // RESET

  resetTransactionsList = () => {
    this.transactionsList = [];
    this.transactionsListLoading = false;
    this.transactionsListOffset = 0;
    this.isTransactionsListLoaded = true;
    this.hasMoreTransactionsList = true;
    this.transactionsListMoreLoading = false;
  };

  reset = () => {
    this.resetTransactionsList();
  };

  // SETTERS

  private setTransactionsList = (value: Transaction[]) => {
    this.transactionsList = value;
  };

  private setTransactionsListPagination = (pagination: Pagination) => {
    const { currentOffset, totalCount } = pagination.meta!;

    this.transactionsListOffset = currentOffset || 0;
    this.hasMoreTransactionsList = currentOffset !== totalCount;
  };

  private setTransactionsListLoading = (isLoadMore: boolean, value: boolean) => {
    if (isLoadMore) {
      this.transactionsListMoreLoading = value;
    } else {
      this.transactionsListLoading = value;
    }
  };

  private setIsTransactionsListLoaded = (value: boolean) => {
    this.isTransactionsListLoaded = value;
  };

  private setTransactionsListRefreshLoading = (value: boolean) => {
    this.transactionsListRefreshLoading = value;
  };
}
