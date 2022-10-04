import React from 'react'
import styled from 'styled-components'
import UnstyledButton from '@components/UnstyledButton'

interface Props {
  text: string
}

export const Extract: React.FC<Props> = ({ text }) => {
  const [expanded, setExpanded] = React.useState<boolean>(false)

  return (
    <Wrapper>
      <ExtractWrapper>
        <Text expanded={expanded}>{text}</Text>
        <ExpandButton
          expanded={expanded}
          onClick={() => setExpanded((expanded) => !expanded)}
        >
          Read {expanded ? 'less' : 'more'}
        </ExpandButton>
      </ExtractWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const ExtractWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Text = styled.p<{ expanded: boolean }>`
  font-family: inherit;
  font-size: ${14 / 16}rem;
  padding-top: 4px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ expanded }) => (expanded ? 'initial' : '3')};
  overflow: hidden;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.text};
`

const ExpandButton = styled(UnstyledButton)<{ expanded: boolean }>`
  cursor: pointer;
  color: ${({ theme }) =>
    theme.light ? theme.colors.gray[700] : theme.colors.text};
  border-radius: 4px;
  transition: all 100ms ease-out;
  align-self: center;
  font-size: ${12 / 16}rem;
  padding: 2px 8px;
  font-weight: ${({ theme }) => theme.weights.medium};

  &:hover {
    background-color: ${({ theme }) =>
      theme.light ? theme.colors.gray[100] : theme.colors.gray[200]};
  }
`
