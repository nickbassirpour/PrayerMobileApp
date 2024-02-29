import { Link, Stack } from 'expo-router'
import { View, Text, Button } from 'react-native'

const Search = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 20}}>
      <Text>Search</Text>
      <Link href="/home/SOD/[St.Francis]">Push SOD</Link>
    </View>
  )
}

export default Search