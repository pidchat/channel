import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/img/logo.svg";
import { UseProviderContext } from "../contexts/UseProvider";
import useContract from "../hooks/useContract";
import WalletModal from "./Modals/WalletModal";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonItem,
  IonToggle,
} from "@ionic/react";
import { linkOutline, walletOutline, powerOutline,diamondOutline,bugOutline  } from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Home from "../pages/Home";
import Web3Auth from "../pages/Web3Auth";
import { useTranslation } from "react-i18next";
const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const { disconnectWallet } = useContract();
  const [modelWallet, setModelWallet] = useState(false);
  const toggleWalletModal = () => setModelWallet(!modelWallet);
  const [enableNavigation, setEnableNavigation] = useState(false);
  const { setRouter, setMobileSidebar, router, account, isDarkMode, changeDark } =
    useContext(UseProviderContext);

  const navigationItems = [  
    {
      name: t("TEXT_CHANNEL"),
      icon: linkOutline,
      ref: "/channel",
    },
    
  ];
  useEffect(() => {
    console.log("account", account);
    if (account) {
      console.log(account);
      setEnableNavigation(true);
    }
  }, [account]);

  const handleLogout = () => {
    disconnectWallet();
    window.location.href = "/";
  };

  useEffect(() => {
    setMobileSidebar(true);
  }, []);

  const handleTabClick = (name: string) => {
    setRouter(name);
    setMobileSidebar(true);
  };
  const NavigationComponent = () => {
    return (
      <nav className="navigation">
        <div className="nav-group">
          <IonTabBar
            mode="md"
            style={{
              flexDirection: "column",
              background: "transparent",
              height: "100vh",
            }}
          >
            <IonTabButton>
              <img src={Logo} alt="logo" className="logo" />
            </IonTabButton>
            <IonTabButton>
              <IonItem>                
                <IonToggle                  
                  justify="space-between"
                  title="Dark"
                  checked={isDarkMode}
                  onIonChange={(e) => changeDark(e.detail.checked)}
                >
                </IonToggle>
              </IonItem>
            </IonTabButton>
            {navigationItems.map((item, i) => (
              <IonTabButton
                key={i}
                tab={item.name}
                className="bt_dark_theme"
                selected={router === item.name}
                onClick={() => handleTabClick(item.name)}
                href={item.ref}
              >
                <IonIcon icon={item.icon} />
                <IonLabel>{item.name}</IonLabel>
              </IonTabButton>
            ))}
            <IonTabButton
              onClick={() => setModelWallet(true)}
              tab="Wallet"
              className="bt_dark_theme"
            >
              <IonIcon icon={walletOutline} />
              <IonLabel>{t("TEXT_WALLET")}</IonLabel>
            </IonTabButton>
            <IonTabButton
              onClick={handleLogout}
              tab="Logout"
              className="bt_dark_theme"
            >
              <IonIcon icon={powerOutline} />
              <IonLabel>{t("BT_LOGOUT")}</IonLabel>
            </IonTabButton>
          </IonTabBar>

          <WalletModal modal={modelWallet} modalToggle={toggleWalletModal} />          
        </div>
      </nav>
    );
  };
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/channel">
          <Home />
        </Route>
        <Route exact path="/login">
          <Web3Auth />
        </Route>        
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>   
      <div className="layout">{enableNavigation && NavigationComponent()}</div>
    </IonTabs>
  );
};

export default Navigation;
