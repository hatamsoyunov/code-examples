import { Pagination } from './Pagination';

export interface IPaginationList<T> {
  items: T[];
  pagination: Pagination;
}
