import AppLayout from '@components/AppLayout'
import styled from 'styled-components'
import PageWrapper from '@components/PageWrapper'

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageWrapper>
        <Heading>Dashboard</Heading>
      </PageWrapper>
    </AppLayout>
  )
}

const Heading = styled.h1`
  font-size: ${18 / 16}rem;
`
