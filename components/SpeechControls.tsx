import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
import UnstyledButton from './UnstyledButton'
import { Speaker } from '@features/speaker/Speaker'
import { PersonSpeaking } from '@components/Icon'
import { VoiceName } from '@features/speaker/Voice'
import { VoiceMenu } from '@components/VoiceMenu'
import { COLORS } from '@styles/BaseTheme'
interface Props {
  playing: boolean
  speakerRef: React.MutableRefObject<Speaker>
}

const speedOptions = [1, 1.25, 1.5, 1.75, 2, 2.5, 3]

const SpeechControls: React.FC<Props> = ({ playing, speakerRef }) => {
  const icon = playing ? faPause : faPlay
  const [hasClickedPlay, setHasClickedPlay] = useState<boolean>(false)
  const [voiceName, setVoiceName] = useState<VoiceName>(
    VoiceName.enGoogleJStandard,
  )
  const [rate, setRate] = useState<number>(1.5)
  const [voiceMenuOpen, setVoiceMenuOpen] = useState<boolean>(false)

  useEffect(() => {
    if (playing && !hasClickedPlay) {
      setHasClickedPlay(true)
    }
  }, [playing])

  return (
    <Wrapper>
      <VoiceMenu
        isOpen={voiceMenuOpen}
        voiceName={voiceName}
        onSelect={(name) => {
          setVoiceName(name)
          speakerRef.current.setVoiceFromName(name)
        }}
        onClose={() => setVoiceMenuOpen(false)}
      />
      <ControlsWrapper>
        <ButtonWrapper>
          <ControlButton
            onClick={() => {
              const currentIndex = speedOptions.findIndex(
                (speed) => speed === rate,
              )
              const nextIndex =
                currentIndex === speedOptions.length - 1 ? 0 : currentIndex + 1
              setRate(speedOptions[nextIndex])
              speakerRef.current.rate = rate
            }}
          >
            {rate + 'x'}
          </ControlButton>
        </ButtonWrapper>
        <PlayButton
          hasClickedPlay={hasClickedPlay}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            speakerRef.current?.togglePlay(voiceName, rate)
            setVoiceMenuOpen(false)
          }}
        >
          <FontAwesomeIcon
            icon={icon}
            style={{
              transform: playing ? 'none' : 'translate(2px, 0px)',
            }}
          />
          {!hasClickedPlay && <ListenText>Listen</ListenText>}
        </PlayButton>
        <ButtonWrapper>
          <ControlButton onClick={() => setVoiceMenuOpen((isOpen) => !isOpen)}>
            <PersonSpeaking size={21} color="inherit" />
          </ControlButton>
        </ButtonWrapper>
      </ControlsWrapper>
    </Wrapper>
  )
}
export default SpeechControls

const Wrapper = styled.div`
  left: 0;
  right: 0;
  width: 226px;
  position: absolute;
  bottom: 20px;
  margin: auto;
  filter: drop-shadow(2px 2px 20px hsl(0deg 0% 0% / 0.25));
  border-radius: 8px;
  pointer-events: none;
  overflow: hidden;
  background-color: transparent;
`

const ControlsWrapper = styled.div`
  pointer-events: all;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.speechControlsBackground};
  ${({ theme }) => theme.transitions.themeSwitch};
`

const ControlButton = styled(UnstyledButton)`
  display: grid;
  place-content: center;
  color: ${({ theme }) => theme.colors.speechControlsText};
  font-size: ${13 / 16}rem;
  font-weight: ${(p) => p.theme.weights.medium};
  transition: filter 200ms;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 250ms;

  & > svg {
    display: block;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transition: color 150ms;
  }
`

const ButtonWrapper = styled.div`
  width: 50px;
  display: flex;
  justify-content: center;
`

const ListenText = styled.span`
  font-size: ${12 / 16}rem;
  font-weight: ${(p) => p.theme.weights.bold};
`

const PlayButton = styled(UnstyledButton)<{ hasClickedPlay: boolean }>`
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  gap: 12px;
  height: 42px;
  width: ${({ hasClickedPlay }) => (hasClickedPlay ? '42px' : '100px')};
  padding: 12px 18px;
  background-color: hsl(${COLORS.primary} / 0.7);
  cursor: pointer;
  outline: none;
  border-radius: 30px;
  transition: filter 200ms;

  &:hover {
    filter: brightness(110%);
    transition: filter 100ms;
  }
`
