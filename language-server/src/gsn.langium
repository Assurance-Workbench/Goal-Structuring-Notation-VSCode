grammar GSN

entry GoalStructure:
    'goal_structure' name=ID ';'
    (entities+=GoalStructureEntityBase)*;

Goal:
    'goal' name=ID  '{' 'description:' description=STRING ';' supportedByLinks+=SupportedByLink* inContextOfLinks+=InContextOfLink* (undeveloped?='undeveloped' ';')? '}' ;

Strategy:
    'strategy' name=ID '{' 'description:' description=STRING ';' supportedByLinks+=SupportedByLink* '}';

Solution:
    'solution' name=ID '{' 'description:' description=STRING ';' '}';

Context:
    'context' name=ID '{' 'description:' description=STRING ';' '}';

Assumption:
    'assumption' name=ID '{' 'description:' description=STRING ';' '}';

Justification:
    'justification' name=ID '{' 'description:' description=STRING ';' '}';

SupportedByLink:
    'supported_by:' gseb+=[GoalStructureEntityBaseSupportedByTarget:ID] (','+ gseb+=[GoalStructureEntityBaseSupportedByTarget:ID])* ';';

InContextOfLink:
    'in_context_of:' gseb+=[GoalStructureEntityBaseContextTarget:ID] (','+ gseb+=[GoalStructureEntityBaseContextTarget:ID])* ';';

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
