import { Box } from '@chakra-ui/react'
import { useChatStore } from '../../store'
import SingleChat from './SingleChat'

const ChatBox = () => {
    const { selectedChat } = useChatStore()
    return (
        <Box
            alignItems={'center'}
            flexDir={'column'}
            p={3}
            bg={'white'}
            w={'70%'}
            borderRadius={'lg'}
            // borderWidth={'1px'}
            m={'0 10px 10px 20px'}
            shadow={'md'}
        >
            <SingleChat />
        </Box>
    )
}

export default ChatBox
