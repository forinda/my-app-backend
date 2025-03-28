import type { ApiReq } from '../http';
import { convertToNumber } from './numbers';

export function extractPaginationParams(query: ApiReq['query']) {
  const { page: pageQuery, limit: limitQuery, all: queryAll } = query;
  const page = pageQuery ? convertToNumber(pageQuery as string) : 1;
  const limit = limitQuery ? convertToNumber(limitQuery as string) : 100;

  if (queryAll) {
    return { page: 1, limit: undefined, all: true, offset: 0 };
  }

  delete query.page;
  delete query.limit;
  const offset = (page - 1) * limit;

  return { page, limit, offset, all: false };
}

export function paginator<T = unknown>(
  data: T[],
  total: number,
  { limit, page, all }: ApiPaginationParams
) {
  return {
    data,
    meta: {
      pagination: all
        ? {
            total,
            limit: total,
            page,
            pages: 1
          }
        : {
            total,
            limit,
            page,
            pages: Math.ceil(total / limit!)
          }
    }
  };
}

export type ApiPaginationParams = ReturnType<typeof extractPaginationParams>;
