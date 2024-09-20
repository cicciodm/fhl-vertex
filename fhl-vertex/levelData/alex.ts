export const level = {
  palette: [
    "#FAE2C3", // light beige for body
    "#F9D9B4", // light peach for ears
    "#F2B49D", // pink for the inner ears
    "#EEA59C", // darker peach for head
    "#EF868D", // pink for tail
    "#EF95A7", // pinkish shading
    "#E46F84", // darker shading
    "#CF5F73", // accents
  ],
  shapes: [
    { color: "0", vertices: [1, 2, 3] }, // left ear outer
    { color: "1", vertices: [2, 3, 4] }, // right ear outer
    { color: "2", vertices: [0, 1, 2] }, // head (top part)
    { color: "3", vertices: [0, 2, 5] }, // head (bottom part)
    { color: "4", vertices: [6, 7, 8] }, // body (top left)
    { color: "5", vertices: [7, 8, 9] }, // body (top right)
    { color: "6", vertices: [8, 9, 10] }, // body (bottom left)
    { color: "7", vertices: [9, 10, 11] }, // body (bottom right)
    { color: "8", vertices: [12, 13, 14] }, // tail (curve 1)
    { color: "9", vertices: [13, 14, 15] }, // tail (curve 2)
    { color: "10", vertices: [16, 17, 18] }, // leg (left)
    { color: "11", vertices: [17, 18, 19] }, // leg (right)
    { color: "12", vertices: [20, 21, 22] }, // eyes (left)
    { color: "13", vertices: [21, 22, 23] }, // eyes (right)
    { color: "14", vertices: [24, 25, 26] }, // nose
    { color: "15", vertices: [27, 28, 29] }, // mouth
    // Add more shapes for more details (fur shading, whiskers, etc.)
  ],
  vertices: {
    // Head and facial details
    "0": { coordinates: [120, 40], shapes: ["2", "3"] }, // top of head
    "1": { coordinates: [80, 20], shapes: ["0", "2"] }, // left ear top
    "2": { coordinates: [120, 20], shapes: ["0", "1", "2"] }, // middle top of head
    "3": { coordinates: [160, 20], shapes: ["1", "2"] }, // right ear top
    "4": { coordinates: [200, 40], shapes: ["1"] }, // right ear bottom
    "5": { coordinates: [120, 80], shapes: ["3"] }, // bottom of head
    // Body details
    "6": { coordinates: [110, 120], shapes: ["4"] }, // upper left of body
    "7": { coordinates: [130, 120], shapes: ["4", "5"] }, // upper right of body
    "8": { coordinates: [110, 160], shapes: ["5", "6"] }, // lower left of body
    "9": { coordinates: [130, 160], shapes: ["6", "7"] }, // lower right of body
    "10": { coordinates: [110, 200], shapes: ["6"] }, // left foot
    "11": { coordinates: [130, 200], shapes: ["7"] }, // right foot
    // Tail details
    "12": { coordinates: [130, 180], shapes: ["8"] }, // base of tail
    "13": { coordinates: [150, 220], shapes: ["8", "9"] }, // curve 1 of tail
    "14": { coordinates: [170, 260], shapes: ["9"] }, // curve 2 of tail
    "15": { coordinates: [190, 300], shapes: ["9"] }, // end of tail
    // Legs and feet
    "16": { coordinates: [100, 170], shapes: ["10"] }, // left leg top
    "17": { coordinates: [120, 190], shapes: ["10", "11"] }, // left leg bottom
    "18": { coordinates: [140, 170], shapes: ["11"] }, // right leg top
    "19": { coordinates: [160, 190], shapes: ["11"] }, // right leg bottom
    // Eyes and facial details
    "20": { coordinates: [110, 50], shapes: ["12"] }, // left eye corner
    "21": { coordinates: [130, 50], shapes: ["12", "13"] }, // middle eye
    "22": { coordinates: [110, 60], shapes: ["13"] }, // right eye corner
    "23": { coordinates: [130, 60], shapes: ["13"] }, // eye bottom
    // Nose and mouth
    "24": { coordinates: [120, 65], shapes: ["14"] }, // nose top
    "25": { coordinates: [130, 65], shapes: ["14"] }, // nose middle
    "26": { coordinates: [120, 70], shapes: ["14"] }, // nose bottom
    "27": { coordinates: [115, 75], shapes: ["15"] }, // mouth left
    "28": { coordinates: [125, 75], shapes: ["15"] }, // mouth right
    "29": { coordinates: [120, 75], shapes: ["15"] }, // mouth middle
    // Additional vertices can be added for more complexity
  },
};
