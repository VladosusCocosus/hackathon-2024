export interface Workflow {
  name: string
  status: "success" | "running" | "not_run" | "failed" | "error" | "failing" | "on_hold" | "canceled" | "unauthorized"
}

export interface Pipeline {
  name: string
  info: Workflow,
}

export interface Projects {
  projects: string[]
}

export class PlatformAdapter {
  async getPipeline (access_token?: string, secret_token?: string):Promise<Pipeline[]> {
   throw new Error("Method not implemented")
  }
}
