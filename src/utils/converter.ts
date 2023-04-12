/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
export const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/**
 * Parse simple path.
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)

const defaultDic = {
  string: '',
  number: 0,
  boolean: false,
  array: [],
  object: {}
}

function isObject(val: any): boolean {
  return typeof val === 'object' && val !== null;
}

type FieldConfig = {
  key: string,
  valueType: 'string' | 'number' | 'boolean' | 'array' | 'object',
  default?: any
}

export function config2Form(config: { type: 'form' | 'list', fields?: FieldConfig[] }): object | [] {
  let res: { [x: string]: any } | [] = {};
  if (config.type === "form") {
    for (let item of config.fields!) {
      if (bailRE.test(item.key)) {
        continue;
      }
      // 获取默认值
      let value = item.default;
      if (value === undefined) {
        value = defaultDic[item.valueType] ?? undefined;
      }
      if (isObject(item.default)) {
        value = JSON.parse(JSON.stringify(value));
      }
      // 按路径赋值
      setValueByPath(res, item.key, value);
    }
  } else if (config.type === "list") {
    res = [];
  }
  return res;
}

function setValueByPath(obj: { [x: string]: any }, path: string | number, val: any): void {
  if (typeof path === 'number') {
    obj[path] = val;
  } else if (typeof path === 'string') {
    const segments = path.split('.')
    for (let i = 0; i < segments.length - 1; i++) {
      if (!isObject(obj[segments[i]])) {
        obj[segments[i]] = {};
      }
      obj = obj[segments[i]];
    }
    obj[segments[segments.length - 1]] = val;
  }
}

export function toRefConvert(obj: { [x: string]: any }, path: string | number): [object, string | number] | void {
  if (typeof path === 'number') {
    return [obj, path];
  } else if (typeof path === 'string') {
    const segments = path.split('.')
    for (let i = 0; i < segments.length - 1; i++) {
      if (!isObject(obj[segments[i]])) {
        obj[segments[i]] = {};
      }
      obj = obj[segments[i]];
    }
    return [obj, segments[segments.length - 1]]
  }
}

/**
 * 字符串首字母大写转换
 * @param str
 * @returns
 */
export function upperFirstCharacter(str: string): string {
  if (!str) return str;

  return str[0].toUpperCase() + str.slice(1);
}