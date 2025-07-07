import React, { useContext } from "react";
import ChatsIndex from "./Chats";
import { UseProviderContext } from "../../contexts/UseProvider";

function Index() {
  const { mobileSidebar } = useContext(UseProviderContext);

  return (
    <div className={`sidebar-group ${mobileSidebar ? "mobile-open" : ""}`}>
      <ChatsIndex />
    </div>
  );
}

export default Index;
