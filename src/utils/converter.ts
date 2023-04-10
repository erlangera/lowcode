export function config2Form(config) {
  if (config.type !== "form") {
    throw new Error("convert config fail", config);
  }
  const res = {};
  for (let item of config.fields) {
    let temp = item.default;
    if (Array.isArray(item.default) || (item.default !== null && typeof item.default === 'object')) {
      temp = JSON.parse(JSON.stringify(temp));
    }
    res[item.key] = temp;
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