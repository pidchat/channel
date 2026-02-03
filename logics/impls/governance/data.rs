use openbrush::{
    storage::Mapping,
    traits::{
        AccountId,
        Balance,
        String
    },
};
use ink::{
    primitives::Hash,
};
#[derive(Default, Debug)]
#[openbrush::storage_item]
pub struct Data {
    pub token_address: Option<AccountId>,
    pub channel_id: u128,
    pub channel_fake_id: u128,
    // id_channel, (address_channel,Babalnce safe, date,address_autor)
    pub channels: Mapping<u128,(AccountId, Balance,u64,AccountId)>,
    // address_channel, (id_channel,Babalnce safe, date,address_autor)
    pub channels_for_addrress: Mapping<AccountId, u128>,
    pub price: Balance,
    pub vote_id: u128,
    pub new_price:Balance,
    pub new_balance_of_auditor:Balance,
    pub vote_price_end: u64,
    //Auditor open the vote (id_channel, Auditor)
    pub who_open_fake:Mapping<u128,AccountId>,
    //Users in vote fake (id_channel, User), Date
    pub channel_fake_in_user:Mapping<(AccountId,u128),u64>,
    //Quantity votes yes fake news (id_channel, Quntity)
    pub qtd_fake_yes:Mapping<u128,u128>,
    //Quantity votes no fake news (id_channel, Quntity)
    pub qtd_fake_no:Mapping<u128,u128>,     
    //Users in vote fake (id_channel, User)
    pub recovery_in_user_payment:Mapping<(AccountId,u128),Balance>,
    //Auditor in vote price (id_vote, User)
    pub price_vote_auditor:Mapping<(AccountId,u128),u64>,
    //Quantity votes no fake news (id_vote, Quntity)
    pub qtd_price_no:Mapping<u128,u128>,
    //Quantity votes no fake news (id_vote, Quntity)
    pub qtd_price_yes:Mapping<u128,u128>,
    //Deadlines votes no fake news (id_channel, date_end)
    pub deadlines_fake:Mapping<u128,u64>,
    //Channel open in vote (id_channel_fake,id_channel)
    pub open_fake:Mapping<u128,u128>,
    //Channel open in vote (id_channel, reason)
    pub reason_fake:Mapping<u128,String>,
    //Feelers
    pub fee_receiver:Option<AccountId>,
    pub fee_balance : Balance,
    pub qtd_total_per_vote : u128,
    /// balance of auditor
    pub balance_of_auditor : Balance,
    pub channel_contract_code_hash: Hash,
    /// voting deadline for price changes
    pub time_vote_price: u64,
    /// voting deadline for fake news votes
    pub time_vote_fake: u64,
    /// Time block balance post
    pub time_block_balance_post: u64,
}

#[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum GovError {
    BadMintValue,
    PaymentFail,
    NotFound,
    TokenAddressNotSet,
    PriceNotSet,
    TimeOver,
    TimeInVote,
    NoApproval,
    DepositDone,
    VoteDone, 
    DateNexVoteIn,
    YouAreNotAuditor,
    InProgress,
    BlockedBalance,
    NotChannelOwner,
    NotFoundChannel,
    NotFoundAssicieteGovernanceInChannel,
    NotFoundToken,
    NotOpenVoteInFake,
    NoVote,
    TimeOverOpenVote,
    VoteFull

}

impl GovError {
    pub fn as_str(&self) -> String {
        match self {
            GovError::NotFound => String::from("NotFound"),
            GovError::BadMintValue => String::from("BadMintValue"),            
            GovError::PaymentFail => String::from("PaymentFail"),
            GovError::TokenAddressNotSet => String::from("TokenAddressNotSet"),
            GovError::PriceNotSet => String::from("PriceNotSet"),
            GovError::TimeOver => String::from("TimeOver"),
            GovError::TimeInVote => String::from("TimeInVote"),
            GovError::NoApproval => String::from("NoApproval"),
            GovError::DepositDone => String::from("DepositDone"),
            GovError::VoteDone => String::from("VoteDone"),
            GovError::DateNexVoteIn => String::from("DateNexVoteIn"),
            GovError::YouAreNotAuditor => String::from("YouAreNotAuditor"),
            GovError::InProgress => String::from("InProgress"),
            GovError::BlockedBalance => String::from("BlockedBalance"),
            GovError::NotChannelOwner => String::from("NotChannelOwner"),
            GovError::NotFoundChannel => String::from("NotFoundChannel"),
            GovError::NotFoundAssicieteGovernanceInChannel => String::from("NotFoundAssicieteGovernanceInChannel"),
            GovError::NotFoundToken => String::from("NotFoundToken"),
            GovError::NotOpenVoteInFake => String::from("NotOpenVoteInFake"),
            GovError::NoVote => String::from("NoVote"),
            GovError::TimeOverOpenVote => String::from("TimeOverOpenVote"),
            GovError::VoteFull => String::from("VoteFull"),
        }
    }
}