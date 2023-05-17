using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using UnityEngine;

namespace Assets.Rectest
{
    public static class RInput
    {
        private static TestRecording recordingTest;
        private static TestReplay replayTest;

        private static TcpClient client;

        public static void Init(MonoBehaviour context)
        {
            string rectestRecordTest = Environment.GetEnvironmentVariable("RECTEST_RECORD_TEST");

            if (!string.IsNullOrEmpty(rectestRecordTest))
            {
                CreateNewTest(rectestRecordTest);
                return;
            }

            string rectestRunnerIp = Environment.GetEnvironmentVariable("RECTEST_RUNNER_IP");
            string rectestReplayTest = Environment.GetEnvironmentVariable("RECTEST_REPLAY_TEST");

            if (string.IsNullOrEmpty(rectestRunnerIp) || string.IsNullOrEmpty(rectestReplayTest))
            {
                return;
            }

            string[] ipPort = rectestRunnerIp.Split(':');

            client = new TcpClient(ipPort[0], int.Parse(ipPort[1]));
            var stream = client.GetStream();
            var writer = new StreamWriter(stream) { AutoFlush = true };
            var reader = new StreamReader(stream);

            writer.WriteLine("READY");
            string go = reader.ReadLine();
            if (go != "GO")
            {
                throw new InvalidOperationException("Unexpected command");
            }

            replayTest = new TestReplay();
            string[] fileLines = File.ReadAllLines(rectestReplayTest);
            long testDuration = long.Parse(fileLines[0]);
            replayTest.KeysDown = new List<KeyDownData>();
            replayTest.EventsTriggers = new List<EventTriggerData>();
            replayTest.ReplayedEventsTriggers = new List<EventTriggerData>();
            foreach (string line in fileLines.Skip(1))
            {
                string[] dataParts = line.Split(" ", 3);
                long dataTime = long.Parse(dataParts[0]);
                string dataType = dataParts[1];
                string dataPayload = dataParts[2];

                switch (dataType)
                {
                    case DataType.KeyDown:
                        replayTest.KeysDown.Add(new KeyDownData { Tick = dataTime, Key = Enum.Parse<KeyCode>(dataPayload) });
                        break;
                    case DataType.EventTrigger:
                        replayTest.EventsTriggers.Add(new EventTriggerData { Tick = dataTime, EventName = dataPayload });
                        break;
                }
            }
            replayTest.KeysDownPointer = 0;
            replayTest.StartTime = DateTime.UtcNow;

            context.StartCoroutine(CorStopReplayTest(testDuration));
        }

        private static IEnumerator CorStopReplayTest(long testDuration)
        {
            yield return new WaitForSeconds(TimeSpan.FromTicks(testDuration).Seconds);

            var stream = client.GetStream();
            var writer = new StreamWriter(stream) { AutoFlush = true };
            writer.WriteLine("DONE");

            long epsilon = TimeSpan.FromSeconds(0.25d).Ticks;

            foreach (var recordedEvent in replayTest.EventsTriggers)
            {
                var matchingEvent = replayTest.ReplayedEventsTriggers.FirstOrDefault(
                    e => e.EventName == recordedEvent.EventName
                        && Math.Abs(e.Tick - recordedEvent.Tick) <= epsilon);
                if (matchingEvent == null)
                {
                    string time = TimeSpan.FromTicks(recordedEvent.Tick).ToString(@"hh\:mm\:ss");
                    writer.WriteLine($"ERROR: Event <{recordedEvent.EventName}> wasn't triggered at {time}");
                    Application.Quit();
                    yield break;
                }
            }

            writer.WriteLine("OK");
            Application.Quit();
        }

        public static void Cleanup()
        {
            if (recordingTest == null)
            {
                return;
            }

            Directory.CreateDirectory(Path.GetDirectoryName(recordingTest.FileName));
            File.Delete(recordingTest.FileName);
            using var fs = new FileStream(recordingTest.FileName, FileMode.CreateNew, FileAccess.Write);
            using var sw = new StreamWriter(fs) { AutoFlush = true, NewLine = "\n" };
            sw.WriteLine(RTimer.Now());

            recordingTest.Writer.Flush();
            recordingTest.Writer.BaseStream.Position = 0;
            recordingTest.Writer.BaseStream.CopyTo(fs);
            recordingTest.Writer.Dispose();
            recordingTest = null;
        }

        private static void CreateNewTest(string fileName)
        {
            if (recordingTest != null || replayTest != null)
            {
                throw new InvalidOperationException("Test is already in progress.");
            }

            recordingTest = new TestRecording();
            recordingTest.FileName = fileName;
            recordingTest.StartTime = DateTime.UtcNow;
            recordingTest.Writer = new StreamWriter(new MemoryStream()) { NewLine = "\n" };
        }

        public static bool GetKeyDown(KeyCode key)
        {
            if (replayTest != null)
            {
                int index = replayTest.KeysDown.FindIndex(replayTest.KeysDownPointer, a => a.Key == key);
                if (index == -1)
                {
                    return false;
                }
                long now = RTimer.Now();

                if (replayTest.KeysDown[index].Tick < now)
                {
                    replayTest.KeysDownPointer = index + 1;
                    return true;
                }
                return false;
            }

            bool isKeyDown = Input.GetKeyDown(key);
            if (recordingTest != null && isKeyDown)
            {
                recordingTest.Writer.WriteLine($"{RTimer.Now()} {DataType.KeyDown} {key}");
            }
            return isKeyDown;
        }

        public static void TriggerEvent(string eventName)
        {
            if (recordingTest != null)
            {
                recordingTest.Writer.WriteLine($"{RTimer.Now()} {DataType.EventTrigger} {eventName}");
                return;
            }
            if (replayTest != null)
            {
                replayTest.ReplayedEventsTriggers.Add(new EventTriggerData { Tick = RTimer.Now(), EventName = eventName });
            }
        }

        private static class RTimer
        {
            public static long Now()
            {
                DateTime now = DateTime.UtcNow;
                long ticks = (now - (recordingTest?.StartTime ?? replayTest.StartTime)).Ticks;
                return ticks;
            }
        }

        private class TestRecording
        {
            public string FileName;
            public DateTime StartTime;
            public StreamWriter Writer;
        }

        private class TestReplay
        {
            public DateTime StartTime;
            public List<KeyDownData> KeysDown;
            public List<EventTriggerData> EventsTriggers;
            public List<EventTriggerData> ReplayedEventsTriggers;
            public int KeysDownPointer;
        }

        private class KeyDownData
        {
            public long Tick;
            public KeyCode Key;
        }

        private class EventTriggerData
        {
            public long Tick;
            public string EventName;
        }

        private static class DataType
        {
            public const string KeyDown = "DOWN";
            public const string EventTrigger = "EVENT";
        }
    }
}
