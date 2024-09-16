// client/main.js
import * as go from "gojs";

// You can specify options in the Diagram's second argument
// These options not only include Diagram properties, but sub-properties, too.
const myDiagram = new go.Diagram("root", {
  // enable Ctrl-Z to undo and Ctrl-Y to redo
  "undoManager.isEnabled": true,
});

myDiagram.model = new go.Model([
  // for each object in this Array, the Diagram creates a Node to represent it
  { text: "Alpha" },
  { text: "Beta" },
  { text: "Gamma" },
]);
