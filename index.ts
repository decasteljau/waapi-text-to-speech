import * as wamp from './wamp-promise';
import { ak } from './waapi';
import {spawn} from 'child_process';
import * as path from 'path';
import * as helpers from './helpers'
import * as async from 'async';
import * as os from 'os';
import * as shell from 'node-powershell';

function onNameChanged(args?: any[], kwargs?: any) {
    // Just received a notification about the name changed
    console.log(`name changed: ${kwargs.object.id}: ${kwargs.newName}`);
}

const generateDir = path.join( os.tmpdir(),'waapi-tts');
const speakScriptPath = path.join( path.dirname(process.argv[1]), 'speak.ps1');

async function main() {

    try {
        // Connect to WAAPI
        // Ensure you enabled WAAPI in Wwise's User Preferences
        var session = await wamp.connect('ws://localhost:8080/waapi');

        var wwiseInfo = await session.call(ak.wwise.core.getInfo, {});
        console.log(`Connected to ${wwiseInfo.displayName} ${wwiseInfo.version.displayName}!`);
        
        // Obtain information about Wwise
        var selection = await session.call(ak.wwise.ui.getSelectedObjects,{},{ return:['id','name','notes','path']});

        console.log(`Retreived ${selection.objects.length} object(s) selected.`);
        console.log(`Using ${speakScriptPath} to generate WAV files.`);

        helpers.ensureDirectoryExistSync(generateDir);
        
        var copy : any[] = [];
        Object.assign(copy, selection.objects);
        async.map(copy, function(item, cb){
            const wavFile = path.join(generateDir,item.name) + '.wav';

            let ps = new shell({
                executionPolicy: 'Bypass',
                noProfile: true });
            ps.addCommand(`Add-Type -AssemblyName System.Speech`);
            ps.addCommand(`$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer`);
            ps.addCommand(`$synth.SetOutputToWaveFile('${wavFile}')`);
            ps.addCommand(`$synth.Speak('${item.notes}')`);
            ps.addCommand(`$synth.Dispose()`);

            ps.invoke();

            ps.on('end', code => {
                console.log(`Successfully generated ${wavFile}`);
                cb(null, {
                    "audioFile": wavFile,
                    "objectPath": `${item.path}\\<AudioFileSource>${item.name}`
                });                
            });
            ps.on('err', err => {

            });
            // .then(output => {
            //     console.log(`Successfully generated ${wavFile}`);
            //     cb(null, {
            //         "audioFile": wavFile,
            //         "objectPath": `${item.path}\\<AudioFileSource>${item.name}`
            //     });
            // },err => {
            //     cb(err);
            // }).catch(err => { 
            //     console.log(err);
            //     ps.dispose();
            //     cb(err);
            // });            

        }, async function(err, result){
            // at the end of the text to speech, import to wwise
            var args = {
                "importOperation": "useExisting",
                "default": {
                    "importLanguage": "SFX"
                },
                "imports": result
            };

            console.log(JSON.stringify(args,null,4));

            var selection = await session.call(ak.wwise.core.audio.import_,args);
            await session.disconnect();
            process.exit();
        });     

        
    }
    catch (e) {
        console.log(e);
    }

    process.exit();
}

main();


