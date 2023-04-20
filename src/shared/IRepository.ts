import { Result } from './Result';

export interface IRepository<T> {
  getById(id: string): Promise<Result<T>>;
  get(props: T): Promise<Result<T>>;
  exists(id: string): Promise<Result<boolean>>;
  save(props: T): Promise<Result<void>>;
}
