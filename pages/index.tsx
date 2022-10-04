import Head from 'next/head'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import UnstyledButton from '@components/UnstyledButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { auth, googleAuthProvider } from '@lib/firebase'
import { UserContext } from '@features/user/UserContext'
import { firestore } from '@lib/firebase'

const LoginButton: React.FC = () => {
  const router = useRouter()
  const user = useContext(UserContext)
  const signInWithGoogle = async () => {
    try {
      if (!user) {
        const userCredential = await auth.signInWithPopup(googleAuthProvider)
        // initialize user fields
        firestore
          .collection('users')
          .doc(userCredential.user?.uid)
          .set({ synthesizedChars: 0 })
      }
      router.push('/workspaces')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error('An error occurred: ' + error.message)
      }
    }
  }

  return (
    <LoginButtonWrapper onClick={signInWithGoogle}>
      <IconWrapper>
        {user ? (
          <FontAwesomeIcon icon={faArrowRight} size="lg" />
        ) : (
          <FontAwesomeIcon icon={faGoogle} size="lg" />
        )}
      </IconWrapper>
      <ButtonTextWrapper>
        {user
          ? `Welcome back, ${user?.displayName?.split(' ')[0]}`
          : 'Sign up with Google'}
      </ButtonTextWrapper>
    </LoginButtonWrapper>
  )
}

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Bicycle</title>
      </Head>
      <Wrapper>
        <Logo>Bicycle</Logo>
        <Tagline>A biycle for the mind.</Tagline>
        <LoginButton />
      </Wrapper>
    </>
  )
}

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  gap: 64px;
  background-color: var(--color-gray-100);
`

const Logo = styled.h1`
  font-size: ${56 / 16}rem;
  font-family: var(--font-sans);
  color: var(--color-gray-900);
  margin: 0 auto;

  & > img {
    width: 100%;
  }
`

const Tagline = styled.h2`
  font-size: ${28 / 16}rem;
  color: var(--color-gray-900);
  font-weight: ${(p) => p.theme.weights.normal};
`

const LoginButtonWrapper = styled(UnstyledButton)`
  color: var(--color-white);
  font-weight: ${(p) => p.theme.weights.medium};
  font-size: ${20 / 16}rem;
  transition: all 200ms ease-out;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  margin-top: 16px;

  &:hover {
    transform: translateY(-2px);
  }
`

const IconWrapper = styled.span`
  background-color: var(--color-white);
  color: var(--color-gray-900);
  padding: 16px 24px;
  border-radius: 8px 0 0 8px;
  transition: all 200ms ease-out;

  ${LoginButtonWrapper}:hover & {
    color: var(--color-black);
  }
`

const ButtonTextWrapper = styled.span`
  background-color: var(--color-gray-900);
  padding: 16px 24px;
  border-radius: 0 8px 8px 0;
  transition: 200ms;
  font-weight: ${(p) => p.theme.weights.normal};

  ${LoginButtonWrapper}:hover & {
    background-color: var(--color-black);
  }
`

export default Home
