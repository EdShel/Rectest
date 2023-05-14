using System.Diagnostics;
using CommandLine;

var parsing = Parser.Default.ParseArguments<Cli>(args);
Cli? cli = parsing.Value;
if (cli == null)
{
    Environment.Exit(-1);
    return;
}

string gameExe = Path.GetFullPath(cli.ExecutablePath);
string gameWd = Path.GetDirectoryName(gameExe) ?? throw new InvalidOperationException("Invalid executable path: " + gameExe);

var gameProcess = Process.Start(new ProcessStartInfo
{
    FileName = gameExe,
    WorkingDirectory = gameWd,
}) ?? throw new InvalidOperationException("Couldn't start game process.");

Thread.Sleep(1000);

Console.Beep();

var screenRecordingProcess = Process.Start(new ProcessStartInfo
{
    FileName = "powershell",
    ArgumentList = { "./lib/ffmpeg.exe", "-f", "gdigrab", "-framerate", "30", "-i", "desktop", "./rec.mp4", "-y" },
    CreateNoWindow = true,
    UseShellExecute = false,
    RedirectStandardInput = true
}) ?? throw new InvalidOperationException("Couldn't start ffmpeg process.");

Thread.Sleep(5000);
Console.Beep();

screenRecordingProcess.StandardInput.Write("q");
screenRecordingProcess.StandardInput.Close();
screenRecordingProcess.WaitForExit();

gameProcess.Kill();

class Cli
{
    // [Option('t', "tests", Required = true, HelpText = "Folder with tests to run")]
    // public string TestsPath { get; set; } = null!;
    [Option('g', "game-exe", Required = true, HelpText = "Built game executable")]
    public string ExecutablePath { get; set; } = null!;
}