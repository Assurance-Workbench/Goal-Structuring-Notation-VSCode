import 'sprotty/css/sprotty.css';
import '../css/diagram.css';
import '../css/popup.css';

import { Container, ContainerModule } from 'inversify';
import {
    configureCommand, configureModelElement, ConsoleLogger, CreateElementCommand, HtmlRootImpl,
    HtmlRootView, LogLevel, ManhattanEdgeRouter, overrideViewerOptions, PreRenderedElementImpl,
    PreRenderedView, RectangularNodeView, SGraphView, SLabelView, SModelRootImpl,
    SRoutingHandleImpl, SRoutingHandleView, TYPES, loadDefaultModules, SGraphImpl, SLabelImpl,
    hoverFeedbackFeature, popupFeature, creatingOnDragFeature, editLabelFeature, labelEditUiModule,
    moveFeature, editFeature, SPortImpl
} from 'sprotty';
import { CustomRouter } from './custom-edge-router';
import { CreateTransitionPort, GsnConnectionEdge, GoalNode, SolutionNode, StrategyNode, ContextNode, AssumptionNode, JustificationNode, InvisibleNode } from './model';
import { InvisibleNodeView, PolylineArrowEdgeView, PolylineSourceArrowEdgeView, StrategyNodeView, TriangleButtonView, PortView } from './views';
import { SolutionNodeView } from './views';

const gsnDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    rebind(ManhattanEdgeRouter).to(CustomRouter).inSingletonScope();

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', SGraphImpl, SGraphView, {
        enable: [hoverFeedbackFeature, popupFeature]
    });
    configureModelElement(context, 'node:invisible', InvisibleNode, InvisibleNodeView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'node:goal', GoalNode, RectangularNodeView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'node:solution', SolutionNode, SolutionNodeView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'node:strategy', StrategyNode, StrategyNodeView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'node:context', ContextNode, SolutionNodeView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'node:assumption', AssumptionNode, SolutionNodeView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'node:justification', JustificationNode, SolutionNodeView, {
        disable: [moveFeature]
    });

    configureModelElement(context, 'label', SLabelImpl, SLabelView, {
        enable: [editLabelFeature]
    });
    configureModelElement(context, 'label:xref', SLabelImpl, SLabelView, {
        enable: [editLabelFeature]
    });
    configureModelElement(context, 'edge', GsnConnectionEdge, PolylineArrowEdgeView, {
        enable: [editFeature]
    });
    configureModelElement(context, 'edge:reverse', GsnConnectionEdge, PolylineSourceArrowEdgeView, {
        enable: [editFeature]
    });
    configureModelElement(context, 'port:north', SPortImpl, PortView, {
        enable: [editFeature]
    });
    configureModelElement(context, 'port:south', SPortImpl, PortView, {
        enable: [editFeature]
    });
    configureModelElement(context, 'port:east', SPortImpl, PortView, {
        enable: [editFeature]
    });
    configureModelElement(context, 'port:west', SPortImpl, PortView, {
        enable: [editFeature]
    });
    configureModelElement(context, 'html', HtmlRootImpl, HtmlRootView);
    configureModelElement(context, 'pre-rendered', PreRenderedElementImpl, PreRenderedView);
    configureModelElement(context, 'palette', SModelRootImpl, HtmlRootView);
    configureModelElement(context, 'routing-point', SRoutingHandleImpl, SRoutingHandleView);
    configureModelElement(context, 'volatile-routing-point', SRoutingHandleImpl, SRoutingHandleView);
    configureModelElement(context, 'port', CreateTransitionPort, TriangleButtonView, {
        enable: [popupFeature, creatingOnDragFeature]
    });

    configureCommand(context, CreateElementCommand);
});

export function createGsnDiagramContainer(widgetId: string): Container {
    const container = new Container();
    loadDefaultModules(container, { exclude: [ labelEditUiModule ] });
    container.load(gsnDiagramModule);
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    });
    return container;
}
