import {
    CreatingOnDrag, EdgePlacement, ManhattanEdgeRouter, RectangularNode, RectangularPort,
    SEdgeImpl, SLabelImpl, SRoutableElementImpl
} from 'sprotty';
import { Action, CreateElementAction, SEdge } from 'sprotty-protocol';

export class GsnConnectionEdge extends SEdgeImpl {
    override routerKind = ManhattanEdgeRouter.KIND;
    override targetAnchorCorrection = Math.sqrt(5);
}

export class GsnConnectionEdgeLabel extends SLabelImpl {
    override edgePlacement = <EdgePlacement> {
        rotate: true,
        position: 0.6
    };
}

export class InvisibleNode extends RectangularNode {
    override canConnect(routable: SRoutableElementImpl, role: string) {
        return true;
    }
}

export class GoalNode extends RectangularNode {
    override canConnect(routable: SRoutableElementImpl, role: string) {
        return true;
    }
}

export class StrategyNode extends RectangularNode {
    override canConnect(routable: SRoutableElementImpl, role: string) {
        return true;
    }
}

export class SolutionNode extends RectangularNode {
    override canConnect(routable: SRoutableElementImpl, role: string) {
        return true;
    }
}

export class ContextNode extends RectangularNode {
    override canConnect(routable: SRoutableElementImpl, role: string) {
        return true;
    }
}

export class AssumptionNode extends RectangularNode {
    override canConnect(routable: SRoutableElementImpl, role: string) {
        return true;
    }
}

export class JustificationNode extends RectangularNode {
    override canConnect(routable: SRoutableElementImpl, role: string) {
        return true;
    }
}

export class CreateTransitionPort extends RectangularPort implements CreatingOnDrag {
    createAction(id: string): Action {
        const edge: SEdge = {
            id,
            type: 'edge',
            sourceId: this.parent.id,
            targetId: this.id
        };
        return CreateElementAction.create(edge, { containerId: this.root.id });
    }
}


