using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using CommandLine;
using Rectest.TestRunner;

using var apiClient = new RectestApiClient("test");
await apiClient.SaveTestResultAsync(new TestRunResult(
    Total: 10,
    Success: 10,
    Failed: 3,
    Tests: new []{
        new TestResult("foo", true, null, Convert.ToBase64String(File.ReadAllBytes(@"C:\Users\Admin\Documents\Trash\Inv\Proj\RectestRunner\20230517173523.d180769d-bb52-479e-8e91-0cce6d5ccd69.mp4"))),
        new TestResult("bar", false, "Error", Convert.ToBase64String(File.ReadAllBytes(@"C:\Users\Admin\Documents\Trash\Inv\Proj\RectestRunner\20230517173549.d180769d-bb52-479e-8e91-0cce6d5ccd69.mp4")))
    }
));

return;

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

if (cli.Record)
{
    string testFileName = string.IsNullOrEmpty(cli.TestName)
        ? DateTime.UtcNow.ToString("yyyyMMddHHmmss") + ".rectest"
        : cli.TestName + ".rectest";
    string testFile = Path.Combine(testsFolder, testFileName);
    var gameProcess = Process.Start(new ProcessStartInfo
    {
        FileName = gameExe,
        WorkingDirectory = gameWd,
        Environment =
            {
                { "RECTEST_RECORD_TEST", testFile },
            }
    }) ?? throw new InvalidOperationException("Couldn't start game process.");

    gameProcess.WaitForExit();

    if (File.Exists(testFile))
    {
        Console.WriteLine("New test was saved to the following file:");
        Console.WriteLine(testFile);
    } else {
        Console.WriteLine("Test wasn't recorded.");
    }
    return;
}

string[] testsFiles = Directory.GetFiles(testsFolder, "*.rectest");

if (testsFiles.Length == 0)
{
    throw new InvalidOperationException("No tests are found in folder " + testsFolder);
}

int successCount = 0;
int failedCount = 0;

string serverAddress = "127.0.0.1:8644";
var server = new TcpListener(IPEndPoint.Parse(serverAddress));
server.Start();

string testRunId = Guid.NewGuid().ToString();

foreach (string test in testsFiles)
{
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

        string? ready = netReader.ReadLine();
        if (ready != "READY")
        {
            throw new InvalidOperationException("Client socket miscommunication: " + ready);
        }

        string recordingFileName = Path.GetFileNameWithoutExtension(test) + "." + testRunId + ".mp4";
        string recordingFile = Path.GetFullPath(recordingFileName);

        using ScreenRecorder screenRecorder = ScreenRecorder.Begin(recordingFile);

        Console.Beep();

        netWriter.WriteLine("GO");

        string? done = netReader.ReadLine();
        if (done != "DONE")
        {
            throw new InvalidOperationException("Client socket miscommunication: " + done);
        }

        screenRecorder.StopRecording();

        string testResult = netReader.ReadLine() ?? throw new InvalidOperationException("No test result reported.");
        if (testResult.StartsWith("ERROR")) {
            failedCount++;
            Console.WriteLine(testResult);
        }
        if (testResult.StartsWith("OK"))
        {
            successCount++;
        }

        gameProcess.Kill();
    }
    catch (Exception ex)
    {
        failedCount++;
        Console.Error.WriteLine("Unhandled exception during test execution.");
        Console.Error.WriteLine(ex.Message);
        Console.Error.WriteLine(ex.StackTrace);
    }
}

Console.WriteLine(failedCount == 0 ? "ALL TESTS PASSED!" : "ERROR!");
Console.WriteLine($"Total {failedCount + successCount}, Passed {successCount}, Failed {failedCount}");

server.Stop();


class Cli
{
    [Option('r', "record", Required = false, HelpText = "Recording mode")]
    public bool Record { get; set; }

    [Option('n', "name", Required = false, HelpText = "New test mode")]
    public string? TestName { get; set; }

    [Option('t', "tests", Required = true, HelpText = "Folder with tests to run")]
    public string TestsPath { get; set; } = null!;

    [Option('g', "game-exe", Required = true, HelpText = "Built game executable")]
    public string ExecutablePath { get; set; } = null!;
}