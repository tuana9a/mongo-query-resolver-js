/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */

import { Filter, ObjectId } from "mongodb";
import _ from "lodash";

export const config = {
  regexFlags: "i",
};

export const valueResolver = (value) => {
  let output = value;
  try {
    if (value.match(/^\d+$/)) {
      output = parseInt(value);
    } else if (ObjectId.isValid(value)) {
      output = new ObjectId(value);
    }
  } catch (ignored) {
    //
  }
  return output;
};

export class Criteria {
  key: string;
  operator: string;
  value;

  constructor(key: string, operator: string, value: string) {
    this.key = key;
    this.operator = operator;
    this.value = valueResolver(value);
  }
}

export const isValidQuery = (q: Criteria) => q.key && q.operator;

export const regex = /(\w+\s*)(==|>=|<=|!=|\*=|>|<)(.*)/;

export const criteria = (str: string) => {
  const matcher = str.match(regex);
  if (matcher) {
    return new Criteria(matcher[1], matcher[2], matcher[3]);
  }
  return new Criteria(null, null, null);
};

export const aggregate = <T>(filter: Filter<T>, query: Criteria) => {
  if (query.operator == "==") {
    _.set(filter, `${query.key}`, query.value);
  } else if (query.operator == "!=") {
    _.set(filter, `${query.key}.$ne`, query.value);
  } else if (query.operator == ">") {
    _.set(filter, `${query.key}.$gt`, query.value);
  } else if (query.operator == "<") {
    _.set(filter, `${query.key}.$lt`, query.value);
  } else if (query.operator == ">=") {
    _.set(filter, `${query.key}.$gte`, query.value);
  } else if (query.operator == "<=") {
    _.set(filter, `${query.key}.$lte`, query.value);
  } else if (query.operator == "*=") {
    _.set(
      filter,
      `${query.key}.$regex`,
      new RegExp(query.value, config.regexFlags)
    );
  }
  return filter;
};

export const query = <T>(queries: string[] = []): Filter<T> =>
  queries
    .map((x) => criteria(x))
    .filter((x) => isValidQuery(x))
    .reduce(aggregate, {});
