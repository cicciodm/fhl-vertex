import * as go from "gojs";
import { VertexLinkingTool } from "./linkingTool";
import { level } from "../levelData/generated";

// Known bugs:
// You can go under 0 for number of edges
// Only one triangle at the time is ever created

// You can specify options in the Diagram's second argument
// These options not only include Diagram properties, but sub-properties, too.
const myDiagram = new go.Diagram("app", {
  // enable Ctrl-Z to undo and Ctrl-Y to redo
  "undoManager.isEnabled": true,
  "toolManager.mouseWheelBehavior": go.WheelMode.Zoom,
  allowMove: false,
});

const { palette, shapes, vertices } = level as LevelData;

type LevelData = {
  palette: string[];
  shapes: Shape[];
  vertices: Record<string, Vertex>;
};

type Vertex = {
  coordinates: number[];
  shapes: string[];
};

type Shape = {
  color: string;
  vertices: number[];
};

var tool = new VertexLinkingTool(validateLink);
myDiagram.toolManager.linkingTool = tool;
myDiagram.linkTemplate = new go.Link()
  .bindTwoWay("points", "points")
  .add(new go.Shape({ strokeWidth: 1 }));

myDiagram.nodeTemplate = new go.Node("Spot", {
  locationSpot: go.Spot.Center,
  selectionAdorned: false,
})
  .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringify)
  .add(
    new go.Shape("Circle", {
      name: "Selection",
      width: 50,
      height: 50,
      fill: "transparent",
      strokeWidth: 0.5,
      doubleClick: clearAllLinks,
      cursor: "pointer",
      strokeDashArray: [4, 2],
    }),
    new go.Shape("Circle", {
      width: 35,
      height: 35,
      fill: "lightgrey",
      cursor: "pointer",
      fromLinkable: true,
      toLinkable: true,
      portId: "",
      doubleClick: clearAllLinks,
    }).bind("fromMaxLinks", "maxLinks"),
    new go.TextBlock({ cursor: "pointer" }).bind("text")
  );

// This code keeps all nodes at a constant size in the viewport,
// by adjusting for any scaling done by zooming in or out.
// This code ignores simple Parts;
// Links will automatically be rerouted as Nodes change size.
var origscale = NaN;
myDiagram.addDiagramListener(
  "InitialLayoutCompleted",
  (e) => (origscale = myDiagram.scale)
);
myDiagram.addDiagramListener("ViewportBoundsChanged", (e) => {
  if (isNaN(origscale)) return;
  var newscale = myDiagram.scale;
  if (e.subject.scale === newscale) return; // optimization: don't scale Nodes when just scrolling/panning
  myDiagram.skipsUndoManager = true;
  myDiagram.startTransaction("scale Nodes");
  myDiagram.nodes.each((node) => {
    if (node.key) {
      node.scale = origscale / newscale;
    }
  });
  myDiagram.commitTransaction("scale Nodes");
  myDiagram.skipsUndoManager = false;
});

const transformedVertices = Object.entries(vertices).map(([key, value]) => ({
  key: key,
  partOfShapes: value.shapes,
  shapesConfirmedCount: 0,
  text: getNumberOfEdges(value as Vertex) + "",
  maxLinks: getNumberOfEdges(value as Vertex),
  loc: value.coordinates.join(" "),
}));

const solveButton = new go.Node("Vertical", {
  locationSpot: go.Spot.Center,
  location: new go.Point(-100, -100),
}).add(
  new go.TextBlock("Solve Puzzle", { margin: 2 }),
  new go.Panel("Vertical", { margin: 3 }).add(
    go.GraphObject.build("Button", {
      margin: 2,
      click: solvePuzzle,
      height: 35,
      width: 100,
    })
  )
);

myDiagram.model = new go.GraphLinksModel(transformedVertices);
myDiagram.add(solveButton);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function solvePuzzle(): Promise<void> {
  let index = 0;
  while (index < shapes.length) {
    myDiagram.startTransaction("solve puzzle");

    const shape = shapes[index++];

    const color = palette[parseInt(shape.color)];
    const vIndexes = shape.vertices;

    const matchingNodes =
      vIndexes.map((vIndex) =>
        [...myDiagram.nodes].find((n) => n.key === vIndex + "")
      ) || [];

    if (
      matchingNodes.length !== 3 ||
      matchingNodes.every((n) => n === undefined)
    ) {
      console.error("Could not find all nodes for shape", shape);
      continue;
    }

    const p1 = matchingNodes[0]?.location.copy();
    const p2 = matchingNodes[1]?.location.copy();
    const p3 = matchingNodes[2]?.location.copy();

    if (!p1 || !p2 || !p3) {
      console.error("Could not find all locations for shape", shape);
      continue;
    }

    const path = new go.PathFigure(p1.x, p1.y, true);
    path.add(new go.PathSegment(go.SegmentType.Line, p2.x, p2.y));
    path.add(new go.PathSegment(go.SegmentType.Line, p3.x, p3.y));
    path.add(new go.PathSegment(go.SegmentType.Line, p1.x, p1.y));

    const geometry = new go.Geometry().add(path);

    const tri = new go.Shape({
      geometry: geometry,
      fill: color,
      stroke: color,
    });

    myDiagram.add(new go.Node({ locationSpot: go.Spot.Center }).add(tri));

    if (tri.part === null) {
      continue;
    }
    tri.part.layerName = "Background";
    myDiagram.commitTransaction("solve puzzle");

    await delay(50);
  }

  myDiagram.startTransaction("remove all nodes");
  myDiagram.nodes.each((node) => {
    if (node.data?.key !== undefined) {
      myDiagram.remove(node);
    }
  });
  myDiagram.commitTransaction("remove all nodes");
}

