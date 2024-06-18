import {Flex, View} from "@adobe/react-spectrum";
import {platformKeys, platformsIcons} from "../../../../../types/platforms";
import { motion } from "framer-motion"
import {Link} from "react-router-dom";


export function ChoosePlatform() {
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
          {platformKeys.map((key, index) => (
            <Link to={`/platform-configuration/${key}`}>
              <img
                width={35}
                height={35}
                style={{
                  transform: index > 0 ? 'translateX(var(--transform-logs))' : undefined,
                  border: '1px solid white',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                src={platformsIcons[key]}
                alt={key}
              />
            </Link>
          ))}
        </Flex>
      </motion.div>
    </View>
  )
}
