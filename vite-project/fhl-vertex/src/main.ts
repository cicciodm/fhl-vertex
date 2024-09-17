import * as go from "gojs";
import { VertexLinkingTool } from "./linkingTool";

// You can specify options in the Diagram's second argument
// These options not only include Diagram properties, but sub-properties, too.
const myDiagram = new go.Diagram("app", {
  // enable Ctrl-Z to undo and Ctrl-Y to redo
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
});

const validateLink = (fromNode: go.Node, toNode: go.Node) => {
  console.log("find common parent between", fromNode, toNode);
  console.log(
    "if found, we will draw a shape and remove the nodes and the links"
  );

  const p1 = fromNode.location.copy();
  const p2 = toNode.location.copy();
  const p3 = new go.Point(300, 300); // This should technically be the parent
  console.log("Found these locations", p1, p2, p3);

  const path = new go.PathFigure(p1.x, p1.y, true);
  path.add(new go.PathSegment(go.SegmentType.Line, p2.x, p2.y));
  path.add(new go.PathSegment(go.SegmentType.Line, p3.x, p3.y));
  path.add(new go.PathSegment(go.SegmentType.Line, p1.x, p1.y));

  const geometry = new go.Geometry().add(path);

  const tri = new go.Shape({
    geometry: geometry,
    fill: "green",
  });

  myDiagram.add(new go.Node().add(tri));
};

var tool = new VertexLinkingTool(validateLink);
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
