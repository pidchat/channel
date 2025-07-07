import Identicon from "@polkadot/react-identicon";
import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import useContract from "../../hooks/useContract";
import { IonButton } from "@ionic/react";
import { useTranslation } from "react-i18next";
interface IAddChanel {
  modal: boolean;
  modalToggle: () => void;
}
const AddChannelModal: React.FC<IAddChanel> = ({
  modal,
  modalToggle
}) => {
  const { t } = useTranslation();
  const{addNewChannelContract,verifyChannelLocalName,alert}= useContract();
  const [address, setAddress] = React.useState("");
  const [name , setName] = useState("");
  const [validName , setValidName] = useState(false);
  const verifyName = async () => {
    const value =  verifyChannelLocalName(name);
    setValidName(!value);
  };
  const handleSubmit = async () => {
    if(verifyChannelLocalName(name)) {
      setValidName(false);
      alert(t("TEXT_NAME_CHANNEL_INVALID"), "error");
      return;
    }
    const s = await addNewChannelContract(address,name);
    if(s) {
      alert(t("TEXT_ALERT_CHANNEL_SUCCESS"), "success");
      setAddress("");
      setName("");
      modalToggle();
      return;
    }
    
  };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>{t("TEXT_TITLE_SUBSCRIBE")}</ModalHeader>
      <ModalBody>
        <p>
          {t("TEXT_TITLE_UNSUBSCRIBE")}
        </p>
        <Form>
        <FormGroup>
            <Label for="name">{t("TEXT_FIELD_NAME_CHANNEL")}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={name}
              valid={validName}
              onBlur={()=>verifyName()}
              onChange={(e) => setName(e.target.value)}
            />
          </FormGroup>
          <FormGroup  className="position-relative">
           <Label for="name">{t("TEXT_FIELD_ADDRESS_CHANNEL")}</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("TEXT_FIELD_ENTER_ADDRESS")}
            />           
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <IonButton color="primary" onClick={handleSubmit}>
          {t("BT_SUBSCRIBE")}
        </IonButton>
      </ModalFooter>
    </Modal>
  );
};

export default AddChannelModal;
