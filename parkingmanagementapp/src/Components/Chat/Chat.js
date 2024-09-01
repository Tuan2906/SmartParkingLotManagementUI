import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  orderBy,
  doc,
  updateDoc,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig";
import cookies from "react-cookies";

const defaultAvatar = "https://via.placeholder.com/50x50.png?text=No+Avatar";

const Chat = () => {
  const { postOwnerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const flatListRef = useRef(null);
  const location = useLocation();

  const isNhanVien = location.state?.id_nv;
  console.log(isNhanVien);
  const currentUser = cookies.load('user');
  // if (isNhanVien === "true") {
  //   currentUser = JSON.parse(localStorage.getItem("user"));
  // } else {
  //   currentUser = JSON.parse(localStorage.getItem("user"));
  //   // cookies.load("user");
  // }

  useEffect(() => {
    const fetchConversation = async () => {
      const q = query(
        collection(firestore, "conversations"),
        where("participantIds", "array-contains", currentUser.id)
      );

      const snapshot = await getDocs(q);
      let foundConversation = null;

      snapshot.forEach((doc) => {
        const conversation = doc.data();
        // Check if conversation includes both currentUser.id and postOwnerId
        console.log(conversation);
        if (
          conversation.participantIds.includes(currentUser.id) &&
          conversation.participantIds.includes(isNhanVien)
        ) {
          foundConversation = { id: doc.id, ...conversation };
        }
      });

      if (foundConversation) {
        setCurrentConversationId(foundConversation.id);
        loadMessages(foundConversation.id);
      } else {
        const newConversation = {
          participantIds: [currentUser.id, isNhanVien],
          latestMessage: "",
          latestTime: "",
          createdAt: Timestamp.fromDate(new Date()),
          lastMessageId: "",
        };

        const newConversationRef = await addDoc(
          collection(firestore, "conversations"),
          newConversation
        );
        setCurrentConversationId(newConversationRef.id);
        loadMessages(newConversationRef.id);
      }
    };

    const loadMessages = (conversationId) => {
      const msgsQuery = query(
        collection(firestore, "chats", conversationId, "messages"),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(msgsQuery, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);

        if (flatListRef.current) {
          flatListRef.current.scrollTop = flatListRef.current.scrollHeight;
        }
      });

      return unsubscribe;
    };

    fetchConversation();

    return () => {
      setMessages([]);
    };
  }, [isNhanVien]);
  const handleSend = async () => {
    if (newMessage.trim() && currentConversationId) {
      const newMessageObj = {
        text: newMessage,
        senderId: currentUser.id,
        timestamp: Timestamp.fromDate(new Date()),
      };
      const messageDocRef = await addDoc(
        collection(firestore, "chats", currentConversationId, "messages"),
        newMessageObj
      );

      const conversationRef = doc(
        firestore,
        "conversations",
        currentConversationId
      );
      await updateDoc(conversationRef, {
        latestMessage: newMessage,
        latestTime: new Date().toLocaleTimeString(),
        lastMessageId: messageDocRef.id,
      });

      setNewMessage("");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        maxWidth: "800px",
        margin: "140px auto",
      }}
    >
      <div
        ref={flatListRef}
        style={{
          overflowY: "auto",
          flex: 1,
          padding: "10px",
          border: "1px solid #ddd",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "gray" }}>
            No messages yet. Start the conversation!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor:
                    msg.senderId === currentUser.id ? "#007bff" : "#ddd",
                  color: msg.senderId === currentUser.id ? "#fff" : "#333",
                  alignSelf:
                    msg.senderId === currentUser.id ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                }}
              >
                <img
                  src={
                    msg.senderId === currentUser.id
                      ? currentUser.avatar || defaultAvatar
                      : defaultAvatar
                  }
                  alt="User Avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginLeft: msg.senderId === currentUser.id ? "10px" : "0",
                    marginRight: msg.senderId === currentUser.id ? "0" : "10px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ margin: 0 }}>{msg.text}</p>
                  <small>{msg.timestamp.toDate().toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "10px",
            marginLeft: "5px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;