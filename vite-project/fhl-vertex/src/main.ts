import * as go from "gojs";
import { VertexLinkingTool } from "./linkingTool";

// You can specify options in the Diagram's second argument
// These options not only include Diagram properties, but sub-properties, too.
const myDiagram = new go.Diagram("app", {
  // enable Ctrl-Z to undo and Ctrl-Y to redo
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
});

var tool = new VertexLinkingTool();
myDiagram.toolManager.linkingTool = tool;

myDiagram.nodeTemplate = new go.Node("Spot", { locationSpot: go.Spot.Center })
  .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify)
  .add(
    new go.Shape("Circle", {
      width: 40,
      height: 40,
      fill: "lightgray",
      portId: "",
      cursor: "pointer",
      fromLinkable: true,
      toLinkable: true,
    }).bind("fill"),
    new go.TextBlock().bind("text")
  );

myDiagram.linkTemplate = new go.Link()
  .bindTwoWay("points", "points")
  .add(new go.Shape({ strokeWidth: 1.5 }));

myDiagram.allowMove = false;

myDiagram.model = new go.GraphLinksModel([
  // for each object in this Array, the Diagram creates a Node to represent it
  { text: "1", loc: "0 0" },
  { text: "2", loc: "0 300" },
  { text: "3", loc: "300 300" },
]);
