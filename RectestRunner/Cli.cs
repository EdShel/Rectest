using CommandLine;

public class Cli
{
    [Option('a', "apiKey", Required = true, HelpText = "API key from Rectest dashboard")]
    public string ApiKey { get; set; } = null!;

    [Option('r', "record", Required = false, HelpText = "Recording mode")]
    public bool Record { get; set; }

    [Option('n', "name", Required = false, HelpText = "New test name")]
    public string? TestName { get; set; }

    [Option('t', "tests", Required = true, HelpText = "Folder with tests to run")]
    public string TestsPath { get; set; } = null!;

    [Option('g', "game-exe", Required = true, HelpText = "Built game executable")]
    public string ExecutablePath { get; set; } = null!;
}