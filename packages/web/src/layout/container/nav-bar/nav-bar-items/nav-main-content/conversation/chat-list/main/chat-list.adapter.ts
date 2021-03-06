import { useEffect, useLayoutEffect, useRef } from "react";
import { ENUM_KIND_OF_STATUS_CODE } from "../../../../../../../../libraries/Enum/status-code";
import useScroll from "../../../../../../../../libraries/Hooks/useScroll";
import ChatInputServices from "../../chat-input/main/chat-input.services";
import ChatListStates from "./chat-list.states";

import ReconnectingWebSocket from "reconnecting-websocket";

var sockets: ReconnectingWebSocket[] = [];
var socket: ReconnectingWebSocket;

const options = {
    WebSocket: WebSocket, // custom WebSocket constructor
    connectionTimeout: 1000,
    maxRetries: 10,
  };

function ChatListAdapter(props: any) {
    const chatlistRef = useRef<HTMLInputElement>(null);

    const { chats , count , page , setPage , isUpdating , roomId , setRespondedMess } = props;

    const {
        isMainLoading, setIsMainLoading,
        userid, setUserid,
        chatList, setChatList,
        roomIdz, setRoomIdz,
        bottom , setBottom
    } = ChatListStates();

    useEffect(() => {
        const eleChatInput = document.getElementById("chat-input");
        if(eleChatInput){
            setBottom(eleChatInput.offsetHeight.toString());
        }
    })

    useEffect(() => {
        console.log('test_init_app...');
        const userId: string = localStorage.getItem("userId") || "";
        if(userId){
        //   pushStreamService.subChat(userId);
        }   
    }, []);

    useLayoutEffect(() =>{
        if(chatlistRef.current){
            if(page === 1 && !isUpdating){
                chatlistRef.current.scrollTop = chatlistRef.current.scrollHeight;
            } else{
                if(!isUpdating){
                    chatlistRef.current.scrollTop = chatlistRef.current.scrollHeight / 2;
                }
            }
        } 
    } , [ page , isUpdating , setRoomIdz])

    useEffect(() => {
        const userId = localStorage.getItem('userId') || "";
        setUserid(userId);
    }, [ setUserid ])

    useEffect(() => {
        if(roomId === roomIdz){
            setChatList(prev =>[ ...chats , ...prev ])
        } else{
            setRoomIdz(roomId);
            setChatList(chats)
            setRespondedMess()
        }

        setIsMainLoading(false);
    }, [ chats ])

    const clickFirstMessage = async ()  => {
        const chats = {
            chatRoomId: roomId,
            message: "Xin chào",
            messageStatus: "1",
            messageType: "1",
            user: {userName: "Huy dz", status: "1" , id: userid},
            userId: userid,
            createdAt: new Date(),
            attachments:[]
        }

        setChatList(prev =>[ chats , ...prev ])

        const response = await ChatInputServices().getInstance().sendMessage(chats);
        if(response && response.status === ENUM_KIND_OF_STATUS_CODE.SUCCESS){

        }
    }

    const { handleScroll } = useScroll( page , setPage , count , isUpdating , chatlistRef , true )


    // const observer = useRef<any>();
    // const lastMessageRef = useCallback(node => {
    //     if (loading) return
    //     if (observer.current) observer.current.disconnect()
    //     observer.current = new IntersectionObserver(entries => {
    //         if (entries[0].isIntersecting && hasMore) {
    //             console.log(111)
    //             // setPageNum(prevPageNumber => prevPageNumber + 1)
    //         }
    //     })
    //     if (node) observer.current.observe(node)
    // }, [loading, hasMore]);

    const pushStreamService = {  
        messageReceived: (message: any , userid: string) => {
            console.log("-----Message Received-----");
            const messageReceived = JSON.parse(message)

            if(messageReceived.value.user !== userid){
                const chats = [{
                    chatRoomId: messageReceived.value.chatId,
                    message: messageReceived.value.text,
                    messageStatus: "1",
                    messageType: "1",
                    user: {userName: "chat.app6", status: "1"},
                    userId: messageReceived.value.user
                }]
    
                setChatList(prev =>[ ...chats , ...prev ])
            }

        },
    
        subChat: (userId: string) => {
            console.log("-----Sub chat-----");
            console.log(`ws://172.20.50.77:31000/ws?Channels=` + userId);
            socket = new ReconnectingWebSocket(
                `ws://172.20.50.77:31000/ws?Channels=` + userId,
                [],
                options
            );
    
            socket.onopen = () => {
                // connection opened
                console.log("test_Connected");
                console.log(`test_ws://172.20.50.77:31000/ws?Channels=` + userId);
            };
    
            socket.onmessage = (e) => {
                console.log("-----on message");
                pushStreamService.messageReceived(
                    decodeURIComponent(JSON.parse(e.data).text),
                    userId
                );
            };
    
            socket.onerror = (e: any) => {
                // an error occurred
                console.log("test_socket_err: ", e);
            };
    
            socket.onclose = (e: any) => {
                console.log(
                "test_Socket is closed. Reconnect will be attempted in 1 second.",
                e.reason
                );
            };
            // sockets.push(ws);
        },
        closeSocket: () => {
          console.log("test_closeSocket");
          socket.close();
        },
        closeAllSocket: () => {
          console.log("test_closeAllSocket");
          sockets.map((s) => s.close());
        },
    };

    return {
        userid,
        isMainLoading,
        chatlistRef,
        chatList,
        handleScroll,
        isUpdating,
        clickFirstMessage,
        bottom
    };
}

export default ChatListAdapter;
