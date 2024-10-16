/* eslint-disable eqeqeq */
/* eslint-disable no-param-reassign */

import { Filter, ObjectId } from "mongodb";
import _ from "lodash";

export class Criteria {
  key: string;
  operator: string;
  value;

  constructor(key: string, operator: string, value: string) {
    this.key = key;
    this.operator = operator;
    this.value = resolveValue(value);
  }
}

export class InvalidCriteriaError extends Error {
  _isMongoQueryResolverError = true;
  constructor(msg: string) {
    super("InvalidCriteriaError: " + msg)
  }
}

export const regex = /(\w+\s*)(==|>=|<=|!=|\*=|>|<)(.*)/;

export const config = {
  regexFlags: "i",
  queryDelimiter: ",",
};

export const resolveValue = (value) => {
  let output = value;
  try {
    if (value.match(/^\d+$/)) {
      output = parseInt(value);
    } else if (ObjectId.isValid(value)) {
      output = ObjectId.createFromHexString(value);
    }
  } catch (ignored) {
    //
  }
  return output;
};

export const isValidCriteria = (c: Criteria) => c.key && c.operator;

export const resolveCriteria = (str: string) => {
  const matcher = str.match(regex);
  if (!matcher) {
    throw new InvalidCriteriaError(str);
  }
  return new Criteria(matcher[1], matcher[2], matcher[3]);
};

const aggregateCriteria = <T>(filter: Filter<T>, criteria: Criteria) => {
  if (criteria.operator == "==") {
    _.set(filter, `${criteria.key}`, criteria.value);
  } else if (criteria.operator == "!=") {
    _.set(filter, `${criteria.key}.$ne`, criteria.value);
  } else if (criteria.operator == ">") {
    _.set(filter, `${criteria.key}.$gt`, criteria.value);
  } else if (criteria.operator == "<") {
    _.set(filter, `${criteria.key}.$lt`, criteria.value);
  } else if (criteria.operator == ">=") {
    _.set(filter, `${criteria.key}.$gte`, criteria.value);
  } else if (criteria.operator == "<=") {
    _.set(filter, `${criteria.key}.$lte`, criteria.value);
  } else if (criteria.operator == "*=") {
    _.set(filter, `${criteria.key}.$regex`, new RegExp(criteria.value, config.regexFlags));
  }
  return filter;
};

export const resolveQuery = <T>(q: string): Filter<T> => q.split(config.queryDelimiter).map((x) => resolveCriteria(x)).reduce(aggregateCriteria, {});
export const resolveFilter = resolveQuery; // equivalent
