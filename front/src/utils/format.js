/**
 * @typedef {Object.<string, string>} instanceObject
 */

/**
 * JSON转url参数
 * @param {instanceObject} data Json格式数据
 * @returns {string}
 */
export const formatJsonToUrlParams = (data) => {
  return typeof data === 'object'
    ? Object.keys(data)
        .map((key) => {
          return `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`;
        })
        .join('&')
    : '';
};

export default formatJsonToUrlParams;
