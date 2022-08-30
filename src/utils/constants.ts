const LOG_LEVEL = {
  info: "info",
  debug: "debug",
  warn: "warn",
  error: "error"
};

const CONSOLE_COLORS = {
  red: `\u001b[31m`,
  green: `\u001b[32m`,
  yellow: `\u001b[33m`,
  cyan: `\u001b[36m`,
  white: `\u001b[37m`,
  reset: `\u001b[0m`
};

const LOG_LEVEL_COLOR = {
  [LOG_LEVEL.info]: CONSOLE_COLORS.white,
  [LOG_LEVEL.debug]: CONSOLE_COLORS.white,
  [LOG_LEVEL.warn]: CONSOLE_COLORS.yellow,
  [LOG_LEVEL.error]: CONSOLE_COLORS.red
};

export default {
  LOG_LEVEL,
  CONSOLE_COLORS,
  LOG_LEVEL_COLOR
};
