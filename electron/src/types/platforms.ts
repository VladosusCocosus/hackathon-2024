export enum PlatformNames {
  circleCI = "circleCI",
}

export interface Platform {
  name: string
  key: PlatformNames
  accessToken: string
  secretToken: string
}

export type Platforms = Platform[]

export type PlatformKeys = Record<PlatformNames, { access: string, secret: string }>

export const platformsIcons: Record<PlatformNames, string> = {
  [PlatformNames.circleCI]: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Circleci-icon-logo.svg/1200px-Circleci-icon-logo.svg.png',

}

export const platformNames: Record<PlatformNames, string> = {
  [PlatformNames.circleCI]: 'Circle CI',
}

export const platformKeys = Object.keys(platformsIcons) as PlatformNames[]
