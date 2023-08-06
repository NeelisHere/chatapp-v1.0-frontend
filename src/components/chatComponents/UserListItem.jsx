import { Box, Avatar, Text } from '@chakra-ui/react'
import React from 'react'
const UserListItem = ({ user, handleFunction, isInGroupChatModal }) => {
    // console.log(user)
    return (
        <Box
            onClick={handleFunction}
            cursor={'pointer'}
            bg={isInGroupChatModal?'#f4f4f4':'white'}
            shadow={'base'}
            _hover={{
                shadow: 'md'
            }}
            w={'100%'}
            display={'flex'}
            alignItems={'center'}
            color={'black'}
            px={3}
            py={3}
            mb={3}
            borderRadius={'lg'}
        >
            {/* {user.username} */}
            <Avatar
                mr={2}
                size={'sm'}
                cursor={'pointer'}
                name={user.username}
                src={user.pic}
            />
            <Box>
                <Text>{user.username}</Text>
                <Text fontSize={'xs'}>{user.email}</Text>
            </Box>
            
        </Box>
    )
}

export default UserListItem
