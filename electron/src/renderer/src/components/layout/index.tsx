import {Grid, View} from "@adobe/react-spectrum";
import {Outlet} from "react-router-dom";
import { Header as HeaderComponent } from '../header'
import {useMe} from "../../hooks/use-me";

export function Layout() {

 useMe()

  return (
      <Grid
        areas={[
          'header',
          'content',
          'footer'
        ]}
        columns={['1fr']}
        rows={['auto', '1fr', 'size-1000']}
        gap={'size-200'}
        height={'100vh'}
      >
        <View marginTop={'size-200'}><HeaderComponent/></View>

        <View gridArea="content" marginX={'size-200'} backgroundColor={'gray-200'} borderRadius={'regular'}><Outlet/></View>
        <View gridArea="footer" marginX={'size-200'} backgroundColor={'gray-200'} borderRadius={'regular'} marginBottom={'size-200'} />
      </Grid>
  )
}
