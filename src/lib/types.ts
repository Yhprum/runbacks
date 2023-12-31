export interface Runback {
  id: string;
  episode: number;
  season: number;
  link: string | null;
  date: Date;
  trackOrder: string[];
  topScreen: Team;
  bottomScreen: Team;
}

interface Team {
  driver: string;
  items: string;
  kart: string;
  time: number | null;
  points: number | null;
  times: Times;
}

interface Times {
  luigiCircuit: number | null;
  peachBeach: number | null;
  babyPark: number | null;
  dryDryDesert: number | null;
  mushroomBridge: number | null;
  marioCircuit: number | null;
  daisyCruiser: number | null;
  waluigiStadium: number | null;
  sherbetLand: number | null;
  mushroomCity: number | null;
  yoshiCircuit: number | null;
  dkMountain: number | null;
  warioColosseum: number | null;
  dinoDinoJungle: number | null;
  bowsersCastle: number | null;
  rainbowRoad: number | null;
}

interface LiveTeam {
  driver: string;
  items: string;
  kart: string;
}

export interface Live {
  id: string;
  topScreen: LiveTeam;
  bottomScreen: LiveTeam;
  topScreenPoints: number;
  bottomScreenPoints: number;
  topScreenTimes: number[];
  bottomScreenTimes: number[];
  trackOrder: string[];
}
