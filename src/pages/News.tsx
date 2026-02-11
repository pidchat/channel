import {
  IonContent,
  IonIcon,
  IonLoading,
  IonPage,
} from "@ionic/react";
import CardSendPost from "../components/News/CardSendPost";
import CardItemPost from "../components/News/CardItemPost";
import HeaderHome from "../components/News/HeaderHome";
import useContract from "../hooks/useContract";
import useGovernance, { InfoGovernance } from "../hooks/useGovernance";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatMillion, truncateText } from "../utils";
import { copyOutline, refresh } from "ionicons/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
const CHUNK_SIZE = 10;
const News: React.FC = () => {
  const { t } = useTranslation();
  const { account, apiReady, alert, isDarkMode } = useContract();
  const { getTotalNews, getChannelIdAccount, getNewsId, getInfoGovernance } =
    useGovernance();
  const [totalNews, setTotalNews] = useState(0);
  const [page, setPage] = useState(0);
  const [channelIds, setChannelIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrollEl, setScrollEl] = useState<any>();
  const contentRef = useRef<HTMLIonContentElement>(null);
  const [infoGovernance, setInfoGovernance] = useState<InfoGovernance>({
    addressContract: import.meta.env.VITE_CONTRACT_GOVERNANCE,
    priceGuardian: "0",
    totalBalanceAuditor: "0",
    totalBalanceBlock: "0",
    totalFakesNews: 0,
    totalNews: 0,
  });

  useEffect(() => {
    if (apiReady) {
      reload();
    }
  }, [apiReady]);

  useEffect(() => {
    getMoreChannelIds();
  }, [totalNews]);
  useEffect(() => {
    getMoreChannelIds();
  }, [page]);
  const reload = () => {
    setLoading(true);
    getTotalNews()
      .then((count) => {
        if (Number(count || 0) == totalNews) {
          return;
        }
        const newIds: number[] = [];
        let value = Number(count || 0);
        let index = 0;
        do {
          if (channelIds[index] == value) {
            newIds.push(channelIds[index]);
          } else {
            newIds.push(value);
          }
          value--;
          index++;
          if (index == CHUNK_SIZE) {
            break;
          }
        } while (value > 0);
        setTotalNews(Number(count || 0));
        setChannelIds(newIds);
      })
      .finally(() => {
        setLoading(false);
      });
    getInfoGovernance().then((res) => {
      if (res) {
        setInfoGovernance(res);
      }
    });
  };
  const getMoreChannelIds = () => {
    if (channelIds.length >= totalNews) {
      return;
    }
    const newIds: number[] = channelIds;
    var countLoop = totalNews - page;
    var index = 0;
    do {
      newIds.push(countLoop);
      countLoop--;
      index++;
      if (index == CHUNK_SIZE) {
        break;
      }
    } while (countLoop != 0);
    setChannelIds(newIds);
  };

  const handleSearch = (searchText: string) => {
    if (searchText.trim().length === 0) {
      alert(t("TEXT_FIELD_ENTER_ADDRESS"), "error");
      return;
    }
    setLoading(true);
    getChannelIdAccount(searchText)
      .then(async (res) => {
        if (res) {
          const details = await getNewsId(Number(res));
          location.href = `/post/${details?.channelAddress}`;
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert(t("TEXT_ALERT_CHANNEL_NOT_FOUND"), "error");
      });
  };
  const handleOwnerPostsClick = () => {
    reload();
  };
  return (
    <IonPage>
      <IonContent ref={contentRef}>
        <div className="contentNews">
          <HeaderHome
            handleSearch={handleSearch}
            handleOwnerPostsClick={handleOwnerPostsClick}
          />
          {account && <CardSendPost reload={reload} />}
          {/* Governance Contract Info Card */}
          <div style={{ margin: "1rem auto", width: "fit-content" }}>
            <details className="governance-dropdown">
              <summary className="governance-summary">
                {t("TEXT_GOVERNANCE_CONTRACT_INFO")}
              </summary>
              <div className="governance-details">
                <p
                  onClick={() =>
                    navigator.clipboard.writeText(
                      infoGovernance.addressContract,
                    )
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#333"
                      : "#f0f0f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <strong>{t("CONTRACT_ADDRESS")}:</strong>{" "}
                  {truncateText(infoGovernance.addressContract, 7, 10, false)}
                  <IonIcon icon={copyOutline} style={{ fontSize: "14px" }} />
                </p>
                <p>
                  <strong>{t("PRICE_GUARDIAN")}:</strong>{" "}
                  {formatMillion((
                    Number(infoGovernance.priceGuardian) / 1000000000000000000
                  ).toFixed(0))}{" "}
                  PID
                </p>
                <p>
                  <strong>{t("TOTAL_BALANCE_AUDITOR")}:</strong>{" "}
                  {formatMillion((
                    Number(infoGovernance.totalBalanceAuditor) /
                    1000000000000000000
                  ).toFixed(0))}{" "}
                  PID
                </p>
                <p>
                  <strong>{t("TOTAL_BALANCE_BLOCK")}:</strong>{" "}
                  {formatMillion((
                    Number(infoGovernance.totalBalanceBlock) /
                    1000000000000000000
                  ).toFixed(0))}{" "}
                  PID
                </p>
                <p>
                  <strong>{t("TOTAL_FAKE_NEWS")}:</strong>{" "}
                  {infoGovernance.totalFakesNews}
                </p>
                <p>
                  <strong>{t("TOTAL_NEWS")}:</strong> {infoGovernance.totalNews}
                </p>
              </div>
            </details>
          </div>
          <div style={{ marginTop: "1rem" }}></div>
          <PerfectScrollbar
            style={{ height: "100%" }}
            containerRef={(ref) => setScrollEl(ref)}
            onScroll={() => {
              const scrollBottom =
                scrollEl.scrollHeight -
                scrollEl.scrollTop -
                scrollEl.clientHeight;
              if (scrollBottom == 0) {
                setPage(page + CHUNK_SIZE);
              }
            }}
          >
            {channelIds.map((channelId, index) => (
              <CardItemPost key={index} channelId={channelId} />
            ))}
          </PerfectScrollbar>
        </div>
        <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
      </IonContent>
      {/* Scroll to top button */}
      <IonIcon
        icon={refresh}
        className="scroll-to-top"
        onClick={() => {
          location.reload();
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "28px",
          background: isDarkMode ? "#333" : "#fff",
          color: isDarkMode ? "#fff" : "#333",
          borderRadius: "50%",
          padding: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          cursor: "pointer",
          zIndex: 999,
        }}
      />
    </IonPage>
  );
};

export default News;
