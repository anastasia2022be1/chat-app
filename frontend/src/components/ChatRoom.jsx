import socketIO from 'socket.io-client'
import Body from './Body.jsx'
import Message from './Message.jsx'

// Initializing Socket.IO
const socket = socketIO.connect('http://localhost:3000');

const ChatRoom = () => {
  return (
        <section className="flex flex-col flex-grow">
          <div className="flex-grow overflow-y-auto">
            <Body socket={socket} />
          </div>
          <div className="bg-white border-t border-gray-300">
            <Message socket={socket} />
          </div>
        </section>
  )
}

export default ChatRoom