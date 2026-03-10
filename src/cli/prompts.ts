import select from "@inquirer/select";

const theme = { prefix: "" };

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Dropdown picker for a calendar date (year → month → day).
export const pickDate = async (): Promise<Date> => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => String(currentYear + i));

  const year = await select({ message: "Select year:", choices: years, theme: theme });
  const month = await select({ message: "Select month:", choices: monthNames, theme: theme });

  const monthIndex = monthNames.indexOf(month);
  const daysInMonth = new Date(Number(year), monthIndex + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));

  const day = await select({ message: "Select day:", choices: days, theme: theme });

  return new Date(Number(year), monthIndex, Number(day));
};

// Dropdown picker for a time (hour → minute in 15-min steps).
export const pickTime = async (): Promise<{ hour: number; minute: number }> => {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  const hour = await select({ message: "Select hour:", choices: hours, theme: theme });
  const minute = await select({ message: "Select minute:", choices: minutes, theme: theme });

  return { hour: Number(hour), minute: Number(minute) };
};
