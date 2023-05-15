using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
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

string testsFolder = Path.GetFullPath(cli.TestsPath);
string[] testsFiles = Directory.GetFiles(testsFolder, "*.rectest");

if (testsFiles.Length == 0)
{
    throw new InvalidOperationException("No tests are found in folder " + testsFolder);
}

int successCount = 0;
int failedCount = 0;
int totalCount = 0;

string serverAddress = "127.0.0.1:8644";
var server = new TcpListener(IPEndPoint.Parse(serverAddress));
server.Start();

foreach (string test in testsFiles)
{
    totalCount++;
    Console.WriteLine("Executing " + test);

    try
    {
        var gameProcess = Process.Start(new ProcessStartInfo
        {
            FileName = gameExe,
            WorkingDirectory = gameWd,
            Environment =
                {
                    { "RECTEST_RUNNER_IP", serverAddress },
                    { "RECTEST_REPLAY_TEST", test },
                }
        }) ?? throw new InvalidOperationException("Couldn't start game process.");

        using var tcpClient = server.AcceptTcpClient();
        using var netStream = tcpClient.GetStream();
        using var netReader = new StreamReader(netStream);
        using var netWriter = new StreamWriter(netStream) { AutoFlush = true };
Console.WriteLine("Before ready");
        string? ready = netReader.ReadLine();
Console.WriteLine("Ready? " + ready);
        if (ready != "READY")
        {
            throw new InvalidOperationException("Client socket miscommunication: " + ready);
        }

        var screenRecordingProcess = Process.Start(new ProcessStartInfo
        {
            FileName = "powershell",
            ArgumentList = { "./lib/ffmpeg.exe", "-f", "gdigrab", "-framerate", "30", "-i", "desktop", "./rec.mp4", "-y" },
            CreateNoWindow = true,
            UseShellExecute = false,
            RedirectStandardInput = true
        }) ?? throw new InvalidOperationException("Couldn't start ffmpeg process.");

        Console.Beep();

        netWriter.WriteLine("GO");

        string? done = netReader.ReadLine();
        if (done != "DONE")
        {
            throw new InvalidOperationException("Client socket miscommunication: " + done);
        }

        Console.Beep();

        screenRecordingProcess.StandardInput.Write("q");
        screenRecordingProcess.StandardInput.Close();
        screenRecordingProcess.WaitForExit();

        gameProcess.Kill();
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine("Unhandled exception during test execution.");
        Console.Error.WriteLine(ex.Message);
        Console.Error.WriteLine(ex.StackTrace);
    }
}

server.Stop();


class Cli
{
    [Option('t', "tests", Required = true, HelpText = "Folder with tests to run")]
    public string TestsPath { get; set; } = null!;

    [Option('g', "game-exe", Required = true, HelpText = "Built game executable")]
    public string ExecutablePath { get; set; } = null!;
}