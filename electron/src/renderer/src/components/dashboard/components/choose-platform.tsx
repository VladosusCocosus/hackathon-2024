import {Flex, View} from "@adobe/react-spectrum";
import { motion } from "framer-motion"
import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {request} from "../../../lib/request";


interface PlatformsResponse {
  id: number
  name: string
  image: string
}

function usePlatforms () {
  return useQuery<PlatformsResponse[], unknown, PlatformsResponse[], ['platforms']>({
    queryKey: ['platforms'],
    async queryFn () {
      const response = await request('/platforms?limit=20&offset=0')
      if (!response.ok) {
        throw new Error("Something went wrong while getting platforms")
      }

      return response.json()
    }
  })
}

export function ChoosePlatform() {
  const platforms = usePlatforms()

  console.log(platforms.data)

  return (
    <View borderWidth={'thick'} borderColor={'gray-400'} backgroundColor={'gray-300'} borderRadius={'regular'} padding={'size-200'}>
      <h3>Choose Platform</h3>
      <span>Select the platform use would like to use</span>
      <motion.div
        style={{ marginTop: '12px' }}
        initial={{'--transform-logs': '-17.5px'} as any}
        whileHover={{'--transform-logs': '5px'} as any}
      >
        <Flex direction={'row'} height={50}>
          {platforms?.data?.map((platform, index) => (
            <Link to={`/platform-configuration/${platform.id}`}>
              <img
                width={35}
                height={35}
                style={{
                  transform: index > 0 ? 'translateX(var(--transform-logs))' : undefined,
                  border: '1px solid white',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                src={platform.image}
                alt={platform.name}
              />
            </Link>
          ))}
        </Flex>
      </motion.div>
    </View>
  )
}
