export function timeToMs(time: string) {
  if (time === undefined) return null;
  if (time === "") return Infinity;
  const arr = time.split(/[:.]/).map((num) => parseInt(num));
  return arr[0] * 60 * 1000 + arr[1] * 1000 + arr[2];
}

export function msToTime(ms: number | null) {
  if (!ms) return "";
  const negative = ms < 0 ? "-" : "";
  ms = Math.abs(ms);
  const mins = Math.floor(ms / 1000 / 60);
  const minsString = mins === 0 ? "" : mins + ":";
  ms %= 60000;
  const seconds = Math.floor(ms / 1000);
  const secondsString = minsString === "" ? seconds : seconds.toString().padStart(2, "0");
  ms %= 1000;
  return negative + minsString + secondsString + "." + ms.toString().padStart(3, "0");
}
