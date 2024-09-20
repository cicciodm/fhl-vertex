import go, { LinkingTool } from "gojs";
/*
 *  Copyright (C) 1998-2024 by Northwoods Software Corporation. All Rights Reserved.
 */
/*
 * This is an extension and not part of the main GoJS library.
 * Note that the API for this class may change with any version, even point releases.
 * If you intend to use an extension in production, you should copy the code to your own source directory.
 * Extensions can be found in the GoJS kit under the extensions or extensionsJSM folders.
 * See the Extensions intro page (https://gojs.net/latest/intro/extensions.html) for more information.
 */

/**
 * The PolylineLinkingTool class the user to draw a new {@link go.Link} by clicking where the route should go,
 * until clicking on a valid target port.
 *
 * This tool supports routing both orthogonal and straight links.
 * You can customize the {@link go.LinkingBaseTool.temporaryLink} as needed to affect the
 * appearance and behavior of the temporary link that is shown during the linking operation.
 * You can customize the {@link go.LinkingTool.archetypeLinkData} to specify property values
 * that can be data-bound by your link template for the Links that are actually created.
 *
 * If you want to experiment with this extension, try the <a href="../../samples/PolylineLinking.html">Polyline Linking</a> sample.
 * @category Tool Extension
 */
export class VertexLinkingTool extends go.LinkingTool {
  private _validateLink: (fromNode: go.Node, toNode: go.Node) => void;

  /**
   * Constructs an PolylineLinkingTool, sets {@link portGravity} to 0, and sets the name for the tool.
   */
  constructor(
    validateLink: (fromNode: go.Node, toNode: go.Node) => void,
    init?: Partial<LinkingTool>
  ) {
    super();
    this.portGravity = 0; // must click on a target port in order to complete the link
    this.name = "PolylineLinking";
    this._validateLink = validateLink;
    if (init) Object.assign(this, init);

    this.temporaryLink = new go.Link({
      layerName: "Tool",
    }).add(new go.Shape({ stroke: "black", strokeWidth: 1 }));

    this.temporaryFromNode = new go.Node().add(
      new go.Shape("Circle", {
        width: 46,
        height: 46,
        stroke: "red",
        portId: "",
        fill: "transparent",
        strokeWidth: 2,
      })
    );

    this.temporaryToNode = new go.Node().add(
      new go.Shape("Circle", {
        width: 46,
        height: 46,
        stroke: "red",
        portId: "",
        fill: "transparent",
        strokeWidth: 2,
      })
    );
  }

  doMouseUp() {
    const targetPort = this.findTargetPort(true);
    const source = this.originalFromNode;

    if (targetPort !== null && source !== null) {
      const target = targetPort.part;
      if (target !== null) {
        let currentCount = parseInt(target.data.text);
        target.diagram?.model.setDataProperty(
          target.data,
          "text",
          currentCount - 1
        );

        currentCount = parseInt(source.data.text);
        source.diagram?.model.setDataProperty(
          source.data,
          "text",
          currentCount - 1
        );
      }

      const fromNode = this.originalFromNode as go.Node;
      const toNode = targetPort?.part as go.Node;

      super.doMouseUp();
      this._validateLink(fromNode, toNode);
    } else {
      super.doMouseUp();
    }
  }
}
