/******************************************************************************
 * This file was generated by langium-cli 3.2.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, Reference, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const GSNTerminals = {
    WS: /\s+/,
    ID: /[_a-zA-Z][\w_]*/,
    STRING: /"[^"]*"|'[^']*'/,
    ML_COMMENT: /\/\*[\s\S]*?\*\//,
    SL_COMMENT: /\/\/[^\n\r]*/,
};

export type GSNTerminalNames = keyof typeof GSNTerminals;

export type GSNKeywordNames = 
    | ","
    | ";"
    | "assumption"
    | "away:"
    | "color:"
    | "context"
    | "description:"
    | "goal"
    | "goal_structure"
    | "in_context_of:"
    | "justification"
    | "solution"
    | "strategy"
    | "supported_by:"
    | "undeveloped"
    | "{"
    | "}";

export type GSNTokenNames = GSNTerminalNames | GSNKeywordNames;

export type GoalStructureEntityBase = Assumption | Context | Goal | Justification | Solution | Strategy;

export const GoalStructureEntityBase = 'GoalStructureEntityBase';

export function isGoalStructureEntityBase(item: unknown): item is GoalStructureEntityBase {
    return reflection.isInstance(item, GoalStructureEntityBase);
}

export type GoalStructureEntityBaseContextTarget = Assumption | Context | Justification;

export const GoalStructureEntityBaseContextTarget = 'GoalStructureEntityBaseContextTarget';

export function isGoalStructureEntityBaseContextTarget(item: unknown): item is GoalStructureEntityBaseContextTarget {
    return reflection.isInstance(item, GoalStructureEntityBaseContextTarget);
}

export type GoalStructureEntityBaseSupportedByTarget = Goal | Solution | Strategy;

export const GoalStructureEntityBaseSupportedByTarget = 'GoalStructureEntityBaseSupportedByTarget';

export function isGoalStructureEntityBaseSupportedByTarget(item: unknown): item is GoalStructureEntityBaseSupportedByTarget {
    return reflection.isInstance(item, GoalStructureEntityBaseSupportedByTarget);
}

export interface Assumption extends AstNode {
    readonly $container: GoalStructure;
    readonly $type: 'Assumption';
    color?: string;
    description: string;
    name: string;
}

export const Assumption = 'Assumption';

export function isAssumption(item: unknown): item is Assumption {
    return reflection.isInstance(item, Assumption);
}

export interface AwayLink extends AstNode {
    readonly $container: Goal;
    readonly $type: 'AwayLink';
    goal: Reference<Goal>;
}

export const AwayLink = 'AwayLink';

export function isAwayLink(item: unknown): item is AwayLink {
    return reflection.isInstance(item, AwayLink);
}

export interface Context extends AstNode {
    readonly $container: GoalStructure;
    readonly $type: 'Context';
    color?: string;
    description: string;
    name: string;
}

export const Context = 'Context';

export function isContext(item: unknown): item is Context {
    return reflection.isInstance(item, Context);
}

export interface Goal extends AstNode {
    readonly $container: GoalStructure;
    readonly $type: 'Goal';
    away?: AwayLink;
    color?: string;
    description: string;
    inContextOfLinks: Array<InContextOfLink>;
    name: string;
    supportedByLinks: Array<SupportedByLink>;
    undeveloped: boolean;
}

export const Goal = 'Goal';

export function isGoal(item: unknown): item is Goal {
    return reflection.isInstance(item, Goal);
}

export interface GoalStructure extends AstNode {
    readonly $type: 'GoalStructure';
    entities: Array<GoalStructureEntityBase>;
    name: string;
}

export const GoalStructure = 'GoalStructure';

export function isGoalStructure(item: unknown): item is GoalStructure {
    return reflection.isInstance(item, GoalStructure);
}

export interface InContextOfLink extends AstNode {
    readonly $container: Goal;
    readonly $type: 'InContextOfLink';
    gseb: Array<Reference<GoalStructureEntityBaseContextTarget>>;
}

export const InContextOfLink = 'InContextOfLink';

export function isInContextOfLink(item: unknown): item is InContextOfLink {
    return reflection.isInstance(item, InContextOfLink);
}

export interface Justification extends AstNode {
    readonly $container: GoalStructure;
    readonly $type: 'Justification';
    color?: string;
    description: string;
    name: string;
}

export const Justification = 'Justification';

export function isJustification(item: unknown): item is Justification {
    return reflection.isInstance(item, Justification);
}

export interface Solution extends AstNode {
    readonly $container: GoalStructure;
    readonly $type: 'Solution';
    color?: string;
    description: string;
    name: string;
}

