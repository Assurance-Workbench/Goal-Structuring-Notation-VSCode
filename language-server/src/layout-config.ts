import { LayoutOptions } from 'elkjs';
import { DefaultLayoutConfigurator } from 'sprotty-elk/lib/elk-layout.js';
import { SGraph, SModelIndex, SNode, SPort } from 'sprotty-protocol';

export class GsnLayoutConfigurator extends DefaultLayoutConfigurator {

    protected override graphOptions(sgraph: SGraph, index: SModelIndex): LayoutOptions {
        return {
            "org.eclipse.elk.algorithm": "layered",
            'org.eclipse.elk.direction': 'DOWN',
            'org.eclipse.elk.spacing.nodeNode': '30.0',
            'org.eclipse.elk.layered.spacing.edgeNodeBetweenLayers': '30.0',
            "org.eclipse.elk.portConstraints": "FIXED_SIDE",
            "org.eclipse.elk.spacing.portPort": "0.0",
            "org.eclipse.elk.layered.crossingMinimization.forceNodeModelOrder": "true",
            "org.eclipse.elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
            "org.eclipse.elk.layered.contentAlignment" : "H_CENTER",
        };
    }

    protected override nodeOptions(snode: SNode, index: SModelIndex): LayoutOptions {
        if (snode.type == "node:invisible") {
            return {
                "org.eclipse.elk.alignment": "AUTOMATIC",
                "org.eclipse.elk.layered.mergeEdges": "true",
                'org.eclipse.elk.direction': 'RIGHT',
            }        
        }
        return {
            "org.eclipse.elk.portConstraints": "FIXED_SIDE",
            "org.eclipse.elk.spacing.portPort": "10.0",
            "org.eclipse.elk.alignment": "AUTOMATIC",
            'org.eclipse.elk.portAlignment.default': 'CENTER',
        };
    }

    protected override portOptions(sport: SPort, index: SModelIndex): LayoutOptions {
        var side = "NORTH";
        if (sport.type == "port:south") {
            side = "SOUTH";
        } else if (sport.type == "port:east") {
            side = "EAST";
        } else if (sport.type == "port:west") {
            side = "WEST";
        }
           
        return {
            'org.eclipse.elk.port.side': side
        };
    }

}
