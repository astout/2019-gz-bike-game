const PRECISION_TIME_MS = 2 * 60 * 1000;
const SESSION_TIME_S = 120;

const Connection = {
  disconnected: 'disconnected',
  connected: 'connected',
  searching: 'searching',
};

const Screen = {
  start: 'start',
  countDown: 'countDown',
  session: 'session',
  sessionEnd: 'sessionEnd',
};

export {
  PRECISION_TIME_MS,
  SESSION_TIME_S,
  Connection,
  Screen,
};