export const Solution = 'Solution';

export function isSolution(item: unknown): item is Solution {
    return reflection.isInstance(item, Solution);
}

export interface Strategy extends AstNode {
    readonly $container: GoalStructure;
    readonly $type: 'Strategy';
    color?: string;
    description: string;
    name: string;
    supportedByLinks: Array<SupportedByLink>;
}

export const Strategy = 'Strategy';

export function isStrategy(item: unknown): item is Strategy {
    return reflection.isInstance(item, Strategy);
}

export interface SupportedByLink extends AstNode {
    readonly $container: Goal | Strategy;
    readonly $type: 'SupportedByLink';
    gseb: Array<Reference<GoalStructureEntityBaseSupportedByTarget>>;
}

export const SupportedByLink = 'SupportedByLink';

export function isSupportedByLink(item: unknown): item is SupportedByLink {
    return reflection.isInstance(item, SupportedByLink);
}

export type GSNAstType = {
    Assumption: Assumption
    AwayLink: AwayLink
    Context: Context
    Goal: Goal
    GoalStructure: GoalStructure
    GoalStructureEntityBase: GoalStructureEntityBase
    GoalStructureEntityBaseContextTarget: GoalStructureEntityBaseContextTarget
    GoalStructureEntityBaseSupportedByTarget: GoalStructureEntityBaseSupportedByTarget
    InContextOfLink: InContextOfLink
    Justification: Justification
    Solution: Solution
    Strategy: Strategy
    SupportedByLink: SupportedByLink
}

export class GSNAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return [Assumption, AwayLink, Context, Goal, GoalStructure, GoalStructureEntityBase, GoalStructureEntityBaseContextTarget, GoalStructureEntityBaseSupportedByTarget, InContextOfLink, Justification, Solution, Strategy, SupportedByLink];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case Assumption:
            case Context:
            case Justification: {
                return this.isSubtype(GoalStructureEntityBase, supertype) || this.isSubtype(GoalStructureEntityBaseContextTarget, supertype);
            }
            case Goal:
            case Solution:
            case Strategy: {
                return this.isSubtype(GoalStructureEntityBase, supertype) || this.isSubtype(GoalStructureEntityBaseSupportedByTarget, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            case 'AwayLink:goal': {
                return Goal;
            }
            case 'InContextOfLink:gseb': {
                return GoalStructureEntityBaseContextTarget;
            }
            case 'SupportedByLink:gseb': {
                return GoalStructureEntityBaseSupportedByTarget;
            }
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case Assumption: {
                return {
                    name: Assumption,
                    properties: [
                        { name: 'color' },
                        { name: 'description' },
                        { name: 'name' }
                    ]
                };
            }
            case AwayLink: {
                return {
                    name: AwayLink,
                    properties: [
                        { name: 'goal' }
                    ]
                };
            }
            case Context: {
                return {
                    name: Context,
                    properties: [
                        { name: 'color' },
                        { name: 'description' },
                        { name: 'name' }
                    ]
                };
            }
            case Goal: {
                return {
                    name: Goal,
                    properties: [
                        { name: 'away' },
                        { name: 'color' },
                        { name: 'description' },
                        { name: 'inContextOfLinks', defaultValue: [] },
                        { name: 'name' },
                        { name: 'supportedByLinks', defaultValue: [] },
                        { name: 'undeveloped', defaultValue: false }
                    ]
                };
            }
            case GoalStructure: {
                return {
                    name: GoalStructure,
                    properties: [
                        { name: 'entities', defaultValue: [] },
                        { name: 'name' }
                    ]
                };
            }
            case InContextOfLink: {
                return {
                    name: InContextOfLink,
                    properties: [
                        { name: 'gseb', defaultValue: [] }
                    ]
                };
            }
            case Justification: {
                return {
                    name: Justification,
                    properties: [
                        { name: 'color' },
                        { name: 'description' },
                        { name: 'name' }
                    ]
                };
            }
            case Solution: {
                return {
                    name: Solution,
                    properties: [
                        { name: 'color' },
                        { name: 'description' },
                        { name: 'name' }
                    ]
                };
            }
            case Strategy: {
                return {
                    name: Strategy,
                    properties: [
                        { name: 'color' },
                        { name: 'description' },
                        { name: 'name' },
                        { name: 'supportedByLinks', defaultValue: [] }
                    ]
                };
            }
            case SupportedByLink: {
                return {
                    name: SupportedByLink,
                    properties: [
                        { name: 'gseb', defaultValue: [] }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    properties: []
                };
            }
        }
    }
}

export const reflection = new GSNAstReflection();
