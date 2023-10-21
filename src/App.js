import React, { useState } from "react";

function App() {
  const [cronPattern, setCronPattern] = useState("");
  const [cronMeaning, setCronMeaning] = useState("");

  function interpretCron(value) {
    const parts = value.split(" ");
    if (parts.length !== 5) {
      return "Invalid Pattern";
    }

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    function interpretField(field, min, max, unit, names) {
      if (field === "*") {
        return unit === "minute" ? "Every minute" : `every ${unit}`;
      } else if (field.includes(",")) {
        const values = field
          .split(",")
          .map((value) => interpretField(value, min, max, unit, names)); // Recursive call
        return values.join(", ");
      } else if (field.includes("-")) {
        const [start, end] = field.split("-");
        if (unit === "hour") {
          const startValue = parseInt(start, 10);
          const endValue = parseInt(end, 10);
          const startPeriod = startValue < 12 ? "AM" : "PM";
          const endPeriod = endValue < 12 ? "AM" : "PM";
          const formattedStart = startValue % 12 === 0 ? 12 : startValue % 12;
          const formattedEnd =
            (endValue + 1) % 12 === 0 ? 12 : (endValue + 1) % 12;
          return `between ${formattedStart}:00 ${startPeriod} to ${
            formattedEnd - 1
          }:59 ${endPeriod}`;
        } else {
          const startIndex = names
            ? names.indexOf(start)
            : parseInt(start, 10) - min;
          const endIndex = names ? names.indexOf(end) : parseInt(end, 10) - min;
          const formattedStart = names ? names[startIndex] : startIndex + min;
          const formattedEnd = names ? names[endIndex] : endIndex + min;
          return `every ${unit} from ${formattedStart} to ${formattedEnd}`;
        }
      } else if (field.includes("/")) {
        const [, step] = field.split("/");
        return `every ${step} ${unit}(s)`;
      } else if (field === "L") {
        return `the last ${unit}`;
      } else if (field === "W") {
        return `the nearest weekday`;
      } else if (!isNaN(field) && unit === "hour") {
        const hourValue = parseInt(field, 10);
        const period = hourValue < 12 ? "AM" : "PM";
        const formattedHour = hourValue % 12 === 0 ? 12 : hourValue % 12;
        return `between ${formattedHour}:00 ${period} to ${formattedHour}:59 ${period}`;
      } else if (!isNaN(field)) {
        return names ? names[parseInt(field, 10) - min] : field;
      } else if (names && names.includes(field)) {
        return field;
      } else {
        return "Invalid Pattern";
      }
    }

    const interpretedMinute = interpretField(parts[0], 0, 59, "minute");
    const interpretedHour = interpretField(parts[1], 0, 23, "hour");
    const interpretedDayOfMonth = interpretField(parts[2], 1, 31, "day");
    const interpretedMonth = interpretField(parts[3], 1, 12, "month", months);
    const interpretedDayOfWeek = interpretField(
      parts[4],
      0,
      6,
      "day",
      daysOfWeek
    );

    return `At ${interpretedMinute}, ${interpretedHour}, on ${interpretedDayOfMonth} of the month, in ${interpretedMonth}, on ${interpretedDayOfWeek}`;
  }

  function result(value) {
    const meaning = interpretCron(value);
    setCronMeaning(meaning);
    setCronPattern(value);
  }

  return (
    <div className="App">
      <div className="relative flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            id="floating_helper1"
            aria-describedby="floating_helper_text1"
            className="block w-full rounded-t-lg px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={(e) => result(e.target.value)}
          />
          <label
            htmlFor="floating_helper1"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Cron Pattern
          </label>
        </div>

        <div className="relative w-full max-w-lg">
          <input
            type="text"
            id="floating_helper2"
            aria-describedby="floating_helper_text2"
            className="block w-full rounded-t-lg px-2.5 pb-2.5 pt-5 text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={cronMeaning}
            readOnly
            style={{
              whiteSpace: "normal",
              overflowWrap: "break-word",
            }}
          />
          <label
            htmlFor="floating_helper2"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            Cron Pattern Meaning
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
