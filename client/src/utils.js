import _ from 'lodash';

export function renderMinutes(t) {
  const time = _.defaultTo(t, 0);
  const m = _.floor(time / 1000 / 60);
  return `${m}`;
}

export function renderSeconds(t) {
  const time = _.defaultTo(t, 0);
  const s = _.floor(time / 1000) % 60;
  const s10 = _.floor(s / 10);
  const s1 = _.floor(s % 10);
  return `${s10}${s1}`;
}

export function renderMilliseconds(t) {
  const time = _.defaultTo(t, 0);
  const ms = time % 1000;
  const ms100 = _.floor(ms / 100);
  const ms10 = _.floor((ms % 100) / 10); // 959 % 100 / 10
  // const ms1 = _.floor(ms % 10);
  return `${ms100}${ms10}`;
}

export function renderWh(wh) {
  const wattHours = _.defaultTo(wh, 0);
  return `${_.round(wattHours, 2)}`;
}

export function renderWatts(w) {
  const watts = _.defaultTo(w, 0);
  return `${watts}`;
}

export function renderMinSec(s) {
  const totalsec = _.defaultTo(s, 120);
  const min = _.floor(totalsec / 60);
  const sec = totalsec % 60;
  return `${min} min ${sec} sec`;
}
