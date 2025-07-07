import Identicon from "@polkadot/react-identicon";
import React, { useContext, useState } from "react";
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
import { UseProviderContext } from "../../contexts/UseProvider";
interface IAddMember {
  modal: boolean;
  modalToggle: () => void;
}
const AddMemberModal: React.FC<IAddMember> = ({
  modal,
  modalToggle
}) => {
  const { contractSelected} = useContext(UseProviderContext);
  const { t } = useTranslation();
  const{add_user_channel, alert, loading}= useContract();
  const [address, setAddress] = React.useState("");
  
  const handleSubmit = async (permission:boolean) => {  
    const s = await add_user_channel(contractSelected, address,permission);
    if(s) {
      alert(t("TEXT_ACCESS_SAVE"), "success");
      setAddress("");
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
      <ModalHeader toggle={modalToggle}>{t("TEXT_ACCESS_USER_CHANNEL")}</ModalHeader>
      <ModalBody>
        <p>
          {t("TEXT_PERMISSIONS")}
        </p>
        <Form>
        <FormGroup>
            <Label for="address">{t("TEXT_ADDRESS_ACCOUNT")}</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </FormGroup>         
        </Form>
      </ModalBody>
      <ModalFooter>
      <IonButton color="danger" onClick={() => handleSubmit(false)} disabled={loading}>
          {t("TEXT_REVOKE")}
        </IonButton>
        <IonButton color="primary" onClick={() => handleSubmit(true)} disabled={loading}>
          {t("TEXT_PERMISSION")}
        </IonButton>
      </ModalFooter>
    </Modal>
  );
};

export default AddMemberModal;
