using System.Diagnostics;

public static class ProcessPerfMonitor
{
    public static object GetPerformace(Process process)
    {
        return new
        {
            ProcessorTime = process.TotalProcessorTime,
            ThreadsCount = process.Threads.Count,
            Ram = process.WorkingSet64,
        };
    }
}