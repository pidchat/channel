import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import useContract from "../../hooks/useContract";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
interface IShareChannel {
  modal: boolean;
  modalToggle: () => void;
  address: string;
  name: string;
}
const ShareChannelModal: React.FC<IShareChannel> = ({
  modal,
  modalToggle,
  address,
  name,
}) => {
  const { t } = useTranslation();
  const{alert,account}= useContract();
  const handleShare = (type: string) => {
    const value_link = `🌐 ${t("TEXT_LINK")} 🚀 https://${location.host}/login?invite=${address}&name=${name}&filiate=${account}`
    if(type=="copy"){
      navigator.clipboard.writeText(value_link)
      alert(t("TEXT_COPY_LINK"),"success")
      return;
    }else  if(type=="whatsapp"){
      window.open(
        `https://wa.me/?text=${encodeURIComponent(value_link)}`,
        "_blank"
      );
    }else  if(type=="facebook"){
      window.open(
        `https://www.facebook.com/sharer/sharer?u=${encodeURIComponent(value_link)}`,
        "_blank"
      );   
    }else  if(type=="telegram"){
      window.open(
        `https://t.me/share/url?url=https://${location.host}/login?invite=${address}&name=${name}&filiate=${account}`,
        "_blank"
      );
    }else if(type=="x"){
      window.open(
        `https://x.com/intent/post?text=${encodeURIComponent(value_link)}`,
        "_blank"
      );
    }
    alert(t("TEXT_ALERT_SEND_LINK"),"success")
    
  }
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{t("TEXT_TITLE_SHARE")}</ModalHeader>
      <ModalBody>
        <p>
        {t("TEXT_DESCRIPTION_SHARE")}
        <br/>{t("TEXT_DESCRIPTION_SHARE_2")}
        </p>
      </ModalBody>
      <ModalFooter>
      <IonButton color="primary" onClick={()=>handleShare("copy")}>
          <i className="fa fa-files-o"></i>
        </IonButton>
        <IonButton color="primary" onClick={()=>handleShare("whatsapp")}>
          <i className="fa fa-whatsapp"></i>
        </IonButton>
        <IonButton color="primary" onClick={()=>handleShare("facebook")}>
          <i className="fa fa-facebook"></i>
        </IonButton>
        <IonButton color="primary" onClick={()=>handleShare("telegram")}>
          <i className="fa fa-telegram"></i>
        </IonButton>
        <IonButton color="primary" onClick={()=>handleShare("x")}>
          <i className="fa fa-twitter"></i>
        </IonButton>
      </ModalFooter>
    </Modal>
  );
};

export default ShareChannelModal;
