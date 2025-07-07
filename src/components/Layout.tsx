import React, { useContext, useEffect } from "react";
import SidebarIndex from "./Sidebars/index";
import Navigation from "./Navigation";
import Chat from "./Partials/Chat";
import { UseProviderContext } from "../contexts/UseProvider";

const Layout: React.FC = () => {
  const {router} = useContext(UseProviderContext);
  useEffect(() => {
    const doc = document.querySelector('*');
    doc?.addEventListener('click', (e: any) => {
        if (document.body.classList.contains('navigation-open') && e.target.nodeName === 'BODY') {
            document.body.classList.remove('navigation-open')
        }
    });

}, []);
  return (
      <div className="layout">
        <div style={{
          position: "fixed",
          top: 0,
          textAlign: "left",
          width: "100%",
          fontSize: "11px",
        }}>
          <p style={{color: "red"}}>TESTENET</p>         
        </div>
        <Navigation />
        <div className="content">
          <SidebarIndex />      
          {router == "Channels" || router == "Home" ? <Chat /> : null}
        </div>
      </div>
  );
};

export default Layout;
