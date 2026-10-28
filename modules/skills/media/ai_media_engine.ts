export interface MediaTask {
  script: string;
  mode: "music" | "video" | "transcription";
}

export function buildMediaJob(task: MediaTask): string {
  return `queued:${task.mode}:${task.script.slice(0, 24)}`;
}
