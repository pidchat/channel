import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
interface IIssueChannel {
  modal: boolean;
  modalToggle: () => void;
}
const SupportChannelModal: React.FC<IIssueChannel> = (
  { modal, modalToggle }
) => {
  const { t } = useTranslation();
  const handleLink = () => {
    const value_link = `https://t.me/pidchat`
    window.open(
      `${value_link}`,
      "_blank"
    );
    
  }
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>🚨 Support and Helping🚨</ModalHeader>
      <ModalBody>
        <p>
        Our support channel is <strong>@pidchat</strong> on Telegram.
        <br/>
       {t("TEXT_HELPING")}
        </p>
      </ModalBody>
      <ModalFooter>
      <IonButton color="danger" onClick={()=>modalToggle()}>
          Cancel
      </IonButton>
      <IonButton color="primary" onClick={()=>handleLink()}>
          Open
      </IonButton>
       
      </ModalFooter>
    </Modal>
  );
};

export default SupportChannelModal;