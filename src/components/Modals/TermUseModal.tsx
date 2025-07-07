import Identicon from "@polkadot/react-identicon";
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
interface ITermUse {
  modal: boolean;
  modalToggle: () => void;
  handleCreate: () => void;
}
const TermUseModal: React.FC<ITermUse> = ({
  modal,
  modalToggle,
  handleCreate,
}) => {
  const { t } = useTranslation();

  const handleAccept = () => {
    handleCreate();
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{t("TEXT_TERMS_OF_USE")}</ModalHeader>
      <ModalBody>
        <p className="text-center ion-text-justify">
          <h1>DISCLAIMER - PIDCHAT</h1>

          <h2>Decentralization and Data Storage</h2>
          <p>
            PidChat is a fully decentralized platform. All data and information
            provided by users are stored directly on a public blockchain, in an
            immutable and permanent manner.
          </p>
          <p>
            PidChat does not store, access, or manage any user information
            outside the blockchain environment.
          </p>
          <p>
            Therefore, users are solely responsible for the content and accuracy
            of the information they provide.
          </p>

          <h2>Disclaimer of Liability</h2>
          <p>
            PidChat is not liable for any civil, criminal, or administrative
            consequences related to the information, messages, files, or any
            other data inserted, transmitted, or stored by users on the network.
          </p>
          <p>
            The user understands and accepts that, as a decentralized network,
            there is no centralized moderation or control over the data.
          </p>

          <h2>Minimum Age Requirement</h2>
          <p>
            The use of PidChat is strictly prohibited for minors, according to
            the age of majority laws applicable in their country of residence.
          </p>
          <p>
            By using the platform, the user declares to be of legal age and
            fully capable, releasing PidChat from any responsibility regarding
            the verification of this condition.
          </p>

          <h2>Consent</h2>
          <p>
            The user declares that they have read, understood, and fully agree
            with this disclaimer, accepting all risks and responsibilities
            associated with using a decentralized and blockchain-based platform.
          </p>
        </p>
      </ModalBody>
      <ModalFooter>
        <IonButton color="danger" onClick={modalToggle}>
          {t("BT_REJECT")}
        </IonButton>
        <IonButton color="primary" onClick={handleAccept}>
          {t("BT_ACCEPT")}
        </IonButton>
      </ModalFooter>
    </Modal>
  );
};

export default TermUseModal;
