// src/test/utils/logger.ts
let logs: string[] = [];
const originalLog = console.log;

console.log = (...args: any[]) => {
  logs.push(args.join(' ')); // capture log
  originalLog.apply(console, args); // still print to console
};

export const getLogs = () => logs;
export const clearLogs = () => {
  logs = [];
};
