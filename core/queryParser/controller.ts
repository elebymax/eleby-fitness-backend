import {Context} from "koa";
import {QueryItem} from "./type";
import _ from 'lodash';
import {QueryBuilder} from "knex";

//處理 url query
export const parse = async (ctx: Context, next: () => Promise<void>): Promise<void> => {
  const query = ctx.request.query;

  const queryItem: QueryItem = {
    keywords: [],
    filters: [],
    orders: []
  };

  await _.forEach(query, async (value: string, key: string) => {
    if (key === 'first') {
      queryItem.first = parseInt(value);
      return;
    }

    if (key === 'last') {
      queryItem.last = parseInt(value);
      return;
    }

    if (key === 'offset') {
      queryItem.offset = parseInt(value);
      return;
    }

    if (key === 'keyword') {
      queryItem.keyword = value;
      return;
    }

    if (_.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const regex = /^(.[^:]*):{1}(.*)$/;
        const strArr = regex.exec(value[i]);
        if (strArr && strArr[0]) {
          const operator: string = strArr[1];
          const val: string = strArr[2];

          // >
          if (operator === 'gt' && val) {
            queryItem.filters.push({
              field: key,
              operator: '>',
              value: val
            });
            continue;
          }

          // >=
          if (operator === 'gte' && val) {
            queryItem.filters.push({
              field: key,
              operator: '>=',
              value: val
            });
            continue;
          }

          // =
          if (operator === 'e' && val) {
            queryItem.filters.push({
              field: key,
              operator: '=',
              value: val
            });
            continue;
          }

          // <
          if (operator === 'lt' && val) {
            queryItem.filters.push({
              field: key,
              operator: '<',
              value: val
            });
            continue;
          }

          // <=
          if (operator === 'lte' && val) {
            queryItem.filters.push({
              field: key,
              operator: '<=',
              value: val
            });
            continue;
          }

          //asc sorting
          if (operator === 'asc') {
            queryItem.orders.push({
              field: key,
              operator: 'asc'
            });
            if (val) {
              queryItem.keywords.push({
                field: key,
                value: val
              });
            }
            continue;
          }

          //desc sorting
          if (operator === 'desc' && !val) {
            queryItem.orders.push({
              field: key,
              operator: 'desc'
            });
            if (val) {
              queryItem.keywords.push({
                field: key,
                value: val
              });
            }
            continue;
          }
        } else {
          queryItem.keywords.push({
            field: key,
            value: value[i]
          });
        }
      }
      return;
    } else {
      const regex = /^(.[^:]*):{1}(.*)$/;
      const strArr = regex.exec(value);
      if (strArr && strArr[0]) {
        const operator: string = strArr[1];
        const val: string = strArr[2];

        // >
        if (operator === 'gt' && val) {
          queryItem.filters.push({
            field: key,
            operator: '>',
            value: val
          });
          return;
        }

        // >=
        if (operator === 'gte' && val) {
          queryItem.filters.push({
            field: key,
            operator: '>=',
            value: val
          });
          return;
        }

        // =
        if (operator === 'e' && val) {
          queryItem.filters.push({
            field: key,
            operator: '=',
            value: val
          });
          return;
        }

        // <
        if (operator === 'lt' && val) {
          queryItem.filters.push({
            field: key,
            operator: '<',
            value: val
          });
          return;
        }

        // <=
        if (operator === 'lte' && val) {
          queryItem.filters.push({
            field: key,
            operator: '<=',
            value: val
          });
          return;
        }

        //asc sorting
        if (operator === 'asc') {
          queryItem.orders.push({
            field: key,
            operator: 'asc'
          });
          if (val) {
            queryItem.keywords.push({
              field: key,
              value: val
            });
          }
        }

        //desc sorting
        if (operator === 'desc' && !val) {
          queryItem.orders.push({
            field: key,
            operator: 'desc'
          });
          if (val) {
            queryItem.keywords.push({
              field: key,
              value: val
            });
          }
        }

        return;
      }
    }

    if (_.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        queryItem.keywords.push({
          field: key,
          value: value[i]
        });
      }
      return;
    }

    queryItem.keywords.push({
      field: key,
      value: value
    });
    return
  });

  ctx.queryItem = queryItem;

  await next();
};

//處理 sql query
export const addCondition = async (query: QueryBuilder, queryItem: QueryItem): Promise<QueryBuilder> => {
  if (!queryItem) {
    return query;
  }

  if (queryItem.first) {
    query = query.limit(queryItem.first);
    if (!queryItem.orders || !queryItem.orders.length) {
      query = query.orderBy('created_at', 'asc');
    }
  }

  if (queryItem.last) {
    query = query.limit(queryItem.last);
    if (!queryItem.orders || !queryItem.orders.length) {
      query = query.orderBy('created_at', 'desc');
    }
  }

  if (queryItem.offset) {
    query = query.offset(queryItem.offset)
  }

  if (queryItem.filters && queryItem.filters.length) {
    for (let i = 0; i < queryItem.filters.length; i++) {
      const filter: { field: string, operator: string, value: string } = queryItem.filters[i];
      query = query.where(_.snakeCase(filter.field), filter.operator, filter.value);
    }
  }

  if (queryItem.keywords && queryItem.keywords.length) {
    query = query.where(function (this: any) {
      if (queryItem.keywords.length === 1) {
        this.where(_.snakeCase(queryItem.keywords[0].field), 'like', `%${queryItem.keywords[0].value}%`);
      } else {
        let temp = this;
        for (let i = 0; i < queryItem.keywords.length; i++) {
          const keyword: { field: string, value: string } = queryItem.keywords[i];
          temp = temp.orWhere(_.snakeCase(keyword.field), 'like', `%${keyword.value}%`);
        }
      }
    });
  }

  if (queryItem.orders && queryItem.orders.length) {
    const orders: Array<{ column: string, order: string }> = [];
    for (let i = 0; i < queryItem.orders.length; i++) {
      const order: { field: string, operator: string } = queryItem.orders[i];
      orders.push({
        column: _.snakeCase(order.field),
        order: order.operator
      });
    }
    query = query.orderBy(orders);
  }

  return query;
};

//處理 sql count query
export const addCountCondition = async (query: QueryBuilder, queryItem: QueryItem): Promise<QueryBuilder> => {
  if (!queryItem) {
    return query;
  }

  if (queryItem.filters && queryItem.filters.length) {
    for (let i = 0; i < queryItem.filters.length; i++) {
      const filter: { field: string, operator: string, value: string } = queryItem.filters[i];
      query = query.where(_.snakeCase(filter.field), filter.operator, filter.value);
    }
  }

  if (queryItem.keywords && queryItem.keywords.length) {
    query = query.where(function (this: any) {
      let temp = this;
      for (let i = 0; i < queryItem.keywords.length; i++) {
        const keyword: { field: string, value: string } = queryItem.keywords[i];
        temp = temp.orWhere(_.snakeCase(keyword.field), 'like', `%${keyword.value}%`);
      }
    });
  }

  return query;
};
