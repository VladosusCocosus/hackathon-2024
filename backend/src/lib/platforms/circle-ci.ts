import axios from "axios";
import {Pipeline, PlatformAdapter} from "./common";

const URL = 'https://circleci.com/api/v2/pipeline'


export class CircleCI extends PlatformAdapter {
  async getPipeline (token?: string): Promise<Pipeline[]> {
    if (!token) {
      return []
    }

    const result: Pipeline[] = []
    type PipelineResponse = {
      items: {
        id: string
        errors: unknown[],
        project_slug: string
        updated_at: string
      }[]
    }

    type WorkflowResponse = {
      items: {
        pipelineId: string
        canceled_by:string,
        name: string
        status: "success" | "running" | "not_run" | "failed" | "error" | "failing" | "on_hold" | "canceled" | "unauthorized"
      }[]
    }


    try {
      const {data} = await axios.get<PipelineResponse>(URL, {
        params: {
          "org-slug": "bitbucket/caremanagment",
          mine: false
        },
        headers: {"Circle-Token": token}
      })

      const filtredItems: PipelineResponse['items'] = []

      for (let i = 0; data.items[i]; i++) {
        if (filtredItems.some((k) => k.project_slug === data.items[i].project_slug)) {
          continue;
        }

        filtredItems.push(data.items[i])
      }

      for (const project of filtredItems) {
        const {data} = await axios.get<WorkflowResponse>(`https://circleci.com/api/v2/pipeline/${project.id}/workflow`, {
          params: {
            "org-slug": "bitbucket/caremanagment"
          },
          headers: {"Circle-Token": token}
        })

        result.push({
          name: project.project_slug,
          info: {
            status: data.items[0].status,
            name: data.items[0].name
          }
        })
      }
    } catch (e) {
      console.log(e)
    }





   return result
  }
}
