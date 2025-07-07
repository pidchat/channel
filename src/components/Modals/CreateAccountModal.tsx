import Identicon from "@polkadot/react-identicon";
import React, { useEffect, useState } from "react";
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
import { mnemonicGenerate, mnemonicValidate } from "@polkadot/util-crypto";
import { IonButton, IonGrid, useIonAlert } from "@ionic/react";
import { useTranslation } from "react-i18next";
import useContract from "../../hooks/useContract";
interface ICreateAccount {
  modal: boolean;
  modalToggle: () => void;
}
const CreateAccountModal: React.FC<ICreateAccount> = ({
  modal,
  modalToggle,
}) => {
  const { t } = useTranslation();
  const [words, setWords] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [passAlert] = useIonAlert();
  const {
      alert,
      createAccount,
    } = useContract();
  useEffect(() => {
    setWords([]);
    generateWords();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      const input = document.getElementById("word1") as HTMLInputElement;
      if (input) input.focus();
    }, 1000);
  },[]);
  const generateWords = (isEmpty: boolean = true, qtd: number = 12) => {
    let words_new: string[] = [];
    if (isEmpty) {
      for (let index = 0; index < qtd; index++) {
        words_new.push("");
      }
    } else {
      const mnemonic = mnemonicGenerate(qtd === 12 ? 12 : 24);
      words_new = mnemonic.split(" ");
    }
    setWords(words_new);
  };
  const onBlurSeedComplete = (text: string) => {
    if (text && text.split(" ").length >= 12) {
      setWords(
        text
          .replace(/,(?!\d)/g, "")
          .trim()
          .split(" ")
      );
    }
  };
  const setTextInput = (index: number, value: string) => {
    let arr = [...words];
    arr[index] = value.toLocaleLowerCase();
    setWords(arr);
  };
  const handlePassword = () => {
    if(!password){
      alert(t("TEXT_ERROR_PASSWORD"), "error");
      return;
    }
      passAlert({
        header: t("TEXT_ENTER_PASSWORD"),
        inputs: [
          {
            name: "password",
            type: "password",
            placeholder: t("TEXT_ENTER_PASSWORD"),
            id: "passwordInput",                    
          },
        ],
        buttons: [
          {
            text: t("TEXT_CANCEL"),
            role: "cancel",
          },
         
          {
            text:t("TEXT_ENTER"),
            handler: (data: any) => {
              if (data.password && data.password == password) {
                const ok = createAccount(words.join(" "), data.password);                
                if(ok){
                  modalToggle();
                }
              }else{
                alert(t("TEXT_ERROR_PASSWORD"), "error");
              }
            },
          },
        ],
      });
      setTimeout(() => {
        const input = document.getElementById("passwordInput") as HTMLInputElement;
        if (input) {
          input.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
              const okButton = document.querySelector("button.alert-button") as HTMLButtonElement;    
              createAccount(words.join(" "), input.value);      
              if (okButton) {
                okButton.click();
              }
            }
          });
          input.focus();
        }
      }, 100);
    };
  return (
    <Modal
      className="modal-dialog-zoom"
      isOpen={modal}
      toggle={modalToggle}
      centered
    >
      <ModalHeader toggle={modalToggle}>
        {t("TEXT_TITLE_CREATE_ACCOUNT")}
      </ModalHeader>
      <ModalBody>
        <p>{t("TEXT_INFO_SEED")}</p>
        <div className="wrapper">
          {words.map((word, index) => (
            <FormGroup key={index} style={{ width: "100px" }}>
              <Label>
                {" "}
                {t("TEXT_WORD")} N. {index + 1}
              </Label>
              <Input
                type="text"
                value={word}
                style={{ textAlign: "center" }}
                id={`word${index + 1}`}
                onBlur={(e) => onBlurSeedComplete(e.target.value)}
                onChange={(e) => setTextInput(index, e.target.value)}
              />
            </FormGroup>
          ))}
        </div>
        <FormGroup>
          <Label for="password">{t("TEXT_SET_PASSWORD")}</Label>
          <Input
            type="password"
            name="password"
            id="password"
            style={{ textAlign: "center" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <IonButton color="danger" onClick={() => modalToggle()}>
          {t("TEXT_CANCEL")}
        </IonButton>
        <IonButton
          color="warning"
          onClick={() => {
            generateWords(false, 12);
          }}
        >
          {t("TEXT_AUTOMATIC")}
        </IonButton>
        <IonButton color="primary" onClick={() => handlePassword()}>
          {t("BT_SAVE_ACCOUNT")}
        </IonButton>
      </ModalFooter>
    </Modal>
  );
};

export default CreateAccountModal;
