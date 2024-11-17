import type { GoalStructure } from '../generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { GSNLanguageMetaData } from '../generated/module.js';
import { createGsnServices } from '../gsn-module.js';
import { extractAstNode } from './cli-util.js';
import { generateStatistics } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createGsnServices(NodeFileSystem).gsnServices;
    const model = await extractAstNode<GoalStructure>(fileName, services);
    const generatedFilePath = generateStatistics(model, fileName, opts.destination);
    console.log(chalk.green(`Statistics generated successfully: ${generatedFilePath}`));
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = GSNLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('generates statistics information about the goal-structure')
        .action(generateAction);

    program.parse(process.argv);
}
