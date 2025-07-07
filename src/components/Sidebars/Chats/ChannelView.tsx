import Identicon from "@polkadot/react-identicon";
import ChatsDropdown from "./ChatsDropdown";
import { truncateText } from "../../../utils";
import useContract from "../../../hooks/useContract";
import { useEffect, useState } from "react";

const ChannelView = (props: any) => {
  const { channel, electedChat, chatSelectHandle } = props;
  const [count, setCount] = useState(0);
  const { listMessageEvent } = useContract();
  useEffect(() => {    
    addMessageListen();
  }, [listMessageEvent]);
  const addMessageListen = () => {
    setCount(0);
    let countNewMessage = 0;
    for (const item of listMessageEvent) {
      if (item.addressContract === channel?.address) {        
        countNewMessage = item.listMessage.length;
        break;
      }      
    }
    setCount(countNewMessage);
  };
  return (
    <li
      className={
        "list-group-item " +
        (electedChat == channel?.address ? "open-chat" : "")
      }
      onClick={() => chatSelectHandle(channel?.address)}
    >
      <figure className="avatar avatar-state-success">
        <Identicon value={channel?.address} theme="substrate" size={32} />
      </figure>
      <div className="users-list-body">
        <h5>{channel.name}</h5>
        {truncateText(channel.address, 7, 10, false)}
        <div className="users-list-action action-toggle">
          {count ? <div className="new-message-count">{count}</div> : ""}
          <ChatsDropdown contract={channel.address} />
        </div>
      </div>
    </li>
  );
};

export default ChannelView;
