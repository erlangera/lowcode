export function config2Form(config) {
  if (config.type !== "form") {
    throw new Error("convert config fail", config);
  }
  const res = {};
  for (let item of config.fields) {
    res[item.key] = item.default;
  }
  return res;
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