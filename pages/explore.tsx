import AppLayout from '@components/AppLayout'
import styled from 'styled-components'
import PageWrapper from '@components/PageWrapper'

export default function ExplorePage() {
  return (
    <AppLayout>
      <PageWrapper>
        <Heading>Explore</Heading>
      </PageWrapper>
    </AppLayout>
  )
}

const Heading = styled.h1`
  font-size: ${18 / 16}rem;
`
