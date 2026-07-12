import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';
import useUserList from '../hooks/useUserList';
import useConversation from '../hooks/useConversation';
import useTypingIndicator from '../hooks/useTypingIndicator';
import MainLayout from '../layouts/MainLayout';
import Sidebar from '../components/Sidebar/Sidebar';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatWindow from '../components/Chat/ChatWindow';
import MessageInput from '../components/Chat/MessageInput';
import ErrorBanner from '../components/common/ErrorBanner';

const ChatPage = () => {
  const { user } = useAuth();
  const { socket, isConnected, socketError } = useSocket();
  const { users, isLoading: usersLoading, error: usersError } = useUserList(socket, user);
  const [activeChat, setActiveChat] = useState(null);

  const { messages, isLoading: messagesLoading, error: messagesError, sendMessage } = useConversation(
    socket,
    user,
    activeChat
  );
  const { isOtherTyping, notifyTyping, notifyStopTyping } = useTypingIndicator(socket, user, activeChat?._id);

  // Keep the active chat's presence info in sync with the live user list
  const liveActiveChat = activeChat ? users.find((u) => u._id === activeChat._id) || activeChat : null;

  return (
    <MainLayout users={users} onSelectChat={setActiveChat}>
      <Sidebar
        currentUser={user}
        users={users}
        isLoading={usersLoading}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {(socketError || usersError) && (
          <div className="px-6 pt-4">
            <ErrorBanner message={socketError || usersError} />
          </div>
        )}

        {liveActiveChat ? (
          <>
            <ChatHeader contact={liveActiveChat} isOtherTyping={isOtherTyping} isConnected={isConnected} />
            {messagesError && (
              <div className="px-6 pt-3">
                <ErrorBanner message={messagesError} />
              </div>
            )}
            <ChatWindow
              messages={messages}
              currentUserId={user._id}
              isLoading={messagesLoading}
              isOtherTyping={isOtherTyping}
              contactName={liveActiveChat.username || liveActiveChat.mobileNumber}
            />
            <MessageInput
              onSend={sendMessage}
              onTyping={notifyTyping}
              onStopTyping={notifyStopTyping}
              disabled={!isConnected}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-gray-400 px-6">
            <div className="w-16 h-16 rounded-2xl bg-accent-50 flex items-center justify-center text-accent-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="font-bold text-navy-900">Select a conversation</h2>
            <p className="text-sm max-w-xs">
              Choose someone from the list to start chatting in real time.
            </p>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default ChatPage;
