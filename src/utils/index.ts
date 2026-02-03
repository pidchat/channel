import { formatRelative } from 'date-fns';
import * as ptBR from 'date-fns/locale/pt-BR';
import * as enUS from 'date-fns/locale/en-US';
export const truncateText = (str:string, qtd:number, qtd_tru:number, isEnd:boolean = false) =>{
    if(!str)    
        return ""
    if (isEnd)
        return str.length > qtd ? str.substring(0, qtd_tru) + "..." : str;
    else
        return str.length > qtd ? str.substring(0, qtd_tru) + "..."+str.substring((str.length - qtd_tru), str.length) : str;
}

export const getDateView = (dateTime: string, lang: string = "pt-BR") => {
    
    let dateRaffle = new Date()
    dateRaffle.setTime(Number(dateTime))
    if(lang == "pt-BR")
        return formatRelative(dateRaffle, new Date(), { locale: ptBR.ptBR  })
    else
        return formatRelative(dateRaffle, new Date(), { locale: enUS.enUS  })

}
export const calc_fee = (fee_deposit: string) => {
    if(!fee_deposit)
     return 0
    let fee_ = (fee_deposit.split(" ")[0]).replaceAll(".", "").trim()
    return Number(fee_) / 100000000
}
//create color from text
export const extractNumbersAndColorize = (text:string) => {
    if(!text || text.length == 0)
        return "#000" 
    text = text.replace(/\D/g, "");
    let hash = 0;
    for (let i =0; i<text.length ; i++) {
      hash += text.charCodeAt(i);
    }
    const color = `hsl(${hash % 360}, 100%, 50%)`;
    return color;
};