import { startLanguageServer } from 'langium/lsp';
import { NodeFileSystem } from 'langium/node';
import { addDiagramHandler, addDiagramSelectionHandler, addHoverPopupHandler, addTextSelectionHandler } from 'langium-sprotty';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node.js';
import { createGsnServices } from './gsn-module.js';

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all);

// Inject the language services
const { shared, gsnServices: gsn } = createGsnServices({ connection, ...NodeFileSystem });

// Start the language server with the language-specific services
startLanguageServer(shared);
addDiagramHandler(connection, shared);

addDiagramSelectionHandler(gsn);
addTextSelectionHandler(gsn, { fitToScreen: 'none' });
addHoverPopupHandler(gsn);
