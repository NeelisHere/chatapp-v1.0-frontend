import { useEffect, useState, useRef } from 'react'
import { useChatStore } from '../../store'
import { Box, useToast, Button, Stack, Text, Avatar } from '@chakra-ui/react'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading.jsx'
import GroupChatModal from './GroupChatModal'
import './styles.css'


const MyChats = () => {
    const { user, selectedChat, chats, getCurrentUser, setSelectedChat, setChats } = useChatStore((state) => state)
    const [loggedUser, setLoggedUser] = useState({})
    const toast = useToast()
    const fetchChats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            }
            const { data } = await axios.get('/api/v1/chats/get-chats', config)
            setChats([...data])
        } catch (error) {
            toast({
                title: 'Error occured',
                description: 'Failed to load the Chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    const messageEl = useRef(null);
    useEffect(() => {
        if (messageEl) {
            messageEl.current.addEventListener('DOMNodeInserted', (event) => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [])
    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
        fetchChats()
    }, [])

    return (
        <Box
            // display={{base: selectedChat ? 'none': 'flex', md: 'flex'}}
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
            p={3}
            bg={'white'}
            marginLeft={'10px'}
            w={{ base: '100%', md: '31%' }}
            borderRadius={'lg'}
            boxShadow={'md'}
            overflowY={'hidden'}
            
        // borderWidth={'1px'}
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: '28px', md: '30px' }}
                display={'flex'}
                w={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
            // bg={'#f4f4f4'}
            // borderRadius={'lg'}
            // boxShadow={'base'}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        // bg={'teal'}
                        color={'teal'}
                        display={'flex'}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <div className='scrollable-chat-list-window'>
                {
                    chats ?
                        <Stack ref={messageEl}>
                            {
                                chats.map((chat, index) => {
                                    const otherUser = chat.isGroupChat ? '' : chat.users.find(({ _id }) => (_id !== user._id))
                                    // console.log(otherUser)
                                    const groupChatIconUrl = 'https://img.icons8.com/color/48/conference-skin-type-7.png'
                                    return (
                                        <Box
                                            onClick={() => setSelectedChat(chat)}
                                            cursor={'pointer'}
                                            bg={selectedChat._id === chat._id?'teal':'#f4f4f4'}
                                            color={selectedChat._id === chat._id?'white':'black'}
                                            // boxShadow={'base'}
                                            px={3}
                                            py={2}
                                            borderRadius={'lg'}
                                            w={'100%'}
                                            key={index}
                                            display={'flex'}
                                            alignItems={'center'}
                                        >
                                            {/* {chat._id}
                                            {console.log(chat._id)} */}
                                            <Avatar
                                                mr={2}
                                                size={'sm'}
                                                cursor={'pointer'}
                                                name={chat.isGroupChat ? 'groupchat' : otherUser.username}
                                                src={chat.isGroupChat ? groupChatIconUrl : otherUser.pic}
                                            />
                                            <Box>
                                                <Text>
                                                    {
                                                        !chat.isGroupChat ?
                                                            (
                                                                chat.users[0]._id === loggedUser._id ?
                                                                    chat.users[1].username : chat.users[0].username
                                                            )
                                                            :
                                                            chat.chatName
                                                    }
                                                </Text>
                                                <Text fontSize={'xs'}>
                                                    {chat.isGroupChat ?'Group Chat':'Personal Chat'}
                                                </Text>
                                            </Box>
                                        </Box>
                                    )
                                })
                            }
                        </Stack> :
                        <ChatLoading />
                }

            </div>
        </Box>
    )
}

export default MyChats



