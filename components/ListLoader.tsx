import { List } from 'react-content-loader'
import { useTheme } from 'styled-components'

interface Props {
  uniqueKey: string
  style?: React.CSSProperties
}

export const ListLoader: React.FC<Props> = ({ uniqueKey, style }) => {
  const theme = useTheme()
  return (
    <List
      backgroundColor={theme.colors.loaderBackground}
      foregroundColor={theme.colors.loaderForeground}
      uniqueKey={uniqueKey}
      style={{ style }}
    />
  )
}
