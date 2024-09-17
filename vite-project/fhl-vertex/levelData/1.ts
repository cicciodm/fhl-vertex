export const level = {
  palette: ["#2ca619", "#0066ff"],
  shapes: [
    { color: "0", vertices: [0, 1, 2] },
    { color: "1", vertices: [0, 1, 2] },
  ],
  vertices: {
    "0": { coordinates: [0, 0], shapes: ["0", "1"] },
    "1": { coordinates: [0, 300], shapes: ["0"] },
    "2": { coordinates: [300, 300], shapes: ["0", "1"] },
    "3": { coordinates: [300, 0], shapes: ["1"] },
  },
};
