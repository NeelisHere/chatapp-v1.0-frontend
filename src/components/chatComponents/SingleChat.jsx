import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons"
import { useChatStore } from "../../store"
import { Box, IconButton, Text, Button, Spinner, FormControl, Input, useToast } from "@chakra-ui/react"
import ProfileModal from './ProfileModal'
import ScrollableChat from './ScrollableChats.jsx'
import UpdateGroupChatModal from "./UpdateGroupChatModal"
import { useEffect, useState } from "react"
import axios from "axios"
import './styles.css'
import { io } from "socket.io-client"
// import Lottie from "react-lottie"
import animationData from '../../animations/animation_lkv2z5zr.json'


const ENDPOINT = 'http://localhost:8000'
let socket, selectedChatCompare


const SingleChat = () => {
    const { 
        user, selectedChat, 
        setSelectedChat, chats, setChats, 
        notification, setNotification 
    } = useChatStore((state)=>state)

    const sender = selectedChat.users?.filter((u) => u._id !== user._id)[0]
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const toast = useToast()

    const fetchChats = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            }
            const { data } = await axios.get('https://chat-app-v1-0-backend.onrender.com/api/v1/chats/get-chats', config)
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
    const sendMessage = async (e) =>{
        
        if(e.key === 'Enter' && newMessage){
            socket.emit('stop typing', selectedChat._id)
            // console.log(newMessage)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage('')
                const { data } = await axios.post('https://chat-app-v1-0-backend.onrender.com/api/v1/messages/', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                socket.emit('new message', data)
                setMessages([...messages, data])
                // console.log(data)

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
    }
    const fetchMessages = async () => {
        // console.log(typeof selectedChat, selectedChat)
        if(selectedChat.length===0)return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`https://chat-app-v1-0-backend.onrender.com/api/v1/messages/${selectedChat._id}`, config);
            setMessages(data)
            // console.log(messages)
            setLoading(false)
            socket.emit('join chat', selectedChat._id)
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
    
    useEffect(()=>{
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    },[])

    useEffect(()=>{
        fetchMessages()
        selectedChatCompare = selectedChat
    },[selectedChat])

    console.log('1. ', notification)

    useEffect(()=>{
        socket.on('message received', (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                if(notification.findIndex((n)=>n.chat._id === newMessageReceived.chat._id) === -1){
                    setNotification([newMessageReceived, ...notification])
                    fetchChats()
                    // console.log('1. ', notification)
                }
            }else{
                const index = notification.findIndex((n)=>n.chat._id === newMessageReceived.chat._id)
                if(index !== -1){
                    setNotification(notification.splice(index, 1))
                }
                // alert(index)
                setMessages([...messages, newMessageReceived])
            }
        })
    })

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if(!socketConnected) return;
        if(!typing){
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        let timerLength = 3000
        setTimeout(()=>{
            let timeNow = new Date().getTime()
            let timeDiff = timeNow - lastTypingTime
            if(timeDiff >= timerLength && typing){
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    return (
        <Box display={'flex'} height={'100%'} flexDir={'column'} justifyContent={'center'} alignItems={'center'}>
            {
                selectedChat.chatName ?
                    <>
                        <Box
                            pb={3}
                            px={2}
                            w={'100%'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'center'}
                        >
                            <IconButton
                                display={'flex'}
                                icon={<ArrowBackIcon />}
                                onClick={() => {

                                }}
                            />
                            {
                                selectedChat.isGroupChat ?
                                    <>
                                        <Text fontSize={'24px'}>
                                            {selectedChat.chatName}
                                        </Text>
                                        <UpdateGroupChatModal fetchMessages={fetchMessages}/>
                                    </>
                                    :
                                    <>
                                        <Text fontSize={'24px'}>
                                            {sender.username}
                                        </Text>
                                        <ProfileModal user={sender}>
                                            <Button colorScheme="teal">
                                                Sender
                                            </Button>
                                        </ProfileModal>
                                    </>
                            }
                        </Box>
                        <Box
                            display={'flex'}
                            flexDir={'column'}
                            justifyContent={'flex-end'}
                            p={3}
                            bg={'#f4f4f4'}
                            w={'100%'}
                            height={'100%'}
                            borderRadius={'lg'}
                            overflowY={'hidden'}
                        >
                            {
                                loading ?
                                <Spinner
                                    size={'xl'}
                                    w={20}
                                    h={20}
                                    alignSelf={'auto'}
                                    // border={'2px solid red'}
                                />
                                :
                                <div>
                                    <ScrollableChat messages={messages}/>
                                </div>
                            }
                            <FormControl
                                tabIndex={0}
                                onKeyDown={sendMessage}
                                isRequired
                                mt={3}
                            >
                                { 
                                    isTyping? 
                                    <div>
                                        {/* <Lottie 
                                            options={defaultOptions}
                                            width={70}
                                            style={{ marginBottom: 15, marginLeft: 0 }}
                                        /> */}
                                        Typing...
                                    </div>:
                                    <></>
                                }
                                <Input 
                                    variant={'filled'}
                                    bg={'white'}
                                    placeholder="Enter a message..."
                                    boxShadow={'base'}
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                        </Box>
                    </>
                    :
                    <Box >
                        <Text fontSize={'24px'}>
                            Click on a Chat to Start Chatting
                        </Text>
                    </Box>
            }
        </Box>
    )
}

export default SingleChat
