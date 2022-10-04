import React from 'react'
import WorkspacesPage from '@pages/workspaces'
import { Meta } from '@storybook/react'

export default {
  component: WorkspacesPage,
  title: 'Pages/Workspaces',
} as Meta

export const Empty = () => <WorkspacesPage />
