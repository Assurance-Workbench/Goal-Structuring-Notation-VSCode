import { SShapeElement } from 'sprotty-protocol';

export interface SGoalStructureEntityBaseShapeElement extends SShapeElement {
    color : string;
}

export interface SGoalShapeElement extends SGoalStructureEntityBaseShapeElement {
    undeveloped : boolean;
    awayGoal : string;
}