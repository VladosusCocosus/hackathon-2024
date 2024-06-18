export interface Workflow {
  name: string
  status: "success" | "running" | "not_run" | "failed" | "error" | "failing" | "on_hold" | "canceled" | "unauthorized"
}

export interface Pipeline {
  name: string
  info: Workflow,
}

export class PlatformAdapter {
  constructor(token: string) {

  }

  async getPipeline ():Promise<Pipeline[]> {
   throw new Error("Method not implemented")
  }
}
