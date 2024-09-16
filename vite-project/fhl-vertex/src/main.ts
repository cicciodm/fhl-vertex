import * as go from "gojs";
import { PolylineLinkingTool } from "./linkingTool";

// You can specify options in the Diagram's second argument
// These options not only include Diagram properties, but sub-properties, too.
const myDiagram = new go.Diagram("app", {
  // enable Ctrl-Z to undo and Ctrl-Y to redo
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
});

// install custom linking tool, defined in PolylineLinkingTool.js
var tool = new PolylineLinkingTool();
//tool.temporaryLink.routing = go.Routing.Orthogonal;  // optional, but need to keep link template in sync, below
myDiagram.toolManager.linkingTool = tool;

myDiagram.nodeTemplate = new go.Node("Spot", { locationSpot: go.Spot.Center })
  .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify)
  .add(
    new go.Shape({
      width: 100,
      height: 100,
      fill: "lightgray",
      portId: "",
      cursor: "pointer",
      fromLinkable: true,
      fromLinkableSelfNode: true,
      fromLinkableDuplicates: true, // optional
      toLinkable: true,
      toLinkableSelfNode: true,
      toLinkableDuplicates: true, // optional
    }).bind("fill"),
    new go.Shape({ width: 70, height: 70, fill: "transparent", stroke: null }),
    new go.TextBlock().bind("text")
  );

myDiagram.linkTemplate = new go.Link({
  reshapable: true,
  resegmentable: true,
  // routing: go.Routing.Orthogonal,  // optional, but need to keep LinkingTool.temporaryLink in sync, above
  adjusting: go.LinkAdjusting.Stretch, // optional
})
  .bindTwoWay("points", "points")
  .add(
    new go.Shape({ strokeWidth: 1.5 }),
    new go.Shape({ toArrow: "OpenTriangle" })
  );

myDiagram.linkTemplate = new go.Link({
  reshapable: true,
  resegmentable: true,
  // routing: go.Routing.Orthogonal,  // optional, but need to keep LinkingTool.temporaryLink in sync, above
  adjusting: go.LinkAdjusting.Stretch, // optional
})
  .bindTwoWay("points", "points")
  .add(
    new go.Shape({ strokeWidth: 1.5 }),
    new go.Shape({ toArrow: "OpenTriangle" })
  );

myDiagram.allowMove = false;

myDiagram.model = new go.GraphLinksModel([
  // for each object in this Array, the Diagram creates a Node to represent it
  { text: "2" },
  { text: "2" },
  { text: "2" },
]);
