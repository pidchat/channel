import Identicon from "@polkadot/react-identicon";
import React, { useContext, useEffect, useState } from "react";

import { truncateText } from "../../utils";
import { IonButton, IonLoading, useIonAlert } from "@ionic/react";
import useContract from "../../hooks/useContract";
import { UseProviderContext } from "../../contexts/UseProvider";
import ShareChannelModal from "../Modals/ShareChannelModal";
import { useTranslation } from "react-i18next";
import AddMemberModal from "../Modals/AddMemberModal";
interface ChatAddress {
  name: string;
  avatar: any;
}
interface Props {
  selectedChat: ChatAddress | any;
}
const ChatHeader: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation();
  const { setContractSelected } = useContext(UseProviderContext);
  const {
    getMessageDefaultChannel,
    searchAddress,
    alert,
    verifyContractAndRemove,
    loading,
    account,
    isOwner,
    get_private,
  } = useContract();
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string>("");
  const [presentAlert] = useIonAlert();
  const [infoAlert] = useIonAlert();
  const [modal, setModal] = useState(false);
  const [isOwnerAddUser, setIsOwnerAddUser] = useState(false);
  const [isPrivate, setPrivate] = useState(false);
  const [modalAddUser, setModalAddUser] = useState(false);
  const modalAddUserToggle = () => {
    setModalAddUser(!modalAddUser);
  };
  const modalToggle = () => {
    setModal(!modal);
  };
  useEffect(() => {
    if (props?.selectedChat) {
      getData();
    }
  }, [props?.selectedChat, account]);
  const getData = async () => {
    const chanel: any = await searchAddress(props?.selectedChat);
    if (chanel) {
      setName(chanel?.name);
    }
    const messageDefault: any = await getMessageDefaultChannel(
      props?.selectedChat,
    );
    let m = "";
    if (messageDefault) {
      messageDefault?.map((item: string) => {
        m += item;
      });

      const w = await isOwner(props?.selectedChat);
      setIsOwnerAddUser(w || false);
      const isPrivate = await get_private(props?.selectedChat);
      setPrivate(isPrivate || false);
    }
    //const balanceToken  = await balanceContract(props?.selectedChat,false);
    //const balanceNative  = await balanceContract(props?.selectedChat,true);
    //m += `\t\tPID: ${balanceToken}\n\n LUNES: ${balanceNative}`
    setMessage(m);
  };
  const openInfo = async () => {
    infoAlert({
      header: t("TEXT_ABOUT_CHANNEL"),
      message: message,
      buttons: [
        {
          text: "Ok",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
  };
  const copy = () => {
    navigator.clipboard.writeText(props?.selectedChat);
    alert(t("TEXT_ADDRESS_LINK"), "success");
  };
  const removeChannel = async () => {
    presentAlert({
      header: t("TEXT_REMOVE_CHANNEL"),
      message: t("TEXT_REMOVE_CHANNEL_ALERT"),
      buttons: [
        {
          text: t("TEXT_NO"),
          role: "cancel",
          handler: () => {},
        },
        {
          text: t("TEXT_YES"),
          handler: async () => {
            await verifyContractAndRemove(props?.selectedChat);
            setContractSelected("");
          },
        },
      ],
    });
  };
  return (
    <div className="chat-header">
      <div className="chat-header-user">
        <figure className="avatar avatar-state-success">
          <Identicon value={props?.selectedChat} theme="substrate" size={32} />
        </figure>
        <div>
          <h5>
            {name}{" "}
            {isPrivate ? (
              <i className="ti ti-lock"></i>
            ) : (
              <i className="ti ti-world"></i>
            )}{" "}
          </h5>
          <small className="text-muted" onClick={() => copy()}>
            <i> {truncateText(props?.selectedChat, 7, 10, false)}</i>
          </small>
          <p className="text-muted">
            {isOwnerAddUser ? t("TEXT_OWNER") : t("TEXT_MEMBER")}
          </p>
        </div>
      </div>

      <div className="chat-header-action">
        <ul className="list-inline">
          {isPrivate && isOwnerAddUser ? (
            <li
              className="list-inline-item"
              data-toggle="tooltip"
              title="Add User"
            >
              <IonButton
                onClick={() => setModalAddUser(true)}
                size="small"
                color={"warning"}
              >
                <i className="ti ti-user"></i>
              </IonButton>
            </li>
          ) : (
            ""
          )}
          <li className="list-inline-item" data-toggle="tooltip" title="About">
            <IonButton onClick={() => openInfo()} size="small" color={"light"}>
              <i className="ti ti-info"></i>
            </IonButton>
          </li>
          <li className="list-inline-item" data-toggle="tooltip" title="Share">
            <IonButton onClick={() => setModal(true)} size="small">
              <i className="ti ti-share"></i>
            </IonButton>
          </li>
          <li
            className="list-inline-item"
            data-toggle="tooltip"
            title="Unsubscribe"
          >
            <IonButton
              color="danger"
              onClick={() => removeChannel()}
              size="small"
            >
              <i className="ti ti-trash"></i>
            </IonButton>
          </li>
        </ul>
      </div>
      <IonLoading
        trigger="open-loading"
        isOpen={loading}
        message="Loading..."
        duration={3000}
        spinner="circles"
      />
      <ShareChannelModal
        modal={modal}
        modalToggle={modalToggle}
        patch={`login?invite=${props.selectedChat}&name=${name}`}
      />
      <AddMemberModal modal={modalAddUser} modalToggle={modalAddUserToggle} />
    </div>
  );
};

export default ChatHeader;
