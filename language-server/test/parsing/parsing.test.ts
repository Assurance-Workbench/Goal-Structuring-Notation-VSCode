import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { parseHelper } from "langium/test";
import { createGsnServices } from "../../src/gsn-module.js";
import { GoalStructure, isGoalStructure } from "../../src/generated/ast.js";

let services: ReturnType<typeof createGsnServices>;
let parse:    ReturnType<typeof parseHelper<GoalStructure>>;
let document: LangiumDocument<GoalStructure> | undefined;

beforeAll(async () => {
    services = createGsnServices(EmptyFileSystem);
    parse = parseHelper<GoalStructure>(services.gsnServices);

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Parsing tests', () => {

    test('parse simple GSN model', async () => {
        document = await parse(`
            goal_structure: demo;

            goal G01 {
                description: "Top goal";
            }

            strategy ST01 {
                description: "Strategy";
            }
        `);

        const parserErrors = document.parseResult.parserErrors;
        expect(parserErrors.length).toBe(0);
        const goalStructure = document.parseResult.value;
        expect(goalStructure.name).toBe("demo");
        const entities = goalStructure.entities;
        const g01 = entities.at(0);
        expect(g01.name).toBe("G01");

        const st01 = entities.at(1);
        expect(st01.name).toBe("ST01");
    });

    test('parse invalid GSN model', async () => {
        document = await parse(`
            goal_structure: demo;

            goal G01 {
                // missing semi-colon at the end of the next line
                description: "Top goal"
            }

            strategy ST01 {
                description: "Strategy";
            }
        `);

        const parserErrors = document.parseResult.parserErrors;
        expect(parserErrors.length).toBe(1);
        expect(parserErrors[0].message).toBe("Expecting token of type ';' but found `}`.");
    });
});
