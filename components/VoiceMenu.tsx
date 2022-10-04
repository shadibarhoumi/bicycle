import styled from 'styled-components'
import UnstyledButton from './UnstyledButton'
import { ChevronDown, Check } from 'react-feather'
import { VoiceName, Voices } from '@features/speaker/Voice'

interface Props {
  isOpen: boolean
  voiceName: VoiceName
  onSelect: (name: VoiceName) => void
  onClose: () => void
}

export const VoiceMenu: React.FC<Props> = ({
  isOpen,
  voiceName,
  onSelect,
  onClose,
}) => {
  const voiceOptions = []

  for (const name in VoiceName) {
    const { displayName } = Voices[name as VoiceName]
    voiceOptions.push(
      <VoiceOption
        key={name}
        selected={name === voiceName}
        onClick={() => onSelect(name as VoiceName)}
      >
        <span>{displayName}</span>
        {name === voiceName && <Check size={20} />}
      </VoiceOption>,
    )
  }

  return (
    <Wrapper isOpen={isOpen}>
      <Header>
        <HeaderText>
          <Label>Selected Voice</Label>
          <CurrentVoice>{Voices[voiceName].displayName}</CurrentVoice>
        </HeaderText>
        <CloseButton onClick={() => onClose()}>
          <ChevronDown />
        </CloseButton>
      </Header>
      <VoiceList>{voiceOptions}</VoiceList>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ isOpen: boolean }>`
  position: relative;
  bottom: -50px;
  /* bottom: 0; */
  left: 0;
  width: 100%;
  will-change: transform;
  transform: ${({ isOpen }) =>
    isOpen ? 'translateY(0%)' : 'translateY(100%)'};
  transition: transform 250ms cubic-bezier(0.68, -0.6, 0.32, 1.6);
  pointer-events: all;
  background-color: ${({ theme }) =>
    theme.light ? theme.colors.white : theme.colors.speechControlsBackground};
  border-radius: 8px;
  color: ${({ theme }) =>
    theme.light ? theme.colors.gray[700] : theme.colors.toolbarText};
`

const VoiceList = styled.ul`
  background-color: ${({ theme }) =>
    theme.light ? theme.colors.gray[100] : theme.colors.toolbarBackground};
  position: relative;
  color: inherit;
  max-height: 200px;
  overflow: auto;
  padding-bottom: 50px;
  box-shadow: ${({ theme }) =>
      theme.name === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.06)'}
    0px 2px 4px 0px inset;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 100px;
    /* Since list has 50px extra padding beneath it,
		shorten track by same amount on bottom*/
    margin-bottom: 50px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--color-gray-300);
    border-radius: 100px;
  }
`

const Label = styled.span`
  color: var(--color-gray-500);
  font-weight: ${({ theme }) => theme.weights.medium};
  text-transform: uppercase;
  font-size: ${12 / 16}rem;
`

const CurrentVoice = styled.span`
  font-weight: ${({ theme }) => theme.weights.medium};
  font-size: ${16 / 16}rem;
  color: inherit;
`

const Header = styled.div`
  padding: 8px 12px;
  border-radius: 8px 8px 0 0;
  font-weight: ${(p) => p.theme.weights.medium};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`

const CloseButton = styled(UnstyledButton)`
  color: var(--color-gray-500);
  display: grid;
  place-content: center;
  transition: color 250ms;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transition: color 150ms;
  }
`

const VoiceOption = styled.li<{ selected: boolean }>`
  padding: 6px 12px;
  font-size: ${14 / 16}rem;
  color: ${({ selected, theme }) => (selected ? theme.colors.primary : null)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 150ms;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => (theme.light ? null : theme.colors.primary)};
    background-color: ${({ theme }) =>
      theme.light ? 'hsl(185deg 5% 92%)' : null};
  }
`