function validateLink(fromNode: go.Node, toNode: go.Node): void {
  const fromConnected = [...fromNode.findNodesConnected()];
  const toConnected = [...toNode.findNodesConnected()];

  const commonParent = fromConnected.find((n) => toConnected.includes(n));

  if (!commonParent) {
    return;
  }

  const commonShapes = (fromNode.data.partOfShapes as string[]).filter(
    (shape) =>
      toNode.data.partOfShapes.includes(shape) &&
      commonParent.data.partOfShapes.includes(shape)
  );

  if (commonShapes.length === 0) {
    return;
  }

  myDiagram.startTransaction("create triangle");

  const shapeIndex = commonShapes[0]; // only one shape possible

  const shape = shapes[parseInt(shapeIndex)];
  const color = palette[parseInt(shape.color)];

  const p1 = fromNode.location.copy();
  const p2 = toNode.location.copy();
  const p3 = commonParent.location.copy();

  const path = new go.PathFigure(p1.x, p1.y, true);
  path.add(new go.PathSegment(go.SegmentType.Line, p2.x, p2.y));
  path.add(new go.PathSegment(go.SegmentType.Line, p3.x, p3.y));
  path.add(new go.PathSegment(go.SegmentType.Line, p1.x, p1.y));

  const geometry = new go.Geometry().add(path);

  const tri = new go.Shape({
    geometry: geometry,
    fill: color,
    stroke: color,
  });

  myDiagram.add(new go.Node({ locationSpot: go.Spot.Center }).add(tri));

  if (tri.part === null) {
    return;
  }
  tri.part.layerName = "Background";

  fromNode.data.shapesConfirmedCount++;
  toNode.data.shapesConfirmedCount++;
  commonParent.data.shapesConfirmedCount++;

  // set a property called confirmed on the links between triangles, so they are not deleted
  let links = fromNode.findLinksBetween(toNode);
  links.each((link) => {
    myDiagram.model.setDataProperty(link.data, "confirmed", true);
  });

  links = fromNode.findLinksBetween(commonParent);
  links.each((link) => {
    myDiagram.model.setDataProperty(link.data, "confirmed", true);
  });

  links = toNode.findLinksBetween(commonParent);
  links.each((link) => {
    myDiagram.model.setDataProperty(link.data, "confirmed", true);
  });

  if (
    fromNode.data.shapesConfirmedCount === fromNode.data.partOfShapes.length
  ) {
    myDiagram.remove(fromNode);
  }

  if (toNode.data.shapesConfirmedCount === toNode.data.partOfShapes.length) {
    myDiagram.remove(toNode);
  }

  if (
    commonParent.data.shapesConfirmedCount ===
    commonParent.data.partOfShapes.length
  ) {
    myDiagram.remove(commonParent);
  }
  myDiagram.commitTransaction("create triangle");
}

function clearAllLinks(_e: go.InputEvent | null, obj: go.GraphObject): void {
  myDiagram.startTransaction("clear all links");
  const node = obj.part as go.Node;
  const connectedLinks = [...node.findLinksConnected()];
  connectedLinks.forEach((link) => {
    if (link.data.confirmed) {
      return;
    }
    const toNode = link.toNode as go.Node;
    const toCount = parseInt(toNode.data.text);
    myDiagram.model.setDataProperty(toNode.data, "text", toCount + 1);

    const fromNode = link.fromNode as go.Node;
    const fromCount = parseInt(fromNode.data.text);
    myDiagram.model.setDataProperty(fromNode.data, "text", fromCount + 1);

    myDiagram.remove(link);
  });
  myDiagram.commitTransaction("clear all links");
}

function getNumberOfEdges(vertex: Vertex | string): number {
  if (typeof vertex === "string") {
    vertex = vertices[vertex];
  }
  const strokes: any[] = [];
  for (let shapeIdx of vertex.shapes) {
    for (let shapeVertex of shapes[parseInt(shapeIdx)].vertices) {
      if (vertices[shapeVertex] === vertex) {
        continue;
      }
      const stroke = [vertex, vertices[shapeVertex]];
      if (
        strokes.find(
          (s) =>
            (s[0] === stroke[0] && s[1] === stroke[1]) ||
            (s[0] === stroke[1] && s[1] === stroke[0])
        )
      ) {
        continue;
      }
      strokes.push(stroke);
    }
  }
  return strokes.length;
}
