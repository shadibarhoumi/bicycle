import styled from 'styled-components'

const AppLayout: React.FC = ({ children }) => {
  return (
    <Wrapper>
      {/* <Sidebar user={user} /> */}
      <Content>{children}</Content>
    </Wrapper>
  )
}

export default AppLayout

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`
