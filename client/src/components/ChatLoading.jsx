import { Skeleton, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = () => {
  return (
        <Stack>
        <Skeleton height='50px' />
        <Skeleton height='50px' />
        <Skeleton height='50px' />
        <Skeleton height='50px' />
        <Skeleton height='50px' />
        <Skeleton height='50px' />
        <Skeleton height='50px' />
        <Skeleton height='50px' />
      </Stack>
  )
}

export default ChatLoading
