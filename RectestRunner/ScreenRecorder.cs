using System.Diagnostics;

namespace Rectest.TestRunner
{
    public class ScreenRecorder : IDisposable
    {
        private Process? ffmpegProcess;
        private bool isDisposed;

        public static ScreenRecorder Begin(string recordingFileName)
        {
            Process screenRecordingProcess = Process.Start(new ProcessStartInfo
            {
                FileName = "powershell",
                ArgumentList = { "./lib/ffmpeg.exe", "-f", "gdigrab", "-framerate", "30", "-i", "desktop", recordingFileName, "-y" },
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardInput = true,
            }) ?? throw new InvalidOperationException("Couldn't start ffmpeg process.");

            return new ScreenRecorder
            {
                ffmpegProcess = screenRecordingProcess
            };
        }

        public void StopRecording()
        {
            if (ffmpegProcess == null)
            {
                throw new InvalidOperationException("Already stopped.");
            }
            ffmpegProcess.StandardInput.Write("q");
            ffmpegProcess.StandardInput.Close();
            ffmpegProcess.WaitForExit();
            ffmpegProcess = null;
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!isDisposed)
            {
                ffmpegProcess?.Kill();
                ffmpegProcess = null;

                isDisposed = true;
            }
        }

        ~ScreenRecorder()
        {
            Dispose(disposing: false);
        }

        public void Dispose()
        {
            Dispose(disposing: true);
            GC.SuppressFinalize(this);
        }
    }
}