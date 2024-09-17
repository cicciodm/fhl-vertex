import * as go from "gojs";
import { VertexLinkingTool } from "./linkingTool";
import { level } from "../levelData/big";

// You can specify options in the Diagram's second argument
// These options not only include Diagram properties, but sub-properties, too.
const myDiagram = new go.Diagram("app", {
  // enable Ctrl-Z to undo and Ctrl-Y to redo
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
});

const { palette, shapes, vertices } = level;

var tool = new VertexLinkingTool(validateLink);
myDiagram.toolManager.linkingTool = tool;

myDiagram.nodeTemplate = new go.Node("Spot", { locationSpot: go.Spot.Center })
  .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify)
  .add(
    new go.Shape("Circle", {
      width: 20,
      height: 20,
      portId: "",
      fill: "lightgrey",
      cursor: "pointer",
      fromLinkable: true,
      toLinkable: true,
    }),
    new go.TextBlock().bind("text")
  );

myDiagram.linkTemplate = new go.Link()
  .bindTwoWay("points", "points")
  .add(new go.Shape({ strokeWidth: 1.5 }));

myDiagram.allowMove = false;

const transformedVertices = Object.entries(vertices).map(([key, value]) => ({
  key: key,
  partOfShapes: value.shapes,
  text: value.shapes.length + 1 + "",
  loc: value.coordinates.join(" "),
}));

console.log("transformedVertices", transformedVertices);

myDiagram.model = new go.GraphLinksModel(transformedVertices);

function validateLink(fromNode: go.Node, toNode: go.Node): void {
  const fromConnected = [...fromNode.findNodesConnected()];
  const toConnected = [...toNode.findNodesConnected()];

  console.log(
    "fromConnected",
    [...fromConnected].map((n) => n.key)
  );
  console.log(
    "toConnected",
    [...toConnected].map((n) => n.key)
  );

  const commonParent = fromConnected.find((n) => toConnected.includes(n));

  if (!commonParent) {
    console.log("No common parent found");
    return;
  }

  console.log(
    "found a triangle with these nodes",
    fromNode.key,
    toNode.key,
    commonParent.key
  );

  const commonShapes = (fromNode.data.partOfShapes as string[]).filter(
    (shape) =>
      toNode.data.partOfShapes.includes(shape) &&
      commonParent.data.partOfShapes.includes(shape)
  );

  if (commonShapes.length === 0) {
    console.log("No common shape found, wrong triangle input");
    return;
  }

  const shapeIndex = commonShapes[0]; // only one shape possible

  const shape = shapes[parseInt(shapeIndex)];
  const color = palette[parseInt(shape.color)];

  const p1 = fromNode.location.copy();
  const p2 = toNode.location.copy();
  const p3 = commonParent.location.copy();
  console.log("Found these locations", p1, p2, p3);

  const path = new go.PathFigure(p1.x, p1.y, true);
  path.add(new go.PathSegment(go.SegmentType.Line, p2.x, p2.y));
  path.add(new go.PathSegment(go.SegmentType.Line, p3.x, p3.y));
  path.add(new go.PathSegment(go.SegmentType.Line, p1.x, p1.y));

  const geometry = new go.Geometry().add(path);

  const tri = new go.Shape({
    geometry: geometry,
    fill: color,
  });

  myDiagram.add(new go.Node().add(tri));

  if (tri.part === null) {
    return;
  }

  tri.part.layerName = "Background";
}
