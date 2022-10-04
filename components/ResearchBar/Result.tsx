import styled from 'styled-components'
import React from 'react'
import UnstyledButton from '@components/UnstyledButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { SearchResult } from '@models/SearchResult'
import { Extract } from './Extract'

interface Props {
  result: SearchResult
  onDelete: (title: string) => void
}

const Result: React.FC<Props> = ({ result, onDelete }) => {
  const { title, extract, imageInfo } = result

  return (
    <Wrapper key={title}>
      <DeleteButton onClick={() => onDelete(title)}>
        <FontAwesomeIcon icon={faTimes} size="sm" color="inherit" />
      </DeleteButton>
      <Title>
        <WikiLink
          href={`http://en.wikipedia.org/wiki/${title}`}
          target="_blank"
          rel="noreferrer"
        >
          <TitleLinkWrapper>
            <TitleText>{title}</TitleText>
            <FontAwesomeIcon
              icon={faExternalLinkAlt}
              size="xs"
              style={{
                fontSize: '0.5em',
              }}
              color="inherit"
            />
          </TitleLinkWrapper>
          {imageInfo && imageInfo.url && (
            <ImageWrapper>
              <ArticleImage alt={`Image of ${title}`} src={imageInfo.url} />
            </ImageWrapper>
          )}
        </WikiLink>
      </Title>

      <Extract text={extract} />
    </Wrapper>
  )
}

export default Result

const TitleLinkWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
`

const TitleText = styled.div`
  margin: 18px 0;
`

const DeleteButton = styled(UnstyledButton)`
  cursor: pointer;
  position: absolute;
  color: ${({ theme }) =>
    theme.light ? theme.colors.gray[300] : theme.colors.gray[700]};
  transition: color 100ms ease;
  width: 32px;
  height: 32px;
  top: 0px;
  right: 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transition: color 100ms ease-out;
  }
`

const WikiLink = styled.a`
  color: ${({ theme }) =>
    theme.light ? theme.colors.gray[700] : theme.colors.text};
  transition: color 150ms ease;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const Wrapper = styled.li`
  padding: 24px;
  padding-top: 0px;
  background-color: ${({ theme }) =>
    theme.light ? theme.colors.white : theme.colors.toolbarBackground};
  ${({ theme }) => theme.transitions.themeSwitch};
  font-family: var(--font-sans);
  position: relative;
  margin-bottom: 24px;
  border-radius: 4px;
  overflow: hidden;
`

const Title = styled.h2`
  font-size: ${24 / 16}rem;
  font-family: inherit;
  font-weight: ${({ theme }) => theme.weights.thin};
`

const ArticleImage = styled.img`
  display: block;
  width: 100%;
`

const ImageWrapper = styled.div`
  line-height: 0;
  margin-left: -24px;
  margin-right: -24px;
  overflow: hidden;
  padding-bottom: 24px;
`
