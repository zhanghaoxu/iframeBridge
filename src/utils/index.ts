export const __dev__ = process.env.__DEV__;
console.log(__dev__);
export const Logger = {
  info: (message?: any, ...optionalParams: any[]) => {
    if (__dev__) {
      console.log(message, ...optionalParams);
    }
  },
  warn: (message?: any, ...optionalParams: any[]) => {
    if (__dev__) {
      console.warn(message, ...optionalParams);
    }
  },
  error: (message?: any, ...optionalParams: any[]) => {
    if (__dev__) {
      console.error(message, ...optionalParams);
    }
  },
};
