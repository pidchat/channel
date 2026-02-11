import { useContext, useEffect, useState } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonImg,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonFooter,
  useIonRouter,
  useIonAlert,
  useIonViewWillEnter,
} from "@ionic/react";
import { UseProviderContext } from "../contexts/UseProvider";
import Logo from "../assets/img/logo.svg";
import LogoBR from "../assets/img/br.png";
import LogoFR from "../assets/img/fr.png";
import LogoES from "../assets/img/es.png";
import LogoUS from "../assets/img/us.png";
//import SubWallet from "../assets/img/subwallet.jpeg";
import LUNES from "../assets/img/LUNES.svg";

import useContract from "../hooks/useContract";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { truncateText } from "../utils";
import CreateAccountModal from "../components/Modals/CreateAccountModal";
import {
  AppUpdate,
  AppUpdateAvailability,
} from "@capawesome/capacitor-app-update";
import { Capacitor } from "@capacitor/core";
const size = "32px";
const Web3Auth: React.FC = () => {
  const { t, i18n } = useTranslation();
  const router = useIonRouter();
  const [modal, setModal] = useState(false);
  const { apiReady, api, account, setMobileSidebar,setMenuBar } = useContext(UseProviderContext);
  const {
    addChannelLocal,
    verifyChannelLocalName,
    authenticate,
  } = useContract();
  const [passAlert] = useIonAlert();
  const location = useLocation();
  const modalToggle = () => setModal(!modal);

  useIonViewWillEnter(() => {
    setMenuBar(false);
    setMobileSidebar(false);
  });
  const performImmediateUpdate = async () => {
    const result = await AppUpdate.getAppUpdateInfo();
    if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
      return;
    }
    if (result.immediateUpdateAllowed) {
      await AppUpdate.performImmediateUpdate();
    }
  };
  useEffect(() => {
     if (Capacitor.getPlatform() === "android") {
      performImmediateUpdate();
    }
  }, []);
  useEffect(() => {
    if (apiReady) {
      if (account) {
        router.push("/news");
      }
    }
    
  }, [account, apiReady]);
  useEffect(() => {
    if (!apiReady || !api) return;
    const params = new URLSearchParams(location.search);
    const inviteAddress = params.get("invite");
    const channelName = params.get("name");
    const userID = params.get("userID");
    if (userID) localStorage.setItem("PIDCHAT_userId", userID);
    if (inviteAddress && channelName) {
      if (!verifyChannelLocalName(channelName)) {
        addChannelLocal({
          name: channelName,
          address: inviteAddress,
          type: "String",
        });
      }
    }
  }, [apiReady, location]);
  const handlePassword = () => {
    const savedAccount = localStorage.getItem("PIDCHAT_accountId");
    passAlert({
      subHeader: "" + truncateText(savedAccount || "", 7, 10, false),
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
          text: t("TEXT_OTHER_ACCOUNT"),          
          handler: () => {
            setModal(true);
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text:t("TEXT_ENTER"),
          handler: (data: any) => {
            if (data.password) {
              authenticate(data.password);
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
            authenticate(input.value);
            if (okButton) {
              okButton.click();
            }
          }
        });
        input.focus();
      }
    }, 100);
  };
  const handleSeed = () => {};
  const handleConnect = async () => {
    const seedLocal = localStorage.getItem("PIDCHAT_seedChannel");
    if(seedLocal) {
      handlePassword();
    }else{
      setModal(true);
    }
    
  };

  return (
    <IonPage>
      <IonContent color="light">
        <CreateAccountModal modal={modal} modalToggle={modalToggle} />
        <IonGrid>
          <IonRow>
            <IonCol size="12" className="logoContainer">
              <IonImg src={Logo} alt="PidChat" className="logo" />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" className="textContainer">
              <IonText>
                <h2 className="title">{"PIDCHAT"}</h2>
                <p className="subtitle">{t("TEXT_DECENTRALIZED_MESSAGE")}</p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <IonButton
                    fill="clear"
                    onClick={() => i18n.changeLanguage("pt-BR")}
                  >
                    <img
                      src={LogoBR}
                      alt="logo"
                      width={size}
                      height={size}
                      style={{ margin: "0 auto", display: "block" }}
                    />
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => i18n.changeLanguage("fr-FR")}
                  >
                    <img
                      src={LogoFR}
                      alt="logo"
                      width={size}
                      height={size}
                      style={{ margin: "0 auto", display: "block" }}
                    />
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => i18n.changeLanguage("es")}
                  >
                    <img
                      src={LogoES}
                      alt="logo"
                      width={size}
                      height={size}
                      style={{ margin: "0 auto", display: "block" }}
                    />
                  </IonButton>
                  <IonButton
                    fill="clear"
                    onClick={() => i18n.changeLanguage("en-US")}
                  >
                    <img
                      src={LogoUS}
                      alt="logo"
                      width={size}
                      height={size}
                      style={{ margin: "0 auto", display: "block" }}
                    />
                  </IonButton>
                </div>
              </IonText>
            </IonCol>
          </IonRow>

          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6">
              <IonButton
                expand="block"
                size="large"
                style={{width:"50%", margin:"0 auto"}}
                disabled={!apiReady}
                onClick={handleConnect}
              >
                <i className="ti ti-wallet" style={{ marginRight: "10px" }}></i>{" "}
                <span className="buttonText">{t("TEXT_ENTER")}</span>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" className="compatibleWallets">
              <p className="compatibleTitle">
                {t("TEXT_BLOCKCHAIN_COMPATIBILITY")}
              </p>
              <div className="walletIcons">
                <a
                  className="walletItem"
                  href="https://lunes.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={LUNES} alt="LUNES" />
                </a>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" className="socialLinks">
              <a
                href="https://www.instagram.com/pidchat.token"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-instagram"></i>
              </a>
              <a
                href="https://x.com/TokenPidchat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-twitter"></i>
              </a>
              <a
                href="https://github.com/pidchat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="ti ti-github"></i>
              </a>
            </IonCol>
            <IonRow>
              <IonCol size="12" className="socialLinks">
                <p>© 2025 PidChat. All rights reserved.</p>
              </IonCol>
            </IonRow>
          </IonRow>
        </IonGrid>
      </IonFooter>
     
    </IonPage>
  );
};

export default Web3Auth;
