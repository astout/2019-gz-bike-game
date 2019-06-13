import _ from 'lodash';
import nomad7 from './views/assets/nomad7.png';
import nomad14 from './views/assets/nomad14.png';
import boulder50 from './views/assets/boulder50.png';
import boulder100 from './views/assets/boulder100.png';
import boulder200 from './views/assets/boulder200.png';
import boulder300 from './views/assets/boulder300.png';
import boulder400 from './views/assets/boulder400.png';
import lunarCharging from './views/assets/lunarCharging.png';

export function efficiencyImgWatts(watts) {
  const w = _.defaultTo(watts, 0);
  if (w > 300) {
    return boulder400;
  } else if (w > 200) {
    return boulder300;
  } else if (w > 100) {
    return boulder200;
  } else if (w > 50) {
    return boulder100;
  } else if (w > 25) {
    return boulder50;
  } else {
    return lunarCharging;
  }
}

export function efficiencyImgWattHours(wattHours) {
  const wh = _.defaultTo(wattHours, 0);
  if (wh >= 6) {
    return boulder400;
  } else if (wh >= 4.4) {
    return boulder300;
  } else if (wh >= 2.8) {
    return boulder200;
  } else if (wh >= 1.5) {
    return boulder100;
  } else if (wh >= 0.6) {
    return boulder50;
  } else if (wh >= 0.2) {
    return nomad14;
  } else if (wh >= 0.1) {
    return nomad7;
  } else {
    return lunarCharging;
  }
}

export function efficiencyRatingWattHours(wattHours) {
  const wh = _.defaultTo(wattHours, 0);
  if (wh >= 6) {
    return 'Boulder 200 + Boulder 200';
  } else if (wh >= 4.4) {
    return 'Boulder 200 + Boulder 100';
  } else if (wh >= 2.8) {
    return 'Boulder 200';
  } else if (wh >= 1.5) {
    return 'Boulder 100';
  } else if (wh >= 0.6) {
    return 'Boulder 50';
  } else if (wh >= 0.2) {
    return 'Nomad 14';
  } else if (wh >= 0.1) {
    return 'Nomad 7';
  } else {
    return 'Lunar Charging';
  }
}

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
