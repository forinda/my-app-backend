import { useDrizzle, type DrizzleTransaction } from '@/db';
import { ApiError } from '../errors/base';

type ContextWithData<D> = {
  data: D;
  transaction?: DrizzleTransaction;
};

type ContextWithoutData = {
  transaction?: DrizzleTransaction;
};

export type TransactionContext<D = any> = D extends undefined
  ? ContextWithoutData
  : D extends null
    ? ContextWithoutData
    : ContextWithData<D>;

// export type NodDataTransactionContext = TransactionContext<undefined>;

export function TransactionalService() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const db = useDrizzle();

      return await db.transaction(async (tx) => {
        if (args.length > 1) {
          throw new ApiError('Method on requires a single argument');
        }
        const context: TransactionContext = {
          data: args[0]?.['data'],
          transaction: tx
        };
        const result = await originalMethod.apply(this, [context]);

        return result;
      });
    };

    return descriptor;
  };
}
