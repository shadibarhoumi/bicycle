import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons'
import UnstyledButton from '@components/UnstyledButton'
import { useEffect, useState, useRef } from 'react'
import { ListLoader } from '@components/ListLoader'
import { searchWikipedia } from '@lib/wikipedia'
import { SearchResult } from '@models/SearchResult'
import toast from 'react-hot-toast'
import Result from './Result'
import { ScrollbarStyles } from '@styles/ScrollbarStyles'

interface Props {
  researchQuery: string | undefined
  onClose?: () => void
  style?: React.CSSProperties
  isOpen: boolean
}

const ResearchBar: React.FC<Props> = ({
  researchQuery,
  onClose,
  style,
  isOpen,
}) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const removeResult = (title: string) => {
    const numResults = searchResults.length
    setSearchResults((searchResults) =>
      searchResults.filter((result) => result.title !== title),
    )
    if (numResults <= 1 && onClose) {
      onClose()
    }
  }

  useEffect(() => {
    const search = async (query: string) => {
      setLoading(true)
      const { result, error } = await searchWikipedia(query)
      if (result) {
        setLoading(false)
        setSearchResults((results) => [result, ...results])
        wrapperRef.current?.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      } else {
        setLoading(false)
        const errorMessage = `No results found for ${query}`
        toast.error(error || errorMessage)
      }
    }
    if (researchQuery) {
      search(researchQuery)
    }
  }, [researchQuery, wrapperRef])

  return (
    <Wrapper style={style} ref={wrapperRef} isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <FontAwesomeIcon icon={faLongArrowAltRight} size="sm" color="inherit" />
      </CloseButton>
      <Content>
        <Heading>Research</Heading>
        {loading && (
          <ListLoader uniqueKey="resultLoader" style={{ padding: '16px 0' }} />
        )}
        <Results>
          {searchResults.map((result) => (
            <Result
              key={result.title}
              result={result}
              onDelete={(title) => {
                removeResult(title)
              }}
            />
          ))}
        </Results>
      </Content>
    </Wrapper>
  )
}
export default ResearchBar

const Heading = styled.h1`
  font-size: ${22 / 16}rem;
  color: ${({ theme }) =>
    theme.light ? theme.colors.gray[900] : theme.colors.gray[300]};
  padding-bottom: 4px;
  border-bottom: 1px solid var(--color-gray-300);
  font-weight: ${({ theme }) => theme.weights.thin};
`

const Wrapper = styled.div<{ isOpen: boolean }>`
  --right-padding: 100px;
  position: fixed;
  right: 0;
  height: 100%;
  width: calc(400px + var(--right-padding));
  padding-right: 100px;
  background-color: ${({ theme }) => theme.colors.researchBarBackground};
  ${({ theme }) => theme.transitions.themeSwitch};
  will-change: transform;
  transform: ${({ isOpen }) =>
    isOpen
      ? 'translateX(calc(0% + var(--right-padding)))'
      : 'translateX(calc(100% + 50px))'};
  transition: transform 250ms cubic-bezier(0.68, -0.6, 0.32, 1.6);
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset,
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  border-left: ${({ theme }) =>
    theme.light ? null : `1px solid ${theme.colors.gray[700]}`};
`

const Content = styled.div`
  height: 100%;
  overflow: auto;
  width: 100%;
  padding: 12px 24px;

  ${ScrollbarStyles};
`

const Results = styled.ul`
  padding-top: 24px;
  overflow: auto;
`

const CloseButton = styled(UnstyledButton)`
  position: fixed;
  top: 8px;
  left: 0;
  transform: translateX(-100%);
  cursor: pointer;
  padding: 8px;
  color: var(--color-gray-500);
  transition: color 100ms ease;

  &:hover {
    color: var(--color-primary);
  }
`
