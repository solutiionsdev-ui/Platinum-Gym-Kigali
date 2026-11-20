/**
 * Platinum Gym's own photos. For the demo they load straight from the gym's current website.
 * Before going live, copy them into /public (with the gym's OK) and change PHOTO_BASE to "/photos/".
 */
export const PHOTO_BASE = "https://platinumgymkigali.com/assets/";

export const photos = {
  reception: "pixieset/ps-04.jpg", // logo wall at the entrance
  floorWide: "gallery/gym-01.jpg", // weights floor, wide
  floorDark: "pixieset/ps-05.jpg",
  coachDumbbells: "pixieset/ps-09.jpg",
  dumbbellHand: "pixieset/ps-12.jpg",
  technogym: "gallery/gym-07.jpg",
  machineRow: "pixieset/ps-08.jpg",
  machineCable: "pixieset/ps-15.jpg",
  machinePull: "pixieset/ps-02.jpg",
  cardioBikes: "pixieset/ps-01.jpg",
  cardioClimber: "pixieset/ps-07.jpg",
  cardioRun: "pixieset/ps-13.jpg",
  cardioWalk: "pixieset/ps-10.jpg",
  studioMural: "pixieset/ps-11.jpg",
  studioBag: "pixieset/ps-14.jpg",
  stretching: "gallery/gym-08.jpg",
  coachBack: "pixieset/ps-03.jpg",
  team: "class-2.jpg",
  liftingMan: "gallery/gym-09.jpg",
  floorPair: "gallery/gym-03.jpg",
  legs: "pixieset/ps-06.jpg",
  open24: "24hour.png",
} as const;

export type PhotoKey = keyof typeof photos;
export const photoUrl = (key: PhotoKey) => PHOTO_BASE + photos[key];
