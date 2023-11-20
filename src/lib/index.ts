export type Player = "Ben" | "Chris" | "Derek" | "Ryan";

export const players: Player[] = ["Ben", "Chris", "Derek", "Ryan"];

const teamsArr: { driver: Player; items: Player }[] = [];
players.forEach((driver) => {
  players.forEach((items) => {
    if (driver !== items) teamsArr.push({ driver, items });
  });
});
export const teams = teamsArr;

export const tracks = {
  "Mushroom Cup": ["Luigi Circuit", "Peach Beach", "Baby Park", "Dry Dry Desert"],
  "Flower Cup": ["Mushroom Bridge", "Mario Circuit", "Daisy Cruiser", "Waluigi Stadium"],
  "Star Cup": ["Sherbet Land", "Mushroom City", "Yoshi Circuit", "DK Mountain"],
  "Special Cup": ["Wario Colosseum", "Dino Dino Jungle", "Bowser's Castle", "Rainbow Road"],
};
