import PocketBase from "pocketbase";
import { data } from "./data";
import { order, tracks } from "./order";

const pb = new PocketBase();

async function main() {
  console.log("Start seeding ...");

  for (let i = 0; i < data.length / 2; i++) {
    const p1 = data[2 * i];
    const p2 = data[2 * i + 1];
    const runback = await pb.collection("Runbacks").create({
      season: p1.season,
      episode: p1.runback,
      link: p1.link || null,
      trackOrder: order[i + 1].map((track) => tracks[track]),
      topScreen: {
        driver: p1.driver,
        items: p1.items,
        kart: p1.kart,
        time: timeToMs(p1.time),
        points: typeof p1.points === "string" ? null : p1.points,
        times: {
          luigiCircuit: timeToMs(p1["Luigi Circuit"]),
          peachBeach: timeToMs(p1["Peach Beach"]),
          babyPark: timeToMs(p1["Baby Park"]),
          dryDryDesert: timeToMs(p1["Dry Dry Desert"]),
          mushroomBridge: timeToMs(p1["Mushroom Bridge"]),
          marioCircuit: timeToMs(p1["Mario Circuit"]),
          daisyCruiser: timeToMs(p1["Daisy Cruiser"]),
          waluigiStadium: timeToMs(p1["Waluigi Stadium"]),
          sherbetLand: timeToMs(p1["Sherbet Land"]),
          mushroomCity: timeToMs(p1["Mushroom City"]),
          yoshiCircuit: timeToMs(p1["Yoshi Circuit"]),
          dkMountain: timeToMs(p1["DK Mountain"]),
          warioColosseum: timeToMs(p1["Wario Colosseum"]),
          dinoDinoJungle: timeToMs(p1["Dino Dino Jungle"]),
          bowsersCastle: timeToMs(p1["Bowser's Castle"]),
          rainbowRoad: timeToMs(p1["Rainbow Road"]),
        },
      },
      bottomScreen: {
        driver: p2.driver,
        items: p2.items,
        kart: p2.kart,
        time: timeToMs(p2.time),
        points: typeof p2.points === "string" ? null : p2.points,
        times: {
          luigiCircuit: timeToMs(p2["Luigi Circuit"]),
          peachBeach: timeToMs(p2["Peach Beach"]),
          babyPark: timeToMs(p2["Baby Park"]),
          dryDryDesert: timeToMs(p2["Dry Dry Desert"]),
          mushroomBridge: timeToMs(p2["Mushroom Bridge"]),
          marioCircuit: timeToMs(p2["Mario Circuit"]),
          daisyCruiser: timeToMs(p2["Daisy Cruiser"]),
          waluigiStadium: timeToMs(p2["Waluigi Stadium"]),
          sherbetLand: timeToMs(p2["Sherbet Land"]),
          mushroomCity: timeToMs(p2["Mushroom City"]),
          yoshiCircuit: timeToMs(p2["Yoshi Circuit"]),
          dkMountain: timeToMs(p2["DK Mountain"]),
          warioColosseum: timeToMs(p2["Wario Colosseum"]),
          dinoDinoJungle: timeToMs(p2["Dino Dino Jungle"]),
          bowsersCastle: timeToMs(p2["Bowser's Castle"]),
          rainbowRoad: timeToMs(p2["Rainbow Road"]),
        },
      },
    });
    console.log(`Created runback with id: ${runback.id}`);
  }
  console.log("Seeding finished.");
}

function timeToMs(time: string) {
  if (time === undefined) return null;
  if (time === "") return null;
  const arr = time.split(/[:.]/).map((num) => parseInt(num));
  return arr[0] * 60 * 1000 + arr[1] * 1000 + arr[2];
}

main()
  .then(async () => {
    // await pb.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    // await pb.$disconnect();
    process.exit(1);
  });
