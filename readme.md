# Hello Wwise - Typescript Sample
## Overview

This samples demonstrates how to connect to Wwise with the Wwise Authoring API (WAAPI) using Typescript, async/await and Node.js. Clone this project to quickly bootstrap your WAAPI projects.

## Requirements

1. [Node.js](https://nodejs.org)
1. [git](https://git-scm.com/downloads)

## Setup

It works best with Visual Studio Code. Ensure you have typescript 2.x+ installed. Run the following commands.

Install dependencies:

    npm install

Build Typescript:

    tsc -p .

## Execution

First, ensure WAAPI is enabled in Wwise:
 - menu **Project/Preferences**
 - Check **Enable Wwise Authoring API**
 - Click **OK**
 - Restart Wwise

Then, open a Wwise Project.

Run the following commands from the directory containing index.js, or use the built-in debugger in Visual Studio Code.

    node index.js

## The code

The code is located in [index.ts](index.ts). Have fun!