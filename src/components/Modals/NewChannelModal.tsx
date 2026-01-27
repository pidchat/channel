import Identicon from "@polkadot/react-identicon";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { truncateText } from "../../utils";
import useContract from "../../hooks/useContract";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
interface INewChanel {
  modal: boolean;
  modalToggle: () => void;
}
const NewChannelModal: React.FC<INewChanel> = ({ modal, modalToggle }) => {
  const { t } = useTranslation();
  const {
    createChannel,
    balanceNative,
    feeCreateChannel,
    loading,
    infoRouter,
    account,
    verifyChannelLocalName,
    alert,
  } = useContract();
  const [feeChannel, setFeeChannel] = useState(0);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [isPrivate , setIsPrivate] = useState(false);
  useEffect(() => {
    calcFeeContract();
  }, [description]);
  const calcFeeContract = async () => {
    const descriptionArray = description.split("\n");
    const value = await feeCreateChannel(descriptionArray, "String");
    setFeeChannel(value);
  };
  const handleCreate = async () => {
    if (verifyChannelLocalName(name)) {
      setValidName(false);
      alert(t("TEXT_NAME_CHANNEL_INVALID"), "error");
      return;
    }
    const descriptionArray = description.split("\n");
    await createChannel(name, descriptionArray, "String", isPrivate);
    setName("");
    setDescription("");
    modalToggle();
  };
  const verifyName = async () => {
    const value = verifyChannelLocalName(name);
    setValidName(!value);
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>
        <Identicon value={account} theme="substrate" size={32} />{" "}
        <span style={{ fontSize: "14px" }}>
          {" "}
          {truncateText(account || "", 7, 10, false)}
        </span>
      </ModalHeader>
      <ModalBody>
        {infoRouter && <Alert color="info">{infoRouter}</Alert>}
        <Form>
        <FormGroup>
            <Label for="name">{t("TEXT_FIELD_PRIVATE_CHANEL")}</Label>
            <Input
              type="checkbox"
              name="isPrivate"
              id="isPrivate"
              style={{marginLeft: "10px", marginRight: "10px"}}
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <Label for="name">{t("TEXT_INFO_PRIVATE")}</Label>
          </FormGroup>
          <FormGroup>
            <Label for="name">{t("TEXT_FIELD_NAME_CHANNEL")}</Label>            
            <Input
              type="text"
              name="name"
              id="name"
              valid={validName}
              onBlur={() => verifyName()}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">{t("TEXT_DESCRIPTION_CHANNEL")}</Label>
            <Input
              type="textarea"
              name="email"
              id="email"
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormGroup>
        </Form>
        <p className="text-center">
          {t("TEXT_YOUR_BALANCE")} <b>{balanceNative}</b> Lunes
        </p>
        <p className="text-center">
          {t("TEXT_FEE_CREATION")} <b>{feeChannel / 100000000}</b> Lunes
        </p>
      </ModalBody>
      <ModalFooter>
        <IonButton disabled={loading} color="primary" onClick={handleCreate}>
          {loading ? t("TEXT_LOADING") : t("BT_CREATE")}
        </IonButton>
      </ModalFooter>
    </Modal>
  );
};

export default NewChannelModal;
