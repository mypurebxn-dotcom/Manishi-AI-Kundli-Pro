'use strict';

function localToUTC(dateStr, timeStr, offsetHours = 5.5) {
  if (!dateStr || !timeStr) throw new Error('Date and time are required for UTC conversion');
  const [year, month, day] = String(dateStr).split('-').map(Number);
  const parts = String(timeStr).split(':').map(Number);
  const hour = parts[0] || 0;
  const minute = parts[1] || 0;
  const second = parts[2] || 0;
  const offset = Number(offsetHours);
  if (!year || !month || !day) throw new Error('Invalid date format. Expected YYYY-MM-DD');
  if (!Number.isFinite(offset)) throw new Error('Invalid timezone offset');

  const localMs = Date.UTC(year, month - 1, day, hour, minute, second);
  const utcMs = localMs - offset * 60 * 60 * 1000;
  const tempDate = new Date(utcMs);

  return {
    year: tempDate.getUTCFullYear(),
    month: tempDate.getUTCMonth() + 1,
    day: tempDate.getUTCDate(),
    hour: tempDate.getUTCHours() + (tempDate.getUTCMinutes() / 60) + (tempDate.getUTCSeconds() / 3600)
  };
}

module.exports = { localToUTC };
