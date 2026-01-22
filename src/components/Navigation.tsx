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
import {
  linkOutline,
  walletOutline,
  powerOutline,
  globeOutline,
  bugOutline,
} from "ionicons/icons";
import { Redirect, Route } from "react-router";
import Home from "../pages/Home";
import Web3Auth from "../pages/Web3Auth";
import { useTranslation } from "react-i18next";
import SupportChannelModal from "./Modals/SupportChannelModal";
import News from "../pages/News";
import Post from "../pages/Post";
const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const { disconnectWallet } = useContract();
  const [modelWallet, setModelWallet] = useState(false);
  const toggleWalletModal = () => setModelWallet(!modelWallet);
  
  const [modelIssue, setModelIssue] = useState(false);
  const toggleIssueModal = () => setModelIssue(!modelIssue);
  const {
    setRouter,
    setMobileSidebar,
    router,
    account,
    isDarkMode,
    changeDark,
    menuBar
  } = useContext(UseProviderContext);
const [enableNavigation, setEnableNavigation] = useState(menuBar || false);
  const navigationItems = [
    {
      name: t("TEXT_FEED"),
      icon: globeOutline,
      ref: "/news",
    },
    {
      name: t("TEXT_CHANNEL"),
      icon: linkOutline,
      ref: "/channel",
    },
  ];

  useEffect(() => {
    if (account) {
      setEnableNavigation(true);
    }
  }, [account]);

  const handleLogout = () => {
    disconnectWallet();
    setEnableNavigation(false);
    window.location.href = "/";
  };

  useEffect(() => {
    setMobileSidebar(true);
  }, []);

  const handleTabClick = (name: string) => {
    setRouter(name);
    setMobileSidebar(true);
  };
// Handle Android back button event
useEffect(() => {
  const handleBackButton = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If on login page, allow default back behavior
    if (window.location.pathname === '/login' || location.pathname == "/" || window.location.pathname === '/news' || window.location.pathname === '/post/:newsId' ) {
      setEnableNavigation(false);
    }
    
    
  };

  window.addEventListener('popstate', handleBackButton);

  return () => {
    window.removeEventListener('popstate', handleBackButton);
  };
}, []);
  
   
  const NavigationComponent = () => {
    return (
      <nav className="navigation">
        <div className="nav-group">
          <IonTabBar
            mode="md"
            style={{
              flexDirection: "column",
              height: "100vh",
              overflowY: "auto",
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
                ></IonToggle>
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
              onClick={() => setModelIssue(true)}
              tab="Issue"
              className="bt_dark_theme"
            >
              <IonIcon icon={bugOutline} />
              <IonLabel>{t("TEXT_SUPPORT")}</IonLabel>
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
        <Route exact path="/news">
          <News />
        </Route>
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/post/:newsId">
          <Post />
        </Route>
      </IonRouterOutlet>
      <div className="layout">{enableNavigation && NavigationComponent()}</div>
      <SupportChannelModal modal={modelIssue} modalToggle={toggleIssueModal} />
    </IonTabs>
  );
};

export default Navigation;
