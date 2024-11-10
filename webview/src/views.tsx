/** @jsx svg */
import { injectable } from 'inversify';
import { VNode } from 'snabbdom';
import { PolylineEdgeView, RenderingContext, SEdgeImpl, svg, IView, SPortImpl } from 'sprotty';
import { Point, toDegrees } from 'sprotty-protocol';
import { SGoalShapeElement } from '../../language-server/src/diagram-generator-shapes';

@injectable()
export class PolylineArrowEdgeView extends PolylineEdgeView {

    protected override renderAdditionals(edge: SEdgeImpl, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        return [
            <path class-sprotty-edge-arrow={true} d='M 6,-3 L 0,0 L 6,3 Z'
                  transform={`rotate(${this.angle(p2, p1)} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
        ];
    }

    angle(x0: Point, x1: Point): number {
        return toDegrees(Math.atan2(x1.y - x0.y, x1.x - x0.x));
    }
}

@injectable()
export class PolylineSourceArrowEdgeView extends PolylineEdgeView {

    protected override renderAdditionals(edge: SEdgeImpl, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[1];
        const p2 = segments[0];
        return [
            <path class-sprotty-edge-arrow={true} d='M 6,-3 L 0,0 L 6,3 Z'
                  transform={`rotate(${this.angle(p2, p1)} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
        ];
    }

    angle(x0: Point, x1: Point): number {
        return toDegrees(Math.atan2(x1.y - x0.y, x1.x - x0.x));
    }
}

@injectable()
export class TriangleButtonView implements IView {
    render(model: SPortImpl, context: RenderingContext): VNode {
        return <path class-sprotty-button={true} d='M 0,0 L 8,4 L 0,8 Z' />;
    }
}

///////////////////// GSN Shapes //////////////////////////////

import { Hoverable, Selectable } from 'sprotty-protocol/lib/model';
import { RectangularNodeView, SNodeImpl, SShapeElementImpl, IViewArgs, Diamond } from 'sprotty';

@injectable()
export class GoalNodeView extends RectangularNodeView {
    override render(node: Readonly<SShapeElementImpl & Hoverable & Selectable>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        const diamondSize = (node as unknown as SGoalShapeElement).undeveloped ? 16 : 0;
        const diamond = new Diamond({ height: diamondSize, width: diamondSize, x: Math.max(node.size.width / 2 - (diamondSize / 2), 0), y: Math.max(node.size.height, 0) });
        const diamondPoints = `${svgStr(diamond.topPoint)} ${svgStr(diamond.rightPoint)} ${svgStr(diamond.bottomPoint)} ${svgStr(diamond.leftPoint)}`;
        return <g>
            <rect class-sprotty-node={node instanceof SNodeImpl} class-sprotty-port={node instanceof SPortImpl}
                  class-mouseover={node.hoverFeedback} class-selected={node.selected}
                  x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)}></rect>

            <polygon class-sprotty-node={node instanceof SNodeImpl} points={diamondPoints}/>
            {context.renderChildren(node)}
        </g>;
    }
}

function svgStr(point: Point) {
    return `${point.x},${point.y}`;
}

@injectable()
export class SolutionNodeView extends RectangularNodeView {
    override render(node: Readonly<SShapeElementImpl & Hoverable & Selectable>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        const radius_x = node.size.width / 2;
        const radius_y = node.size.height / 2;
        return <g>
            <ellipse class-sprotty-node={node instanceof SNodeImpl} class-sprotty-port={node instanceof SPortImpl}
                    rx={radius_x} ry={radius_y} cx={radius_x} cy={radius_y}></ellipse>
            {context.renderChildren(node)}
        </g>;
    }

    protected getRadius(node: SShapeElementImpl): number {
        const d = Math.max(node.size.width, node.size.height);
        return d > 0 ? d / 2 : 0;
    }
}

export class InvisibleNodeView extends RectangularNodeView {

    override render(node: SNodeImpl, context: RenderingContext): VNode {
        return <g>
            {context.renderChildren(node)}
        </g>;
    }
}

@injectable()
export class StrategyNodeView extends RectangularNodeView {
    override render(node: Readonly<SShapeElementImpl & Hoverable & Selectable>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        const width = Math.trunc(node.bounds.width);
        const height = Math.trunc(node.bounds.height);
        let x = Math.trunc(node.bounds.x);
        let y = Math.trunc(node.bounds.y);
        x = 0;
        y = 0;
        let coords = 'M' + x + ' ' + y + ' L ' + (x - 10) + ' ' + (y + height) + ' L ' + (x + width - 10) + ' ' + (y + height) + ' L ' + (x + width) + ' ' + y + 'Z';
        return <g>
            <path class-sprotty-node={node instanceof SNodeImpl} class-sprotty-port={node instanceof SPortImpl}
                    d={coords}></path>
            {context.renderChildren(node)}
        </g>;
    }

    protected getRadius(node: SShapeElementImpl): number {
        const d = Math.max(node.size.width, node.size.height);
        return d > 0 ? d / 2 : 0;
    }
}

@injectable()
export class PortView implements IView {
    render(model: SPortImpl, context: RenderingContext): VNode {
        return <g />;
    }
}