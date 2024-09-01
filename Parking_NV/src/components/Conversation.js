import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import cookies from "react-cookies";
import { Button } from "react-bootstrap";
import { firestore } from "./firebaseConfig";

// Default avatar URL
const defaultAvatar = "https://via.placeholder.com/50x50.png?text=No+Avatar";

const Conversation = () => {
  const [conversations, setConversations] = useState([]);
  const location = useLocation();
  const isNhanVien = location.state?.id_nv;
  const nav = useNavigate();

  const currentUser = cookies.load("user");

  // if (isNhanVien === "true") {
  //   currentUser = JSON.parse(cookies.load("user"));
  // } else {
  //   currentUser = cookies.load("user");
  // }
  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(firestore, "conversations"),
        where("participantIds", "array-contains", currentUser.id)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const convos = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(currentUser.id)
          console.log(data.participantIds)
          const otherUserId = data.participantIds.find(
            (userId) => userId !== currentUser.id
          );
          return {
            id: doc.id,
            ...data,
            otherUserId, // Include the ID of the other participant
          };
        });
        console.log(convos);
        setConversations(convos);
      });

     return () => unsubscribe();
    }
  }, []);
  const handleClick = (id_nv) => {
    // Xử lý khi nhấn vào nút
    nav("/chat", { state: { id_nv: id_nv } });
  };
  return (
    <div className="mt-10" style={{marginTop:100}}>
      <h1 className="text-success">TIN NHẮN</h1>
      {conversations.map((convo) => (
        <div key={convo.id} style={{ marginBottom: "10px" }}>
          {console.log(convo.participantIds[1]!=currentUser.id)}
          <Button
            onClick={() => handleClick(convo.participantIds[1]==currentUser.id?convo.participantIds[0]:convo.participantIds[1])}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={convo.avatar ? convo.avatar : defaultAvatar} // Display conversation's avatar or default if not available
                alt="Avatar"
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
              <div style={{ marginLeft: "10px" }}>
                <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>
                  {convo.latestMessage || "No messages yet"}{" "}
                </p>
                <small style={{ color: "#888" }}>
                  {convo.latestTime || "No time available"}{" "}
                </small>
              </div>
            </div>
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Conversation;
