export default function formatDate(date) {
  let newDate = new Date(date);
  let year = newDate.getFullYear(),
    month = ("0" + (newDate.getMonth() + 1)).slice(-2),
    day = ("0" + newDate.getDate()).slice(-2),
    hour = ("0" + newDate.getHours()).slice(-2),
    minutes = ("0" + newDate.getMinutes()).slice(-2);
  let time = `${day}/${month}/${year} ${hour}:${minutes}`;
  return time;
}
