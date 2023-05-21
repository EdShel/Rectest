"use client";

interface TestResultProps {
  isSuccess: boolean;
  videoBase64: string;
}

export default function TestResult({ isSuccess, videoBase64 }: TestResultProps) {
  return (
    <div>
      <video src={`data:video/mp4;base64,${videoBase64}`} controls style={{ width: '100%' }} />
    </div>
  );
}
