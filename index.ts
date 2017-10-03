import * as wamp from './wamp-promise';
import * as path from 'path';
import * as async from 'async';
import * as os from 'os';
import * as fs from 'fs-extra'
import { ak } from './waapi';
import {spawn} from 'child_process';

const generateDir = path.join( os.tmpdir(),'waapi-tts');
const speakScriptPath = path.join( path.dirname(process.argv[1]), 'speak.ps1');

async function main() {

    try {
        // Connect to WAAPI
        // Ensure you enabled WAAPI in Wwise's User Preferences. 
        // Refer to readme.md for more information
        var session = await wamp.connect('ws://localhost:8080/waapi');

        var wwiseInfo = await session.call(ak.wwise.core.getInfo, {});
        console.log(`Connected to ${wwiseInfo.displayName} ${wwiseInfo.version.displayName}!`);
        
        // Obtain information about Wwise
        var selection = await session.call(ak.wwise.ui.getSelectedObjects,{},{ return:['id','name','notes','path']});

        console.log(`Retrieved ${selection.objects.length} object(s) selected.`);
        console.log(`Using '${speakScriptPath}' to generate WAV files.`);

        fs.ensureDirSync(generateDir);
        
        var copy : any[] = [];
        Object.assign(copy, selection.objects);
        async.map(copy, function(item, cb){
            const wavFile = path.join(generateDir,item.name) + '.wav';

            console.log(`Writing '${wavFile}' with '${item.notes}'.`);

            try {
                // Use text to speech service in Windows through the powershell 
                var spawned = spawn('powershell.exe', 
                    [ '-executionpolicy', 'bypass', '-File', speakScriptPath, wavFile, item.notes ]);

                spawned.on('close', function (code) {
                    console.log(`Child closes with code ${code}`);

                    // Create a import entry
                    return cb(null, {
                        audioFile: wavFile,
                        objectPath: `${item.path}\\<AudioFileSource>${item.name}`
                    })
                });

                spawned.on('error', function(error:Error) {
                    return cb(new Error(`Spawn error: ${error.message}`));
                });            
            } catch (error) {
                return cb(new Error(`Cannot launch text to speech command: ${error.message}`));
            }

        }, async function(err, result: any){
            // at the end of the text to speech, import to wwise
            var args = {
                "importOperation": "useExisting",
                "default": {
                    "importLanguage": "English(US)"
                },
                "imports": result
            };

            console.log(JSON.stringify(args,null,4));

            // Import with WAAPI
            await session.call(ak.wwise.core.audio.import_,args);

            // Delete temporary
            var audioFiles = result.map(i=>i.audioFile);
            await Promise.all(audioFiles.map(i=>fs.unlink(i)));

            // Quit
            await session.disconnect();
            process.exit();
        });     
        
    }
    catch (e) {
        console.log(`exception:`);
        console.dir(e, {color:true});

        console.log('Press any key to exit');
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));        
    }
}

main();


