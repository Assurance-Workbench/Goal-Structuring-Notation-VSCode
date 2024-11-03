import * as path from 'path';
import {
    SprottyDiagramIdentifier, WebviewContainer, WebviewEndpoint, createFileUri, createWebviewHtml as doCreateWebviewHtml,
    registerDefaultCommands, registerLspEditCommands
} from 'sprotty-vscode';
import { LspSprottyEditorProvider, LspWebviewEndpoint } from 'sprotty-vscode/lib/lsp';
import { addLspLabelEditActionHandler, addWorkspaceEditActionHandler } from 'sprotty-vscode/lib/lsp/editing';
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

let languageClient: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
    languageClient = createLanguageClient(context);
    const extensionPath = context.extensionUri.fsPath;
    const localResourceRoots = [createFileUri(extensionPath, 'pack', 'diagram')];
    const createWebviewHtml = (identifier: SprottyDiagramIdentifier, container: WebviewContainer) => doCreateWebviewHtml(identifier, container, {
        scriptUri: createFileUri(extensionPath, 'pack', 'diagram', 'main.js'),
        cssUri: createFileUri(extensionPath, 'pack', 'diagram', 'main.css')
    });
    const configureEndpoint = (endpoint: WebviewEndpoint) => {
        addWorkspaceEditActionHandler(endpoint as LspWebviewEndpoint);
        addLspLabelEditActionHandler(endpoint as LspWebviewEndpoint);
    };

    // Set up webview editor associated with file type
    const webviewEditorProvider = new LspSprottyEditorProvider({
        extensionUri: context.extensionUri,
        viewType: 'gsn',
        languageClient,
        supportedFileExtensions: ['.gsn'],
        localResourceRoots,
        createWebviewHtml,
        configureEndpoint
    });
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider('gsn', webviewEditorProvider, {
            webviewOptions: { retainContextWhenHidden: true }
        })
    );
    registerDefaultCommands(webviewEditorProvider, context, { extensionPrefix: 'gsn' });
    registerLspEditCommands(webviewEditorProvider, context, { extensionPrefix: 'gsn' });
}

function createLanguageClient(context: vscode.ExtensionContext): LanguageClient {
    const serverModule = context.asAbsolutePath(path.join('pack', 'language-server', 'src', 'main.cjs'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging.
    // By setting `process.env.DEBUG_BREAK` to a truthy value, the language server will wait until a debugger is attached.
    const debugOptions = { execArgv: ['--nolazy', `--inspect${process.env.DEBUG_BREAK ? '-brk' : ''}=${process.env.DEBUG_SOCKET || '6009'}`] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    };

    const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.gsn');
    context.subscriptions.push(fileSystemWatcher);

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'gsn' }],
        synchronize: {
            // Notify the server about file changes to files contained in the workspace
            fileEvents: fileSystemWatcher
        }
    };

    // Create the language client and start the client.
    const languageClient = new LanguageClient(
        'gsn',
        'gsn',
        serverOptions,
        clientOptions
    );

    // Start the client. This will also launch the server
    languageClient.start();
    return languageClient;
}

export async function deactivate(): Promise<void> {
    if (languageClient) {
        await languageClient.stop();
    }
}
