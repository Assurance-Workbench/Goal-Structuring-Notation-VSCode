# Goal Structuring Notation

An implementation of the Goal Structuring Notation language as plugin for VS Code. 
It is an experiment about "Structured-Arguments-as-Code".

It uses a [Langium](https://langium.org)-based language server and [Sprotty](https://github.com/eclipse-sprotty/sprotty-vscode) diagram.

## Build

Install dependencies (after clone/clean):

```bash
yarn --ignore-engines
```

Run the build:

```bash
cd language_server
npm run langium:generate
cd ..
yarn build
```

## Build the VS Code Extension

Open VS Code in "extension" directory and run 

```
vsce package
```


## Usage Example

[Usage Example Here](./extension/README.md)