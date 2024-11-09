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

After installing the VSCode plugin, create a file 'example.gsn' and paste the code below. After that, right-click and select 'Open in Diagram' to visualize the diagram into another view.

```
goal_structure _010_simple_example;

goal Top_Goal {
    description: "The system is sufficiently 
                  safe to operate";
    supported_by: ST_1;
}
                  
strategy ST_1 {
    description: "Argument over 
                  hazards.";
    supported_by: G2, G3, G4;
}

goal G2 {
    description: "Hazard H1 has been 
                  eliminated";
    supported_by: S2;
}

solution S2 {
    description: "The test log 
                  demonstrates
                  the elimination 
                  of {H1}";
}

goal G3 {
    description: "Hazard H2 has been 
                  eliminated";
    supported_by: S3;
}

solution S3 {
    description: "Analyses show 
                  that H2 is 
                  out of scope 
                  in the given 
                  ODD.";
}

goal G4 {
    description: "Hazard H3 has been 
                  eliminated";
    supported_by: S4 ;
}

solution S4 {
    description: "Analyses show 
                  that H3 is out of
                  scope in the
                  given ODD.";
}
```