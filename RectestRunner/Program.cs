using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using CommandLine;
using Rectest.TestRunner;

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
    }
    else
    {
        Console.WriteLine("Test wasn't recorded.");
    }
    return;
}

string[] testsFiles = Directory.GetFiles(testsFolder, "*.rectest");

if (testsFiles.Length == 0)
{
    throw new InvalidOperationException("No tests are found in folder " + testsFolder);
}

var testResults = new List<TestResult>();

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
        string perf = System.Text.Json.JsonSerializer.Serialize(ProcessPerfMonitor.GetPerformace(gameProcess));

        string? done = netReader.ReadLine();
        if (done != "DONE")
        {
            throw new InvalidOperationException("Client socket miscommunication: " + done);
        }

        screenRecorder.StopRecording();

        string testResult = netReader.ReadLine() ?? throw new InvalidOperationException("No test result reported.");
        if (testResult.StartsWith("ERROR"))
        {
            testResults.Add(new TestResult(
                TestFile: Path.GetFileNameWithoutExtension(test),
                IsSuccess: false,
                ErrorMessage: testResult,
                RecordingFileBase64: Convert.ToBase64String(File.ReadAllBytes(recordingFile)),
                PerformanceJson: perf
            ));
            File.Delete(recordingFile);
            Console.WriteLine(testResult);
        }
        if (testResult.StartsWith("OK"))
        {
            testResults.Add(new TestResult(
                TestFile: Path.GetFileNameWithoutExtension(test),
                IsSuccess: true,
                ErrorMessage: null,
                RecordingFileBase64: Convert.ToBase64String(File.ReadAllBytes(recordingFile)),
                PerformanceJson: perf
            ));
            File.Delete(recordingFile);
        }


        gameProcess.Kill();
    }
    catch (Exception ex)
    {
        testResults.Add(new TestResult(
            TestFile: Path.GetFileNameWithoutExtension(test),
            IsSuccess: false,
            ErrorMessage: "Unhandled exception during test execution",
            RecordingFileBase64: string.Empty,
            PerformanceJson: null
        ));
        Console.Error.WriteLine("Unhandled exception during test execution.");
        Console.Error.WriteLine(ex.Message);
        Console.Error.WriteLine(ex.StackTrace);
    }
}

using var apiClient = new RectestApiClient(cli.ApiKey);
var runResult = new TestRunResult(
    Total: testResults.Count,
    Success: testResults.Count(t => t.IsSuccess),
    Failed: testResults.Count(t => !t.IsSuccess),
    TestsResults: testResults
);
await apiClient.SaveTestResultAsync(runResult);

Console.WriteLine(runResult.Failed == 0 ? "ALL TESTS PASSED!" : "ERROR!");
Console.WriteLine($"Total {runResult.Total}, Passed {runResult.Success}, Failed {runResult.Failed}");

server.Stop();
