export type Player = "Ben" | "Chris" | "Derek" | "Ryan";

export const players: Player[] = ["Ben", "Chris", "Derek", "Ryan"];

const teamsArr: { driver: Player; items: Player }[] = [];
players.forEach((driver) => {
  players.forEach((items) => {
    if (driver !== items) teamsArr.push({ driver, items });
  });
});
export const teams = teamsArr;

export const trackList = {
  luigiCircuit: "Luigi Circuit",
  peachBeach: "Peach Beach",
  babyPark: "Baby Park",
  dryDryDesert: "Dry Dry Desert",
  mushroomBridge: "Mushroom Bridge",
  marioCircuit: "Mario Circuit",
  daisyCruiser: "Daisy Cruiser",
  waluigiStadium: "Waluigi Stadium",
  sherbetLand: "Sherbet Land",
  mushroomCity: "Mushroom City",
  yoshiCircuit: "Yoshi Circuit",
  dkMountain: "DK Mountain",
  warioColosseum: "Wario Colosseum",
  dinoDinoJungle: "Dino Dino Jungle",
  bowsersCastle: "Bowser's Castle",
  rainbowRoad: "Rainbow Road",
};

export type Track = keyof typeof trackList;

export const tracks = Object.keys(trackList) as unknown as Track;

export const percent = (num: number) => (num * 100).toFixed(0) + "%";
