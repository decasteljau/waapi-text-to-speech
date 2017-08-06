# Text To Speech From Wwise
## Overview

This samples demonstrates how to generate WAV files from a text-to-speech from Wwise directly.

## Requirements

1. [Node.js](https://nodejs.org)
1. [git](https://git-scm.com/downloads)
1. Windows operating system

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

## Adding this script as an external editor

1. To do

## How it works

The source code is located in [index.ts](index.ts). 

This script is normally executed from the current selection. It will retrieve the selection from Wwise and generate a WAV file for each selected Sound objects. The WAV files will be automatically imported in the project.