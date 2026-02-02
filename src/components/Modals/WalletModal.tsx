import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Form,
  FormGroup,
  ModalHeader,
  Input,
  Label,
  InputGroup,
  InputGroupText,
  Alert,
} from "reactstrap";
import classnames from "classnames";
import Identicon from "@polkadot/react-identicon";
import { IonButton, IonSelect, IonSelectOption } from "@ionic/react";
import QRCode from "react-qr-code";
import useContract from "../../hooks/useContract";
import { IInfoAccount, IInfoAccountRegister } from "../../contexts/UseProvider";
import { useTranslation } from "react-i18next";
interface IWallet {
  modal: boolean;
  modalToggle: () => void;
}
const WalletModal: React.FC<IWallet> = (props) => {
  const { t } = useTranslation();
  const {
    account,
    alert,
    balanceNative,
    balanceToken,
    getSeed,
    transferToken,
    transferBalance,
    verifyAddressValid,
    feeNetWork,
    feeGasNetWork,
    loading,
    feeSimulatedNetwork,
    feeSimulatedToken,
    clearIdentity,
    registerIdentity,
    feeIdentityNetWork,
    addChannelLocal,
    accountIdentity,
    infoRouter,
    isDarkMode,
  } = useContract();
  const [activeTab, setActiveTab] = useState("1");
  const [coinType, setCoinType] = useState("PID");
  const [showSeed, setShowSeed] = useState(false);
  const [seed, setSeed] = useState("");
  const [addressTO, setAddressTo] = useState("");
  const [amount, setAmount] = useState(0);
  const [addressError, setAddressError] = useState(true);
  const [identity, setIdentity] = useState<IInfoAccount | any>();

  useEffect(() => {
    getSeedAndAccountAux();
  }, []);
  useEffect(() => {
    setIdentity(accountIdentity);
    handleIdentity(true);
    getSeedAndAccountAux();
  }, [accountIdentity, amount, balanceNative]);
  const getSeedAndAccountAux = async () => {
    const r = await getSeed();
    setSeed(r);
  };

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  const copy = (address: string) => {
    navigator.clipboard.writeText(address);
    alert(t("TEXT_ADDRESS_LINK"), "success");
  };
  const handleTransfer = async () => {
    if (addressError) {
      alert(t("TEXT_ERROR_ADDRESS"), "error");
      return;
    }
    if (amount <= 0) {
      alert(t("TEXT_ERROR_AMOUNT"), "error");
      return;
    }
    if (coinType === "LUNES") {
      if (amount == 0 || amount > balanceNative) {
        alert(t("TEXT_ERROR_BALANCE"), "error");
        return;
      }
      await transferBalance(Math.round(amount * Math.pow(10, 8)), addressTO);
    } else {
      if (amount == 0 || amount > balanceToken) {
        alert(t("TEXT_ERROR_BALANCE"), "error");
        return;
      }
      await transferToken(
        Math.round(amount * Math.pow(10, 18)).toLocaleString("fullwide", {
          useGrouping: false,
        }),
        addressTO,
      );
    }
    alert(t("TEXT_ALERT_TRANSFER_SUCCESS"), "success");
    setAddressTo("");
    setAmount(0);
  };
  const downloadChannelTxt = () => {
    const channelAddressLocal = localStorage.getItem("PIDCHAT_channelAddress2");
    if (channelAddressLocal) {
      //crate txt to donwload
      const element = document.createElement("a");
      const file = new Blob([channelAddressLocal], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "PIDCHAT_channelAddress.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      alert(t("TEXT_ERROR_CHANNEL"), "error");
    }
  };
  const importChannelTxt = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const channelAddress = reader.result as string;
            const objectJson = JSON.parse(channelAddress);
            let isValid = true;
            if (objectJson.length > 0) {
              for (let index = 0; index < objectJson.length; index++) {
                const element = objectJson[index];
                if (!element?.address) {
                  isValid = false;
                  break;
                }
                if (!element?.type) {
                  isValid = false;
                  break;
                }
                if (!element?.name) {
                  isValid = false;
                  break;
                }
                addChannelLocal(element);
              }
            }
            if (!isValid) {
              alert(t("TEXT_ALERT_CHANNEL_INVALID"), "error");
              return;
            }
            alert(t("TEXT_ALERT_CHANNEL_SUCCESS"), "success");
          } catch (error) {
            alert(t("TEXT_ALERT_CHANNEL_INVALID"), "error");
            return;
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  const handleIdentity = async (isFee: boolean) => {
    if (!identity?.name && !isFee) {
      alert(t("TEXT_ALERT_NAME_REQUIRED"), "error");
      return;
    }
    if (balanceNative < feeIdentityNetWork && !isFee) {
      alert(t("TEXT_ERROR_BALANCE"), "error");
      return;
    }
    if (
      !isFee &&
      identity?.web &&
      !identity?.web.startsWith("https://") &&
      !identity?.web.startsWith("http://")
    ) {
      alert(t("TEXT_ERROR_WEB"), "error");
      return;
    }
    if (!isFee && identity?.twitter && !identity?.twitter.startsWith("@")) {
      alert(t("TEXT_ERROR_TWITTER"), "error");
      return;
    }
    if (
      !isFee &&
      identity?.email &&
      !identity?.email.includes("@") &&
      !identity?.email.includes(".")
    ) {
      alert(t("TEXT_ERROR_EMAIL"), "error");
      return;
    }
    const identity_: IInfoAccountRegister = {
      display: {
        Raw: identity?.name,
      },
      email: {
        Raw: identity?.email || undefined,
      },
      twitter: {
        Raw: identity?.twitter || undefined,
      },
      web: {
        Raw: identity?.web || undefined,
      },
      image: {
        Raw: identity?.image || undefined,
      },
      legal: undefined,
    };
    registerIdentity(identity_, isFee, !accountIdentity?.name);
  };

  const componentSelectWallet = (balance: number, coin: string) => {
    return (
      <FormGroup>
        <IonButton expand="full" color={"light"}>
          <Identicon value={account} theme="substrate" size={32} />{" "}
          {t("TEXT_BALANCE")} {`${balance} ${coin}`}
        </IonButton>
      </FormGroup>
    );
  };
  return (
    <Modal
      isOpen={props.modal}
      toggle={props.modalToggle}
      centered
      className="modal-dialog-zoom"
    >
      <ModalHeader toggle={props.modalToggle}>
        <i className="ti ti-wallet"></i> Wallet
      </ModalHeader>
      <ModalBody>
        {infoRouter && <Alert color="info">{infoRouter}</Alert>}
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "1" })}
              onClick={() => {
                toggle("1");
              }}
              style={{
                color: isDarkMode && activeTab !== "1" ? "#fff" : "#000",
              }}
            >
              {t("TEXT_ACCOUNT")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "2" })}
              onClick={() => {
                toggle("2");
              }}
              style={{
                color: isDarkMode && activeTab !== "2" ? "#fff" : "#000",
              }}
            >
              {t("TEXT_TRANSFER")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "3" })}
              onClick={() => {
                toggle("3");
              }}
              style={{
                color: isDarkMode && activeTab !== "3" ? "#fff" : "#000",
              }}
            >
              {t("TEXT_IDENTITY")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === "4" })}
              onClick={() => {
                toggle("4");
              }}
              style={{
                color: isDarkMode && activeTab !== "4" ? "#fff" : "#000",
              }}
            >
              {t("TEXT_BACKUP_ACCOUNT")}
            </NavLink>
          </NavItem>
        </Nav>
        <Form>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              {componentSelectWallet(balanceToken, "PID")}
              <p className="text-center text-lg-center">
                {t("TEXT_YOUR_BALANCE")} <b>{balanceNative}</b> LUNES
              </p>
              {account && (
                <QRCode
                  size={256}
                  style={{ height: "200px", maxWidth: "100%", width: "100%" }}
                  value={account || ""}
                  viewBox={`0 0 256 256`}
                />
              )}

              <p className="text-center">{account || ""}</p>
              <div
                style={{
                  margin: "auto",
                  justifyContent: "center",
                  width: "100%",
                  display: "flex",
                }}
              >
                <IonButton color="primary" onClick={() => copy(account || "")}>
                  {t("TEXT_COPY")}
                </IonButton>
              </div>
            </TabPane>
            <TabPane tabId="2">
              <IonSelect
                label={"CHOOSE COIN"}
                placeholder="LUNES or PID"
                mode="md"
                value={coinType}
                onIonChange={(e: any) => setCoinType(e.detail.value)}
              >
                <IonSelectOption value="LUNES">
                  {" "}
                  <p style={{ textTransform: "uppercase", color: "red" }}>
                    LUNES
                  </p>
                </IonSelectOption>
                <IonSelectOption value="PID">TOKEN PIDCHAT</IonSelectOption>
              </IonSelect>
              {componentSelectWallet(
                coinType === "LUNES" ? balanceNative : balanceToken,
                coinType === "LUNES" ? "LUNES" : "PID",
              )}
              <FormGroup>
                <Label for="address">{t("TEXT_ADDRESS_TO")}</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  value={addressTO}
                  onChange={(e: any) => {
                    setAddressTo(e.target.value);
                  }}
                  onBlur={async (e: any) => {
                    const isValid = await verifyAddressValid(e.target.value);
                    setAddressError(!isValid);
                  }}
                  invalid={addressError}
                  placeholder="Enter address wallet"
                />
              </FormGroup>
              <FormGroup>
                <Label for="amount">{t("TEXT_AMOUNT")}</Label>
                <Input
                  type="number"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e: any) => {
                    setAmount(Number(e.target.value));
                    feeSimulatedNetwork(
                      Math.round(Number(e.target.value || 0) * Math.pow(10, 8)),
                    );
                    if (coinType === "PID" && addressTO)
                      feeSimulatedToken(
                        Math.round(
                          Number(e.target.value || 0) * Math.pow(10, 8),
                        ).toLocaleString("fullwide", { useGrouping: false }),
                        addressTO,
                      );
                  }}
                  placeholder={t("TEXT_ENTER_AMOUNT")}
                />
              </FormGroup>
              <p className="text-center">
                {t("TEXT_FEE")}{" "}
                {coinType == "PID" ? feeNetWork + feeGasNetWork : feeNetWork}{" "}
                LUNES
              </p>
              <div
                style={{
                  margin: "auto",
                  justifyContent: "center",
                  width: "100%",
                  display: "flex",
                }}
              >
                <IonButton
                  color="primary"
                  disabled={loading}
                  onClick={() => handleTransfer()}
                >
                  {t("TEXT_SEND")}
                </IonButton>
              </div>
            </TabPane>
            <TabPane tabId="3">
              {componentSelectWallet(balanceNative, "LUNES")}
              <FormGroup>
                <InputGroup>
                  <InputGroupText addonType="prepend">
                    <i className="ti ti-user"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder={t("TEXT_USER")}
                    value={identity?.name}
                    maxLength={32}
                    onChange={(e) => {
                      setIdentity({ ...identity, name: e.target.value || "" });
                    }}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupText addonType="prepend">
                    <i className="ti ti-email"></i>
                  </InputGroupText>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={identity?.email}
                    maxLength={32}
                    onChange={(e) => {
                      setIdentity({ ...identity, email: e.target.value || "" });
                    }}
                    placeholder={t("TEXT_USER_EMAIL")}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupText addonType="prepend">
                    <i className="ti ti-twitter"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    name="twitter"
                    id="twitter"
                    value={identity?.twitter}
                    maxLength={32}
                    onChange={(e) => {
                      setIdentity({
                        ...identity,
                        twitter: e.target.value || "",
                      });
                    }}
                    placeholder={t("TEXT_USER_TWITTER")}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <InputGroupText addonType="prepend">
                    <i className="ti ti-link"></i>
                  </InputGroupText>
                  <Input
                    type="text"
                    name="web"
                    id="web"
                    value={identity?.web}
                    maxLength={33}
                    onChange={(e) => {
                      setIdentity({ ...identity, web: e.target.value || "" });
                    }}
                    placeholder={t("TEXT_USER_WEB")}
                  />
                </InputGroup>
              </FormGroup>
              <p className="text-center text-lg-center">
                {t("TEXT_FEE_IDENTITY")} <b>{feeIdentityNetWork}</b> LUNES
              </p>
              <div
                style={{
                  margin: "auto",
                  justifyContent: "center",
                  width: "100%",
                  display: "flex",
                }}
              >
                <IonButton
                  color="danger"
                  onClick={() => clearIdentity()}
                  disabled={loading || !accountIdentity?.name}
                >
                  {t("BT_CLEAR")}
                </IonButton>
                <IonButton
                  color="primary"
                  disabled={loading}
                  onClick={() => handleIdentity(false)}
                >
                  {t("BT_SAVE")}
                </IonButton>
              </div>
            </TabPane>
            <TabPane tabId="4">
              <FormGroup>
                <p className="text-center">Seed</p>
                <p
                  className="text-center"
                  onMouseDown={() => setShowSeed(true)}
                  onMouseLeave={() => setShowSeed(false)}
                >
                  {showSeed ? seed : "*********"}
                </p>
                <p className="text-center">{t("TEXT_DOWNLOAD_CHANNEL")}</p>
                <div className="text-center">
                  <IonButton
                    color="primary"
                    disabled={loading}
                    onClick={() => downloadChannelTxt()}
                  >
                    {t("BT_DOWNLOAD")}
                  </IonButton>

                  <IonButton
                    color="primary"
                    disabled={loading}
                    onClick={() => importChannelTxt()}
                  >
                    {t("BT_IMPORT")}
                  </IonButton>
                </div>

                <div
                  style={{
                    margin: "auto",
                    justifyContent: "center",
                    width: "100%",
                    display: "flex",
                  }}
                ></div>
              </FormGroup>
            </TabPane>
          </TabContent>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default WalletModal;
