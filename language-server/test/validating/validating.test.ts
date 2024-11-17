import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { expandToString as s } from "langium/generate";
import { parseHelper } from "langium/test";
import type { Diagnostic } from "vscode-languageserver-types";
import { createGsnServices } from "../../src/gsn-module.js";
import { GoalStructure, isGoalStructure } from "../../src/generated/ast.js";

let services: ReturnType<typeof createGsnServices>;
let parse:    ReturnType<typeof parseHelper<GoalStructure>>;
let document: LangiumDocument<GoalStructure> | undefined;

beforeAll(async () => {
    services = createGsnServices(EmptyFileSystem);
    const doParse = parseHelper<GoalStructure>(services.gsnServices);
    parse = (input: string) => doParse(input, { validation: true });

    // activate the following if your linking test requires elements from a built-in library, for example
    // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
});

describe('Validating', () => {
  
    test('check no errors', async () => {
        document = await parse(`
            goal_structure simple;

            goal G01 {
                description: "some desc";
            }

            goal G02 {
                description: "another desc";
            }

        `);

        const diag : Diagnostic[] = document?.diagnostics;
        expect(diag.length).toBe(0);
    });

    test('check multiple entities with the same name', async () => {
        document = await parse(`
            goal_structure second;

            goal G01 {
                description: "some desc";
            }

            goal G01 {
                description: "another desc";
            }
        `);

        const diag = document?.diagnostics;
        expect(diag.length).toBe(2);
        expect(diag[0].message).toBe("Multiple entities named \'G01\'");
        expect(diag[1].message).toBe("Multiple entities named \'G01\'");
    });
});
