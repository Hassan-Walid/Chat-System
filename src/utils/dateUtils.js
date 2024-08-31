import { format, toZonedTime } from "date-fns-tz";
export const displayTime = (messageTime, userTimeZone) => {
  const zonedTime = toZonedTime(messageTime, userTimeZone);
  return format(zonedTime, "yyyy-MM-dd HH:mm", {
    timeZone: userTimeZone,
  });
};
