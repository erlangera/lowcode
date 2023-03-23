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
