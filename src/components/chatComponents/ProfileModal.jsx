import { ViewIcon } from '@chakra-ui/icons'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	IconButton,
	useDisclosure,
	Button,
	Image,
	Text,
} from '@chakra-ui/react'
// import { useDisclosure } from '@chakra-ui/react'
// import { Button } from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()

	return (
		<div>
			{
				children ?
					<span onClick={onOpen}>{children}</span> :
					<IconButton
						display={{ base: 'flex' }}
						icon={<ViewIcon />}
						onClick={onOpen}
					/>
			}
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display={'flex'}
						justifyContent={'center'}
						flexDir={'column'}
						alignItems={'center'}
					>
						<Text fontSize={'40px'} >{user.username}</Text>
						<Text fontSize={'17px'} fontWeight={'normal'}>{user.email}</Text>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
						p={'25px'}
					>
						<Image
							borderRadius={'full'}
							boxSize={'150px'}
							src={user.pic}
							alt={user.name}
						/>
					</ModalBody>
					<ModalFooter
						display={'flex'}
						justifyContent={'center'}
						alignItems={'center'}
						p={'25px'}
					>
						<Button colorScheme='teal' mr={3} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme='teal' mr={3} variant='outline'>
							Edit Profile
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	)
}

export default ProfileModal
