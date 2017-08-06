# Hello Wwise - Typescript Sample
## Overview

This samples demonstrates how to generate WAV files from a text-to-speech from Wwise directly.

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



## The code

The code is located in [index.ts](index.ts). 