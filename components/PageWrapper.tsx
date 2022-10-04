import styled from 'styled-components'

const PageWrapper = styled.div`
  padding: 36px;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`
export default PageWrapper
