grammar GSN

entry GoalStructure:
    'goal_structure' name=ID ';'
    (entities+=GoalStructureEntityBase)*;

Goal:
    'goal' name=ID  '{' 'description:' description=STRING ';' ('color:' color=STRING ';')? supportedByLinks+=SupportedByLink* inContextOfLinks+=InContextOfLink* 
                        (undeveloped?='undeveloped' ';')? 
                        away=AwayLink?
                    '}' ;

Strategy:
    'strategy' name=ID '{' 'description:' description=STRING ';' ('color:' color=STRING ';')? supportedByLinks+=SupportedByLink* '}';

Solution:
    'solution' name=ID '{' 'description:' description=STRING ';' ('color:' color=STRING ';')? '}';

Context:
    'context' name=ID '{' 'description:' description=STRING ';' ('color:' color=STRING ';')? '}';

Assumption:
    'assumption' name=ID '{' 'description:' description=STRING ';' ('color:' color=STRING ';')? '}';

Justification:
    'justification' name=ID '{' 'description:' description=STRING ';' ('color:' color=STRING ';')? '}';

SupportedByLink:
    'supported_by:' gseb+=[GoalStructureEntityBaseSupportedByTarget:ID] (','+ gseb+=[GoalStructureEntityBaseSupportedByTarget:ID])* ';';

InContextOfLink:
    'in_context_of:' gseb+=[GoalStructureEntityBaseContextTarget:ID] (','+ gseb+=[GoalStructureEntityBaseContextTarget:ID])* ';';

AwayLink:
    'away:' goal=[Goal:ID] ';';

GoalStructureEntityBaseSupportedByTarget:
    Goal | Strategy | Solution;

GoalStructureEntityBaseContextTarget:
    Context | Assumption | Justification;

GoalStructureEntityBase:
    Goal | Strategy | Solution | Context | Assumption | Justification;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal STRING: /"[^"]*"|'[^']*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
