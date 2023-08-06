import React, { useState } from 'react'
import { Box, Spinner, Tooltip } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import {getSender} from '../../config/chatLogics'
// import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge'
import {
	Input,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useDisclosure,
	useToast
} from '@chakra-ui/react'
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { Avatar } from '@chakra-ui/react'
import { useChatStore } from '../../store'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
// import { Effect } from 'react-notification-badge'

const SideDrawer = () => {
	const [states, setStates] = useState({
		search: '',
		searchResult: [],
		loading: false,
		loadingChat: false
	})
	const { user, chats, selectedChat, setChats, setSelectedChat, notification, setNotification } = useChatStore((state) => state)
	const navigate = useNavigate()
	const toast = useToast()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const handleSearch = async () => {
		if(!states.search){
			toast({
				title: 'Please enter something in Search',
				status: 'warning',
				duration: 5000,
				isClosable: true,
				position: 'top'
			})
			return;
		}
		try {
			setStates({ ...states, loading: true })
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`
				}
			}
			const { data } = await axios.get(`https://chat-app-v1-0-backend.onrender.com/api/v1/users/all-users?search=${states.search}`, config)
			setStates({ ...states, loading: false, searchResult: data.users })

		} catch (error) {
			toast({
				title: 'Error occured',
				description: 'Failed to load the Search Results',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top'
			})
		}
	}

	const accessChat = async ({ _id:userId, username}) => {
		// alert(`${username}->${userId}`)
		try {
			setStates({...states, loading: true})
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token}`
				}
			}
			const { data } = await axios.post(`https://chat-app-v1-0-backend.onrender.com/api/v1/chats/access-chat`, { userId }, config)
			// console.log('>>', data)
			// console.log('>>', chats)
			if(!chats.find((c)=> c._id === data._id))setChats([data, ...chats])
			setStates({ ...states, loading: false })
			setSelectedChat(data)
			onClose()
		} catch (error) {
			toast({
				title: 'Error occured',
				description: 'Failed to load the Search Results',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom-left'
			})
		}
	}

	return (
		<Box>
			<Box
				display={'flex'}
				justifyContent={'space-between'}
				alignItems={'center'}
				p={'5px 10px 5px 10px'}
				bg={'white'}
				m={'20px 20px 20px 20px'}
				borderRadius={'md'}
				boxShadow='md'
			>
				<Tooltip label='Search Users to chat' hasArrow placement='bottom-end'>
					<Button variant={'ghost'} onClick={onOpen}>
						<i className="fa-solid fa-magnifying-glass"></i>
						<Text display={{ base: 'none', md: 'flex' }} px={4}>Search User</Text>
					</Button>
				</Tooltip>
				<Text fontSize={'2xl'} px={4}>Whatsapp University</Text>
				<div>
					<Menu>
						<MenuButton p={1} m={'0px 10px 0px 10px'}>
							{/* <NotificationBadge
								count={notification.length}
								effect={Effect.SCALE}
							/> */}
							<i className="fa-solid fa-bell" style={{ color: '#000000' }}></i>
						</MenuButton>
						<MenuList pl={2}>
							{
								!notification.length && "No New Messages"
							}
							{
								notification.map((notif, index)=>(
									<MenuItem key={index} onClick={()=>{
										setSelectedChat(notif.chat)
										setNotification(notification.filter((n)=>n!==notif))
									}}>
										{
											notif.chat.isGroupChat? 
											`New Message in ${notif.chat.chatName}`:
											`New Message from ${getSender(user, notif.chat.users)}`
										}
									</MenuItem>
								))
							}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar size={'sm'} cursor={'pointer'} name={user.username} />
						</MenuButton>
						<MenuList>
							<ProfileModal user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem
								onClick={() => {
									localStorage.removeItem('userInfo')
									navigate('/')
								}}
							>
								Logout
							</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
			<Drawer placement='left' onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent bg={'#F3F6F9'}>
					<DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>
					<DrawerBody>
						<Box
							display={'flex'}
							paddingBottom={2}
							
						>
							<Input
								placeholder='Search'
								mr={2}
								value={states.search}
								bg={'white'}
								onChange={(e) => {
									setStates({ ...states, search: e.target.value })
								}}
							/>
							
							<Button onClick={handleSearch}>
								{
									states.loading ?
									<Spinner ml={'auto'} display={'flex'}/>:
									<SearchIcon/>
								}
							</Button>
						</Box>
						<br />
						{
							states.loading ?
							<ChatLoading/>:
							(
								states.searchResult?.map((user)=>{
									return(
										<UserListItem 
											key={user._id}
											user={user}
											handleFunction={()=>{
												accessChat(user)
											}}
										/>
									)
								})
							)
						}
					</DrawerBody>
				</DrawerContent>

			</Drawer>
		</Box>
	)
}

export default SideDrawer
