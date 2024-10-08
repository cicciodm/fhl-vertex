export const level = {
  palette: [
    "#FAE2C3",
    "#F9D9B4",
    "#F2B49D",
    "#EEA59C",
    "#EF868D",
    "#EF95A7",
    "#E46F84",
    "#CF5F73",
  ],
  shapes: [
    { color: "0", vertices: [0, 3, 4] },
    { color: "1", vertices: [0, 4, 1] },
    { color: "2", vertices: [1, 4, 5] },
    { color: "3", vertices: [1, 5, 2] },
    { color: "4", vertices: [2, 5, 6] },
    { color: "5", vertices: [3, 4, 7] },
    { color: "6", vertices: [4, 5, 7] },
    { color: "7", vertices: [5, 6, 7] },
  ],
  vertices: {
    "0": { coordinates: [70, 0], shapes: ["0", "1"] },
    "1": { coordinates: [150, 0], shapes: ["1", "2", "3"] },
    "2": { coordinates: [230, 0], shapes: ["3", "4"] },
    "3": { coordinates: [0, 100], shapes: ["0", "5"] },
    "4": { coordinates: [90, 100], shapes: ["0", "1", "2", "5", "6"] },
    "5": { coordinates: [190, 100], shapes: ["2", "3", "4", "6", "7"] },
    "6": { coordinates: [280, 100], shapes: ["4", "7"] },
    "7": { coordinates: [150, 300], shapes: ["5", "6", "7"] },
  },
};
