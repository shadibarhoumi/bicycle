import { css } from 'styled-components'

export const ScrollbarStyles = css`
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 100px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.gray[500]};
    border-radius: 100px;
  }
`
