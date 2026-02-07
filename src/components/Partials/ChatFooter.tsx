import React, { useEffect } from "react";
import { Input } from "reactstrap";
import {
  IonButton,
  useIonAlert,
} from "@ionic/react";
import useContract from "../../hooks/useContract";
import CryptoJS from "crypto-js";
import emoji from "../../assets/emoji.json";
import { useTranslation } from "react-i18next";
interface Props {
  inputMsg: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  gas: number;
  id: number;
  onCancel: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const CHUNK_SIZE = 250;  
const ChatFooter: React.FC<Props> = ({ ...props }) => {
  const { t } = useTranslation();
  const [enableLock, setEnableLock] = React.useState(false);
  const [passAlert] = useIonAlert();
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [visibleEmojis, setVisibleEmojis] =  React.useState<any[]>([]);
  const [index, setIndex] =  React.useState(0);
  const emotions = React.useMemo(() => {
    return emoji.map((item: any) => item.char);
  }, []);
  const { alert, password} = useContract();
  useEffect(() => {
    
    setVisibleEmojis(emotions.slice(0, CHUNK_SIZE)); // Primeiro lote
    setIndex(CHUNK_SIZE);
    const eastingPassword = localStorage.getItem("PIDCHAT_password");
    if (eastingPassword) {
      setEnableLock(true);
    }
    // const chatInput = inputRef.current;
    // Add a specific class or id to your chat input
    const chatInput = document?.getElementById("chat-input");

    if (chatInput) {
      chatInput.focus()
      chatInput.scrollIntoView({ behavior: "smooth", block: "center" });      
    }
  }, []);

  const loadMoreEmojis = () => {
    if (visibleEmojis.length < emoji.length && index < emoji.length) {
      setVisibleEmojis(emotions.slice(0, index));
      setIndex(index + CHUNK_SIZE);
    }
  };

  // Inside ChatFooter component
  const componentEmoji = React.useMemo(() => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",        
      }}     
    >
      {visibleEmojis.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            props.onChange(props.inputMsg + item);
            setOpenEmoji(false);
          }}
          style={{
            fontSize: "24px",
            padding: "5px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  ), [visibleEmojis,index]);

  const handleSetPassword = () => {
    if (enableLock) {
      localStorage.removeItem("PIDCHAT_password");
      setEnableLock(false);
      props.onRefresh();
      return;
    }
    passAlert({
      header: t("TEXT_SET_PASSWORD"),
      inputs: [
        {
          name: "password",
          type: "password",
          placeholder: t("TEXT_ENTER_PASSWORD"),
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "OK",
          handler: (data: any) => {
            if (data.password) {
              if (data.password.length < 4) {
                alert(t("TEXT_ERROR_PASSWORD"), "error");
                return;
              }
              const encrypt = CryptoJS.AES.encrypt(
                data.password,
                password
              ).toString();
              localStorage.setItem("PIDCHAT_password", encrypt);
              setEnableLock(true);
              props.onRefresh();
            }
          },
        },
      ],
    });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    props.onChange(e.target.value);
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.onSubmit();
  };
  const componentChat = () => {
    return (
      <>
        <p className="text-center"> {props.loading? t("TEXT_WAIT"):`Fee Network ${props.gas} Lunes`}</p>
        <form>
          <IonButton
            color="medium"
            fill="outline"
            onClick={() => setOpenEmoji(!openEmoji)}
            size="small"
          >
            <i className="fa fa-th-large"></i>
          </IonButton>
          <Input
            type="text"
            className="form-control"
            id="chat-input"
            placeholder={t("TEXT_WRITE_MESSAGE")}
            value={props.inputMsg}           
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
          <div className="form-buttons">
            {props.id > 0 && (
              <IonButton color="danger" onClick={props.onCancel} size="small">
                <i className="fa fa-times"></i>
              </IonButton>
            )}
            <IonButton
              size="small"
              fill="outline"
              color={enableLock ? "danger" : "primary"}
              onClick={() => handleSetPassword()}
            >
              {enableLock ? (
                <i className="fa fa-lock"></i>
              ) : (
                <i className="fa fa-unlock"></i>
              )}
            </IonButton>
            <IonButton
              size="small"
              color="primary"
              onClick={(e) => handleSubmit(e)}
              disabled={!props.inputMsg}
            >
              <i className="fa fa-send"></i>
            </IonButton>
          </div>
        </form>
      </>
    );
  };
 
  return (
    <>
     
      <div className="chat-footer input-container" id="center-default">       
        {componentChat()}
      </div>     
      {openEmoji ? (
        <div
          style={{
            maxHeight: "100vh",
            overflow: "auto",
            width: "100%",
            backgroundColor: "transparent",
            scrollbarWidth: "thin",
            scrollbarColor: "black rgb(228, 221, 221)",
          }}
          onScroll={() => {
            loadMoreEmojis();
          }}
        >
          {componentEmoji}
        </div>
      ):null}
    </>
  );
};

export default ChatFooter;
