using System.Net.Http.Json;

namespace Rectest.TestRunner
{
    public class RectestApiClient : IDisposable
    {
        private readonly HttpClient apiClient;

        public RectestApiClient(string apiKey)
        {
            apiClient = new HttpClient()
            {
                BaseAddress = new Uri($"http://localhost:3000/api/project/{apiKey}/")
            };
        }

        public async Task SaveTestResultAsync(TestRunResult result)
        {
            using var request = new HttpRequestMessage(HttpMethod.Post, "test")
            {
                Content = JsonContent.Create(result)
            };
            using var response = await apiClient.SendAsync(request);

            response.EnsureSuccessStatusCode();
        }

        public void Dispose()
        {
            apiClient.Dispose();
        }
    }

    public record TestRunResult(
        int Total,
        int Success,
        int Failed,
        IEnumerable<TestResult> Tests
    );

    public record TestResult(
        string TestFile,
        bool IsSuccess,
        string? ErrorMessage,
        string RecordingFileBase64
    );
}