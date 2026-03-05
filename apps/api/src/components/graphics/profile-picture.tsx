'use client'

import React from 'react'
import { Media, User } from '../../payload-types'
import { useAuth } from '@payloadcms/ui'

export const ProfilePicture: React.FC = () => {
  const { user } = useAuth<User>()
  return (
    <img
      style={{
        width: '25px',
        height: '25px',
        borderRadius: '50%',
        objectFit: 'cover',
      }}
      src={(user?.avatarAsset as Media)?.thumbnailURL || 'https://placehold.co/64x64'}
      alt={`${user?.name || user?.username} profile`}
      width={25}
      height={25}
    />
  )
}

export default ProfilePicture
