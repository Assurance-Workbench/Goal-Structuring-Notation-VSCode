import { AstNode, DiagnosticInfo, MultiMap, ValidationAcceptor, ValidationChecks } from 'langium';
import { GSNAstType, Goal, SupportedByLink, GoalStructure } from './generated/ast.js';
import { GsnServices } from './gsn-module.js';

export function registerValidationChecks(services: GsnServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.GsnValidator;
    const checks: ValidationChecks<GSNAstType> = {
        Goal: validator.checkGoal,
        GoalStructure: validator.checkUniqueNames,
        SupportedByLink: validator.checkSupportedByLink
    };
    registry.register(checks, validator);
}

export class GsnValidator {

    checkGoal(goal: Goal, accept: ValidationAcceptor): void {
        const goal2Targetlink = new MultiMap<string, SupportedByLink>();
        for (const link of goal.supportedByLinks) {
            for (const gseb of link.gseb) {
                if (gseb.ref?.name) {
                    goal2Targetlink.add(gseb.ref?.name, link);
                }
            }
        }
        for (const name of goal2Targetlink.keys()) {
            const linksWithCommonName = goal2Targetlink.get(name);
            if (linksWithCommonName.length > 1) {
                for (const link of linksWithCommonName) {
                    accept('error', `Multiple links to same entity ${name}`, { node: link, property: 'gseb' });
                }
            }
        }
    }

    checkUniqueNames(gs: GoalStructure, accept: ValidationAcceptor): void {
        this.genericUniqueCheck(gs.entities, accept, 'entities');
    }

    protected genericUniqueCheck<T extends AstNode & { name: string }>(nodes: T[], accept: ValidationAcceptor, what: string) {
        const name2node = new MultiMap<string, T>();
        for (const node of nodes) {
            if (node.name) {
                name2node.add(node.name, node);
            }
        }
        for (const name of name2node.keys()) {
            const nodesWithCommonName = name2node.get(name);
            if (nodesWithCommonName.length > 1) {
                for (const node of nodesWithCommonName) {
                    accept('error', `Multiple ${what} named '${name}'`, <DiagnosticInfo<T>>{ node: node, property: 'name' });
                }
            }
        }
    }

    checkSupportedByLink(link: SupportedByLink, accept: ValidationAcceptor): void {
        link.gseb.forEach(gseb => {
            const target = gseb.ref;
            if (target) {
                const sourceGS = link.$container.$container;
                const targetGS = target.$container;
                if (sourceGS !== targetGS) {
                    accept(
                        'error',
                        `Invalid link target: goal ${target.name} is in a different goal structure ${targetGS?.name}.`,
                        { node: link, property: 'gseb' }
                    );
                }
            }
                
        });
    }

}
