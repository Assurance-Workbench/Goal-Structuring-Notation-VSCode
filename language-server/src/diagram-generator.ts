import { GeneratorContext, IdCache, LangiumDiagramGenerator } from 'langium-sprotty';
import { SEdge, SPort, SLabel, SModelRoot, SShapeElement, SGraph, SModelElement, SCompartment } from 'sprotty-protocol';
import { Goal, GoalStructure, GoalStructureEntityBase, SupportedByLink, Strategy, isGoal, isSolution, isStrategy, InContextOfLink, isContext, isAssumption, isJustification } from './generated/ast.js';
import { SGoalShapeElement } from './diagram-generator-shapes.js';
import { AstNode } from 'langium';

export class GsnDiagramGenerator extends LangiumDiagramGenerator {

    protected generateRoot(args: GeneratorContext<GoalStructure>): SModelRoot {
        const { document } = args;
        const gs = document.parseResult.value;
        const graph = <SGraph>{
            type: 'graph',
            id: gs.name,
            children: [
                ...gs.entities.filter(e => isGoal(e) || isSolution(e) || isStrategy(e)).map(s => this.generateNode(s, args)),
                ...gs.entities.filter(e => 'supportedByLinks' in e).flatMap(s => (s as Goal | Strategy).supportedByLinks).flatMap(t => this.generateEdge(t, args))
            ]
        };
        this.traceProvider.trace(graph, gs);
        return graph;
    }

    protected generateNode(gseb: GoalStructureEntityBase, ctx: GeneratorContext<GoalStructure>): SModelElement {
        const { idCache } = ctx;
        const nodeId = idCache.uniqueId(gseb.name, gseb);

        var node = this.doGenerateNode(gseb, ctx);

        if(isGoal(gseb) && (gseb as Goal).inContextOfLinks.length > 0) {
            const oldNode = node;
            const contextsAssumptionsJustifications = (gseb as Goal).inContextOfLinks.flatMap(it => it.gseb).map(it1 => this.doGenerateNode(it1.ref as GoalStructureEntityBase, ctx));
            

            const compartment = <SCompartment>{
                type: "node:invisible",
                id: nodeId + "_compartment",
                children: [
                    oldNode,
                    ...contextsAssumptionsJustifications,
                    ...(gseb as Goal).inContextOfLinks.flatMap(t => this.generateEdge(t, ctx))
                ],
                layoutOptions: {
                    paddingTop: 100,
                    paddingBottom: 100,
                    paddingLeft: 100,
                    paddingRight: 100
                }
            };

            return compartment;
        }

        return node;
    }

    private doGenerateNode(gseb: GoalStructureEntityBase, ctx: GeneratorContext<GoalStructure>) : SShapeElement {
        const { idCache } = ctx;
        const nodeId = idCache.uniqueId(gseb.name, gseb);

        let nodeType = "node";
        if (isSolution(gseb))
            nodeType = "node:solution";
        else if (isStrategy(gseb))
            nodeType = "node:strategy";
        else if (isGoal(gseb)) {
            nodeType = "node:goal";
        } else if (isContext(gseb))
            nodeType = "node:context";
        else if (isAssumption(gseb))
            nodeType = "node:assumption";
        else if (isJustification(gseb))
            nodeType = "node:justification";

        const padding = isAssumption(gseb) || isSolution(gseb) || isContext(gseb) || isJustification(gseb) ? 10.0 : 5.0;
        const labelsSplitOnMultiline = this.getDescriptionLabels(gseb.name, gseb.description, idCache)
        const ports = this.getPorts(nodeId, idCache)
        var node = {
            type: nodeType,
            id: nodeId,
            children: [
                <SLabel> {
                    type: "label",
                    id: idCache.uniqueId(nodeId + "_label"),
                    text: gseb.name,
                    cssClasses: ['entity-id']
                },
                ...labelsSplitOnMultiline,
                ...ports,                

            ],
            layout: 'vbox',
            layoutOptions: {
                paddingTop: padding,
                paddingBottom: padding,
                paddingLeft: padding,
                paddingRight: padding
            }
        };
        this.traceProvider.trace(node, gseb);
        this.markerProvider.addDiagnosticMarker(node, gseb, ctx);

        if (isGoal(gseb)) {
            const goal = gseb as Goal;
            var goalNode = <SGoalShapeElement> {
                undeveloped : goal.undeveloped,
                ...node
            }
            return goalNode;
        }

        return node;
    }


    private getPorts(nodeId : string, idCache : IdCache<AstNode>) : SPort[] {
        const ports : SPort[] = [];
        ports.push(<SPort> {
            type: "port:north",
            id: idCache.uniqueId(nodeId + "_north_port")  
        });
        ports.push(<SPort> {
            type: "port:south",
            id: idCache.uniqueId(nodeId + "_south_port")  
        });
        ports.push(<SPort> {
            type: "port:east",
            id: idCache.uniqueId(nodeId + "_east_port")  
        });
        ports.push(<SPort> {
            type: "port:west",
            id: idCache.uniqueId(nodeId + "_west_port")  
        });
        return ports;
    }

    private getDescriptionLabels(nodeId : string, description : string, idCache : IdCache<AstNode>) : SLabel[] {
        const lines = description.split("\n");
        const labels : SLabel[] = [];

        for (const line of lines) {
            labels.push(<SLabel>{
                type: "label",
                id: idCache.uniqueId(nodeId + "_label"),
                text: line,
            });
        }

        return labels;
    }

    protected generateEdge(link: SupportedByLink | InContextOfLink, ctx: GeneratorContext<GoalStructure>): SEdge[] {
        const res : SEdge[] = [];
        const { idCache } = ctx;
        var sourceId = idCache.getId(link.$container);
        link.gseb.forEach(it => {
            var targetId = idCache.getId(it.ref);
            const edgeId = idCache.uniqueId(`${sourceId}:${it.ref?.name}:${targetId}`, link);
            const label: SLabel = {
                type: 'label:xref',
                id: idCache.uniqueId(edgeId + '.label'),
                text: '  '
            }
            this.traceProvider.trace(label, link, 'link');

            var src = isAssumption(it.ref) ? targetId! : sourceId!;
            var tar = isAssumption(it.ref) ? sourceId! : targetId!;

            if (isAssumption(it.ref)) {
                src = src + "_east_port";
                tar = tar + "_west_port";    
            } else if (isContext(it.ref) || isJustification(it.ref)) {
                src = src + "_east_port";
                tar = tar + "_west_port";    
            } else {
                src = src + "_south_port";
                tar = tar + "_north_port";    
            }

            const edgeType = isAssumption(it.ref) ? "edge:reverse" : "edge";

            const edge = <SEdge>{
                type: edgeType,
                id: edgeId,
                sourceId: src,
                targetId: tar,
                children: [
                    label
                ]
            };
            this.traceProvider.trace(edge, link);
            this.markerProvider.addDiagnosticMarker(edge, link, ctx); 
            res.push(edge);        
        });

        return res;
    }

}
