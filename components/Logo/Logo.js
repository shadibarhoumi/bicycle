import React from 'react'
import styled from 'styled-components'

const Logo = (props) => {
  return (
    <Link href="/">
      <Wrapper>
        <IconWrapper>
          <LogoIcon src="/images/chain.svg" />
        </IconWrapper>
        <Name {...props}>Bicycle</Name>
      </Wrapper>
    </Link>
  )
}

const IconWrapper = styled.div`
  width: 36px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const Link = styled.a`
  text-decoration: none;
  color: inherit;
`

const LogoIcon = styled.img`
  width: 28px;
  transform: translateY(-4px) rotate(20deg);
  display: block;
`

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
`

const Name = styled.h1`
  font-size: ${24 / 16}rem;
  font-weight: ${({ theme }) => theme.weights.normal};
  margin-left: var(--item-left-margin);
  font-family: var(--font-mono);
`

export default Logo
