import { AstUtils, DefaultScopeProvider, ReferenceInfo, Scope } from "langium";
import { GSNAstType, GoalStructure } from "./generated/ast.js";

export class GsnScopeProvider extends DefaultScopeProvider {
    override getScope(context: ReferenceInfo): Scope {
        switch(context.container.$type as keyof GSNAstType) {
            case 'InContextOfLink':
                return this.getEntitiesFromCurrentFile(context);
            case 'SupportedByLink':
                return this.getEntitiesFromCurrentFile(context);    
        }
        return super.getScope(context);
    }

    private getEntitiesFromCurrentFile(context: ReferenceInfo) {
        const document = AstUtils.getDocument(context.container);
        const model = document.parseResult.value as GoalStructure;
        const descriptions = model.entities.map(e => 
            this.descriptions.createDescription(e, e.name));
        return this.createScope(descriptions);
    }
}