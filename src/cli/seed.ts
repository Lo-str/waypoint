import { addActivity, addTrip } from "../services/itinerary.js";

// Testing trips/activities.
export const seedDemoData = (): void => {
  // Stockholm.
  const stockholm = addTrip("Stockholm", "Sweden", new Date("2026-06-10"));
  addActivity(
    stockholm.id,
    "Airport train to city",
    new Date("2026-06-10T10:30:00"),
    "transport",
    18,
  );
  addActivity(
    stockholm.id,
    "Gamla Stan walking tour",
    new Date("2026-06-10T14:00:00"),
    "sightseeing",
    25,
  );
  addActivity(
    stockholm.id,
    "Dinner in Sodermalm",
    new Date("2026-06-10T19:30:00"),
    "food",
    42,
  );
  addActivity(
    stockholm.id,
    "ABBA Museum",
    new Date("2026-06-11T11:00:00"),
    "fun",
    30,
  );

  // Salvador.
  const salvador = addTrip("Salvador", "Brasil", new Date("2026-07-02"));
  addActivity(
    salvador.id,
    "Brasil 28 day pass",
    new Date("2026-07-02T09:00:00"),
    "transport",
    10,
  );
  addActivity(
    salvador.id,
    "Food tasting",
    new Date("2026-07-02T13:00:00"),
    "food",
    35,
  );
  addActivity(
    salvador.id,
    "Museum",
    new Date("2026-07-03T10:00:00"),
    "sightseeing",
    15,
  );
  addActivity(
    salvador.id,
    "Salvador at night",
    new Date("2026-07-03T21:00:00"),
    "fun",
    50,
  );

  // Kyoto.
  const kyoto = addTrip("Kyoto", "Japan", new Date("2026-09-14"));
  addActivity(
    kyoto.id,
    "Bus pass",
    new Date("2026-09-14T08:30:00"),
    "transport",
    8,
  );
  addActivity(
    kyoto.id,
    "Fushimi Inari hike",
    new Date("2026-09-14T10:00:00"),
    "sightseeing",
    0,
  );
  addActivity(
    kyoto.id,
    "Ramen lunch",
    new Date("2026-09-14T13:00:00"),
    "food",
    12,
  );
  addActivity(
    kyoto.id,
    "Tea ceremony",
    new Date("2026-09-15T16:00:00"),
    "fun",
    40,
  );
};
