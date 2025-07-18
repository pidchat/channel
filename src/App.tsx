import {
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "@icon/themify-icons/themify-icons.css";
import "./assets/scss/Index.scss";
import { UseProvider } from "./contexts/UseProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./components/Navigation";
import { StatusBar, Style } from '@capacitor/status-bar';

import "./i18n/index";
setupIonicReact({
  mode: 'md',
  animated: true,
});
StatusBar.setOverlaysWebView({ overlay: false });
StatusBar.setStyle({ style: Style.Dark });
StatusBar.setBackgroundColor({ color: '#fffff' });
StatusBar.show();
const queryClient = new QueryClient();

const App: React.FC = () => {
 
  return (
    <QueryClientProvider client={queryClient}>
    <UseProvider>
      <IonReactRouter>        
        <Navigation/>
      </IonReactRouter>
      <ToastContainer />
    </UseProvider>
  </QueryClientProvider>
  )
};

export default App;
