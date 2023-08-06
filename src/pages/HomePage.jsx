import { Container } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from "../components/authComponents/Login"
import Register from "../components/authComponents/Register"
// import { useEffect } from 'react';
// import { useChatStore } from '../store';
// import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    

    return (
        <Container maxW='xl' centerContent>
            <Box
                display={'flex'}
                justifyContent={'center'}
                p={6}
                bg={'white'}
                w={'100%'}
                m={'40px 0 15px 0'}
                borderRadius={'md'}
                boxShadow='md'
            >
                <Text
                    fontSize={'3xl'}
                    color={'#333'}
                >
                    Real-Time Chat App
                </Text>
            </Box>
            <Box bg={'white'} p={4} w={'100%'} borderRadius={'lg'} boxShadow='md'>
                <Tabs variant='soft-rounded' colorScheme='#f4f4f4'>
                    <TabList mb={'1em'}>
                        <Tab width={'50%'} _selected={{ bg: '#f4f4f4' }}>Login</Tab>
                        <Tab width={'50%'} _selected={{ bg: '#f4f4f4' }}>Register</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Register />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage
