using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unity.VisualScripting;
using UnityEngine;

namespace Assets.Rectest
{
    public static class RInput
    {
        private static TestRecording recordingTest;
        private static TestReplay replayTest;

        public static void CreateNewTest()
        {
            if (recordingTest != null || replayTest != null)
            {
                throw new InvalidOperationException("Test is already in progress.");
            }

            recordingTest = new TestRecording();
            recordingTest.StartTime = DateTime.UtcNow;
            recordingTest.Writer = new StreamWriter(new MemoryStream()) { NewLine = "\n" };
        }

        public static void ReplayTest(string testFilePath)
        {
            if (recordingTest != null || replayTest != null)
            {
                throw new InvalidOperationException("Test is already in progress.");
            }

            replayTest = new TestReplay();
            replayTest.Actions = File.ReadAllLines(testFilePath).Select(line =>
            {
                var l = line.Split(" ");
                return new ReplayAction
                {
                    Tick = long.Parse(l[0]),
                    Key = Enum.Parse<KeyCode>(l[2])
                };
            }).ToArray();
            replayTest.ActionPointer = 0;
            replayTest.StartTime = DateTime.UtcNow;

        }

        public static void StopAndSaveTest(string folder)
        {
            if (recordingTest == null)
            {
                throw new InvalidOperationException("Test wasn't started.");
            }

            string fileName = recordingTest.StartTime.ToString("yyyyMMddHHmmss") + ".rectest";
            string filePath = Path.Combine(folder, fileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            using var fs = new FileStream(filePath, FileMode.CreateNew, FileAccess.Write);
            recordingTest.Writer.Flush();
            recordingTest.Writer.BaseStream.Position = 0;
            recordingTest.Writer.BaseStream.CopyTo(fs);
            recordingTest.Writer.Dispose();
            recordingTest = null;
        }

        public static bool GetKeyDown(KeyCode key)
        {
            if (replayTest != null)
            {
                int index = Array.FindIndex(replayTest.Actions, replayTest.ActionPointer, a => a.Key == key);
                if (index == -1)
                {
                    return false;
                }
                long now = (DateTime.UtcNow - replayTest.StartTime).Ticks;
                if (replayTest.Actions[index].Tick < now)
                {
                    replayTest.ActionPointer = index + 1;
                    return true;
                }
                return false;
            }

            bool isKeyDown = Input.GetKeyDown(key);
            if (recordingTest != null && isKeyDown)
            {
                DateTime now = DateTime.UtcNow;
                long ticks = (now - recordingTest.StartTime).Ticks;
                recordingTest.Writer.WriteLine($"{ticks} DOWN {key}");
            }
            return isKeyDown;
        }

        private class TestRecording
        {
            public DateTime StartTime;
            public StreamWriter Writer;
        }

        private class TestReplay
        {
            public DateTime StartTime;
            public ReplayAction[] Actions;
            public int ActionPointer;
        }

        private class ReplayAction
        {
            public long Tick;
            public KeyCode Key;
        }
    }
}
