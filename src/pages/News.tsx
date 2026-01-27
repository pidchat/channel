import { IonContent, IonLoading, IonPage } from "@ionic/react";
import CardSendPost from "../components/News/CardSendPost";
import CardItemPost from "../components/News/CardItemPost";
import HeaderHome from "../components/News/HeaderHome";
import useContract from "../hooks/useContract";
import useGovernance from "../hooks/useGovernance";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
const CHUNK_SIZE = 10;
const News: React.FC = () => {
  const { t } = useTranslation();
  const { account, apiReady, alert } = useContract();
  const { getTotalNews, getChannelIdAccount,getNewsId } = useGovernance();
  const [totalNews, setTotalNews] = useState(0);
  const [page, setPage] = useState(0);
  const [channelIds, setChannelIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

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
    getTotalNews().then((count) => {
      if (Number(count || 0) == totalNews) {
        return;
      }
      const newIds: number[] = [];
      let value = Number(count || 0);
      let index = 0;
      do {
        if (channelIds[index] == value) {
          newIds.push(channelIds[index]);
        }else{
          newIds.push(value);          
        }
        value --;
        index++;
        if(index == CHUNK_SIZE) {
          break;
        }
        
      } while (value > 0);
      setTotalNews(Number(count || 0));
      setChannelIds(newIds);
    });
  }
  const getMoreChannelIds = () => {
    const newIds: number[] = [];
    if (channelIds.length >= totalNews) {
      return;
    }
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
    setChannelIds((prev) => [...prev, ...newIds]);
  };

  const handleSearch = (searchText: string) => {
    
    if(searchText.trim().length === 0){
      alert(t("TEXT_FIELD_ENTER_ADDRESS"),'error');
      return;
    }
    setLoading(true);
    getChannelIdAccount(searchText).then(async (res) => {
      if (res) {
        const details = await getNewsId(Number(res));
        location.href = `/post/${details?.channelAddress}`;
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      alert(t("TEXT_ALERT_CHANNEL_NOT_FOUND"),'error');
    });
  };
  const handleOwnerPostsClick = () => {
    setLoading(true);
    setTotalNews(0);
     setChannelIds([]);
     getTotalNews().then((count) => {      
      setTotalNews(Number(count || 0))
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      alert(t("TEXT_ALERT_CHANNEL_NOT_FOUND"),'error');
    });
  };
  return (
    <IonPage>
      <IonContent>
        <div className="contentNews">
          <HeaderHome
            handleSearch={handleSearch}
            handleOwnerPostsClick={handleOwnerPostsClick}
          />
          {account && <CardSendPost reload={reload} />}
          <div style={{ marginTop: "1rem" }}></div>
          {channelIds.map((channelId, index) => (
            <CardItemPost key={index} channelId={channelId} />
          ))}
        </div>
        <IonLoading isOpen={loading} message={t("TEXT_WAIT")} />
      </IonContent>
    </IonPage>
  );
};

export default News;
