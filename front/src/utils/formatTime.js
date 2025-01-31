import dayjs from 'dayjs';

/**
 * 时间日期转换
 * @param {number|string} date 当前时间，new Date() 格式
 * @param {string} [format] 需要转换的时间格式字符串
 * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
 * @description format 季度："YYYY-mm-dd HH:MM:SS QQQQ"
 * @description format 星期："YYYY-mm-dd HH:MM:SS WWW"
 * @description format 几周："YYYY-mm-dd HH:MM:SS ZZZ"
 * @description format 季度 + 星期 + 几周："YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
 * @returns {string} 返回拼接后的时间字符串
 */
export function formatDate(date, format) {
  // 日期不存在，则返回空
  if (!date) {
    return '';
  }
  // 日期存在，则进行格式化
  if (format === undefined) {
    format = 'YYYY-MM-DD HH:mm:ss';
  }
  
  // 检查 date 的类型
  if (typeof date === 'number') {
    // 如果 date 是数字，假设它是 Unix 时间戳
    return dayjs.unix(date).format(format);
  } else {
    // 如果 date 是字符串，假设它是日期字符串
    return dayjs(date).format(format);
  }
}
