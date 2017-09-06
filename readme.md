# Text To Speech From Wwise
## Overview

This samples demonstrates how to generate WAV files from a text-to-speech from Wwise directly.

## Requirements

1. [Node.js](https://nodejs.org)
1. [git](https://git-scm.com/downloads)
1. Windows operating system

## Setup

**Note:** This sample requires Windows Powershell, which comes with Windows 10.

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

In Wwise:
1. Open menu: **Project > User Preferences**
1. In the **External Editors**, click **Add...**
1. Browse for the `text-to-speech.cmd` file in this directory
1. Click **OK**

## How it works

The source code is located in [index.ts](index.ts). 

This script is executed as an external editor in Wwise from the current selection. It will retrieve the selection from WAAPI and generate a WAV file for each selected Sound objects using Windows text to speech. The WAV files will be automatically imported in the project with WAAPI.