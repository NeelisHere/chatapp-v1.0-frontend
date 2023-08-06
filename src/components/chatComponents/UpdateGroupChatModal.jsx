import { SettingsIcon } from "@chakra-ui/icons"
import { Spinner, useDisclosure, useToast } from "@chakra-ui/react"
import {
    Menu, MenuButton, MenuList, MenuDivider,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
    Button,
    Box,
    FormControl, Input
} from '@chakra-ui/react'
import { useChatStore } from "../../store"
import { useState } from "react"
import UserBadgeItem from "./UserBadgeItem"
import axios from "axios"
import UserListItem from "./UserListItem"


const UpdateGroupChatModal = ({ fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat, chats, setChats } = useChatStore((state) => state)
    const [groupChatStates, setGroupChatStates] = useState({
        groupChatName: '',
        search: '',
        searchResult: [],
        selectedUsers: []
    })

    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
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
    const handleDelete = async (u) => {
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: 'Only admins can add/remove someone',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            }
            const { data } = await axios.put('/api/v1/chats/group/remove-user', {
                chatId: selectedChat._id,
                userId: u._id
            }, config)
            setSelectedChat([...data.users])
            fetchChats()
            fetchMessages()
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured',
                description: 'Failed to load the Chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        }
    }
    const handleRename = async () => {
        if (!groupChatStates.groupChatName) return;
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            let { data } = await axios.put('/api/v1/chats/group/rename', {
                chatId: selectedChat._id,
                chatName: groupChatStates.groupChatName
            }, config)
            setSelectedChat(data)
            fetchChats()
            setRenameLoading(false)

        } catch (error) {
            // console.log(error)
            toast({
                title: 'Error occured',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setRenameLoading(false)
            setGroupChatStates({ ...groupChatStates, groupChatName: '' })
        }
    }
    const handleSearch = async (e) => {
        setGroupChatStates({ ...groupChatStates, search: e.target.value })
        if (!e) {
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/v1/users/all-users?search=${groupChatStates.search}`, config)
            // console.log('->', groupChatStates)
            setLoading(false)
            const filteredSearchResults = data.users.filter(({ _id }) => {
                return selectedChat.users.reduce((status, u)=>{
                    return (status && !(_id === u._id))
                }, true)
            })
            // console.log(filteredSearchResults)
            setGroupChatStates({ ...groupChatStates, searchResult: filteredSearchResults })

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
    const addUserToGroup = async (userToAdd) => {
        // alert(userToAdd.username)
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: 'Only admins can add/remove someone',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            }
            // alert(`${selectedChat._id}, ${userToAdd._id}`)
            const { data } = await axios.put('/api/v1/chats/group/add-user', {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config)
            console.log(data)
            setSelectedChat([...data.users])
            fetchChats()
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured',
                description: 'Failed to load the Chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false)
        }
    }
    return (
        <>
            <Button onClick={onOpen} variant='ghost'>
                <SettingsIcon />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={'flex'} justifyContent={'center'}>
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'} pb={3}>
                            {/* { console.log(selectedChat) } */}
                            {
                                selectedChat?.users.map((u, index) => {
                                    return (
                                        <UserBadgeItem
                                            key={index}
                                            user={u}
                                            groupAdmin={selectedChat.groupAdmin._id}
                                            handleFunction={() => {
                                                handleDelete(u)
                                            }}
                                        />
                                    )
                                })
                            }
                        </Box>
                        <FormControl display={'flex'}>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                value={groupChatStates.groupChatName}
                                onChange={(e) => {
                                    setGroupChatStates({ ...groupChatStates, groupChatName: e.target.value })
                                }}
                            />
                            <Button
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to Group"
                                mb={1}
                                onChange={(e) => {
                                    handleSearch(e)
                                }}
                            />
                        </FormControl>
                        <br />
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>
                            {
                                loading ?
                                    <Spinner size={'lg'} /> :
                                    groupChatStates.searchResult?.map((user, index) => {
                                        return (
                                            <UserListItem
                                                key={index}
                                                user={user}
                                                handleFunction={() => {
                                                    addUserToGroup(user)
                                                }}
                                                isInGroupChatModal={true}
                                            />
                                        )
                                    })
                            }
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button w={'100%'} onClick={() => handleDelete(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
