import axios from "axios";
import {Pipeline, PlatformAdapter, Projects} from "./common";
import { db } from "../db";
import { Project } from "../../types/projects";
import format from 'pg-format'


export class CircleCI extends PlatformAdapter {
  async getPipeline (token: string, userId: string): Promise<Pipeline[]> {
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

      // получить под нужный проект состояние пайплайна
      const URL = 'https://circleci.com/api/v2/pipeline'

      // здесь мы берем все сущ репы
      // TODO вынести в отдельный метод
      const {data} = await axios.get<PipelineResponse>(URL, {
        params: {
          "org-slug": "bitbucket/caremanagment",
          mine: false
        },
        headers: {"Circle-Token": token}
      })

      // console.log(data)

      const filtredItems: PipelineResponse['items'] = []

      for (let i = 0; data.items[i]; i++) {
        if (filtredItems.some((k) => k.project_slug === data.items[i].project_slug)) {
          continue;
        }

        filtredItems.push(data.items[i])
      }

      console.log(filtredItems)

      // TODO отфильтровать по тем репам что юзер ранее выбрал
      // отфильтровать последний пайплайн в рамках этого проекта
      // и получить его статус (уже сделано)
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

  async refreshProjects (token: string, userId: string): Promise<Projects> {

    const URL = 'https://circleci.com/api/v1.1/me'
    // const URL = 'https://circleci.com/api/v2/pipeline'

    if (!token) {
      return {
        projects: []
      }
    }

    let result: string[] = []
    type PipelineResponse = {
      projects: {
        project: { on_dashboard: true, emails: 'default' }
      }
    }

    console.log(token)

    try {
      // здесь мы берем все сущ репы
      // TODO вынести в отдельный метод
      const {data} = await axios.get<PipelineResponse>(URL, {
        params: {
          "org-slug": "bitbucket/caremanagment",
          mine: false
        },
        headers: {"Circle-Token": token}
      })

      console.log('data')
      console.log(data)

      result = Object.keys(data.projects).map(p => {

        const projectSplitted = p.split('/')
  
        const organization = projectSplitted[projectSplitted.length - 2]
        const project = projectSplitted[projectSplitted.length - 1]

        const slug = organization + '/' + project

        return slug
      })

    } catch (e) {
      console.log(e)
    }

    const valuesToInsert = result.map(name => [
      name, userId, 'cfa6ffce-6936-4837-92a6-2330b1fae2a6', false])

    console.log(valuesToInsert)
      
    const {rows} = await db.query<Project>(format('insert into projects (name, user_id, device_id, is_active) values %L returning *', valuesToInsert))


   return {
    projects: result
   }
  }
}

 // TODO распилить этот класс на 2
 // 1) достать все пайплайны (репы) чтобы юзер смог выбрать какая ему нужна
 // 2) достать статус выбранной репы

 // device_platfroms: JSONB meta
 //      (для circleci: access token)
 //      (для GA: ???)
//  а также key unique: circle_ci | github



// TODO сделать эндпоинт достать все проекты и потом выбрать их

// юзер выбирает платформу, потом проект (репу)