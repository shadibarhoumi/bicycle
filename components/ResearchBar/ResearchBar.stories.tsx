import React from 'react'
import styled from 'styled-components'
import ResearchBar from './ResearchBar'

export const Empty = () => (
  <Wrapper>
    <ResearchBar isOpen={true} researchQuery="jim" />
  </Wrapper>
)

const Wrapper = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  height: 100%;
`
