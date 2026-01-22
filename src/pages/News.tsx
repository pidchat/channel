import { IonContent, IonPage } from "@ionic/react";
import CardSendPost from "../components/News/CardSendPost";
import CardItemPost from "../components/News/CardItemPost";
import HeaderHome from "../components/News/HeaderHome";
import useContract from "../hooks/useContract";
import useGovernance from "../hooks/useGovernance";
import { useEffect, useState } from "react";
const News: React.FC = () => {
  const { account, apiReady } = useContract();
  const { getTotalNews } = useGovernance();
  const [totalNews, setTotalNews] = useState(0);
  const [page, setPage] = useState(0);
  const [channelIds, setChannelIds] = useState<number[]>([]);
  const itemsPerPage = 10;
  useEffect(() => {
    if (apiReady) {
      getTotalNews().then((count) => setTotalNews(Number(count || 0)));
    }
  }, [apiReady]);
  useEffect(() => {
    getMoreChannelIds();
  }, [totalNews]);
  useEffect(() => {
    getMoreChannelIds();
  }, [page]);
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
      if (index == itemsPerPage) {
        break;
      }
    } while (countLoop != 0);    
    setChannelIds((prev) => [...prev, ...newIds]);
  };

  const handleSearch = (searchText: string) => {
    console.log("Search text:", searchText);
  };
  const handleOwnerPostsClick = () => {
     getTotalNews().then((count) => {
      setTotalNews(Number(count || 0))
      getMoreChannelIds();
      setPage(0);
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
          {account && <CardSendPost />}
          <div style={{ marginTop: "1rem" }}></div>
          {channelIds.map((channelId, index) => (
            <CardItemPost key={index} channelId={channelId} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default News;
