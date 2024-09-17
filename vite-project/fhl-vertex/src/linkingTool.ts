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
  private _firstMouseDown: boolean;
  private _horizontal: boolean;

  /**
   * Constructs an PolylineLinkingTool, sets {@link portGravity} to 0, and sets the name for the tool.
   */
  constructor(init?: Partial<LinkingTool>) {
    super();
    this.portGravity = 0; // must click on a target port in order to complete the link
    this.name = "PolylineLinking";
    this._firstMouseDown = false;
    this._horizontal = false;
    if (init) Object.assign(this, init);
    this.temporaryLink = new go.Link({
      layerName: "Tool",
    }).add(new go.Shape({ stroke: "black", strokeWidth: 2 }));
  }

  doMouseUp() {
    const targetPort = this.findTargetPort(true);
    const source = this.originalFromNode;

    if (targetPort !== null && source !== null) {
      const target = targetPort.part;
      if (target !== null) {
        console.log("$$$ target.part", target.data);
        console.log("$$$ source", source.data);

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
    }

    super.doMouseUp();
  }
  //   if (!this.isActive) return;
  //   const target = this.findTargetPort(this.isForwards);
  //   if (target !== null) {
  //     if (this._firstMouseDown) {
  //       super.doMouseUp();
  //     } else {
  //       let pts;
  //       this.removeLastPoint(); // remove temporary point
  //       const spot = this.isForwards ? target.toSpot : target.fromSpot;
  //       if (spot.equals(go.Spot.None)) {
  //         const pt = this.temporaryLink.getLinkPointFromPoint(
  //           target.part as go.Node,
  //           target,
  //           target.getDocumentPoint(go.Spot.Center),
  //           this.temporaryLink.points.elt(this.temporaryLink.points.length - 2),
  //           !this.isForwards
  //         );
  //         this.moveLastPoint(pt);
  //         pts = this.temporaryLink.points.copy();
  //         if (this.temporaryLink.isOrthogonal) {
  //           pts.insertAt(pts.length - 2, pts.elt(pts.length - 2));
  //         }
  //       } else {
  //         // copy the route of saved points, because we're about to recompute it
  //         pts = this.temporaryLink.points.copy();
  //         // terminate the link in the expected manner by letting the
  //         // temporary link connect with the temporary node/port and letting the
  //         // normal route computation take place
  //         if (this.isForwards) {
  //           this.copyPortProperties(
  //             target.part as go.Node,
  //             target,
  //             this.temporaryToNode,
  //             this.temporaryToPort,
  //             true
  //           );
  //           this.temporaryLink.toNode = target.part as go.Node;
  //         } else {
  //           this.copyPortProperties(
  //             target.part as go.Node,
  //             target,
  //             this.temporaryFromNode,
  //             this.temporaryFromPort,
  //             false
  //           );
  //           this.temporaryLink.fromNode = target.part as go.Node;
  //         }
  //         this.temporaryLink.updateRoute();
  //         // now copy the final one or two points of the temporary link's route
  //         // into the route built up in the PTS List.
  //         const natpts = this.temporaryLink.points;
  //         const numnatpts = natpts.length;
  //         if (numnatpts >= 2) {
  //           if (numnatpts >= 3) {
  //             const penult = natpts.elt(numnatpts - 2);
  //             pts.insertAt(pts.length - 1, penult);
  //             if (this.temporaryLink.isOrthogonal) {
  //               pts.insertAt(pts.length - 1, penult);
  //             }
  //           }
  //           const ult = natpts.elt(numnatpts - 1);
  //           pts.setElt(pts.length - 1, ult);
  //         }
  //       }
  //       // save desired route in temporary link;
  //       // insertLink will copy the route into the new real Link
  //       this.temporaryLink.points = pts;
  //       super.doMouseUp();
  //     }
  //   }
  // }
  // /**
  //  * This method overrides the standard link creation method by additionally
  //  * replacing the default link route with the custom one laid out by the user.
  //  */
  // insertLink(
  //   fromnode: go.Node | null,
  //   fromport: go.GraphObject | null,
  //   tonode: go.Node | null,
  //   toport: go.GraphObject | null
  // ) {
  //   const link = super.insertLink(fromnode, fromport, tonode, toport);
  //   if (link !== null && !this._firstMouseDown) {
  //     // ignore natural route by replacing with route accumulated by this tool
  //     link.points = this.temporaryLink.points;
  //   }
  //   return link;
  // }
  // /**
  //  * This supports the "Z" command during this tool's operation to remove the last added point of the route.
  //  * Type ESCAPE to completely cancel the operation of the tool.
  //  */
  // doKeyDown() {
  //   if (!this.isActive) return;
  //   const e = this.diagram.lastInput;
  //   if (
  //     e.commandKey === "z" &&
  //     this.temporaryLink.points.length >
  //       (this.temporaryLink.isOrthogonal ? 4 : 3)
  //   ) {
  //     // undo
  //     // remove a point, and then treat the last one as a temporary one
  //     this.removeLastPoint();
  //     this.moveLastPoint(e.documentPoint);
  //   } else {
  //     super.doKeyDown();
  //   }
  // }
}
