import { formatDate } from "date-fns/format";
import { formatDistanceToNowStrict } from "date-fns/formatDistanceToNowStrict";

export function formatRelativeDate(fromMilliseconds: number) {
  const currentDate = new Date();
  const fromDate = new Date(fromMilliseconds);
  const differenceInSeconds = Math.round(
    (currentDate.getTime() - fromDate.getTime()) / 1000,
  );

  if (differenceInSeconds < 5) {
    // Consideramos "recién creado" si la diferencia es menor a 5 segundos
    return "now";
  } else if (currentDate.getTime() - fromDate.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(fromDate, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === fromDate.getFullYear()) {
      return formatDate(fromDate, "MMM d");
    } else {
      return formatDate(fromDate, "MMM d, yyy");
    }
  }
}
