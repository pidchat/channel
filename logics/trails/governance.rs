use openbrush::{
    contracts::psp22::PSP22Error,
    traits::{
        Balance, 
        AccountId,
        String
    },
};
use ink_prelude::vec::Vec;
/// Reference type for the Governance trait
#[openbrush::wrapper]
pub type GovernanceRef = dyn Governance;

/// Trait defining the core governance functionality for managing channels and voting
#[openbrush::trait_definition]
pub trait Governance {
    /// Gets details of a channel by its ID
    #[ink(message)]
    fn get_channel(&self, channel_id: u128) -> Result<(), PSP22Error>;

    /// Gets the total number of channels created
    #[ink(message)] 
    fn get_total_channel(&self) -> Result<(), PSP22Error>;

    /// Creates a new public channel with the given address
    #[ink(message)]
    fn add_messages_public(&mut self, default_message: Option<Vec<String>>,type_default_message_channel: String) -> Result<AccountId, PSP22Error>;

    /// Claims reward for correctly identifying fake news
    #[ink(message)]
    fn reward_safe_for_fake_news(&mut self, channel_id: u128) -> Result<(), PSP22Error>;

    /// Gets the current price settings
    #[ink(message)]
    fn get_prices(&self) -> Result<u128, PSP22Error>;

    /// Opens a new vote for marking a channel as fake news
    #[ink(message)]
    fn open_vote_for_fake_news(&mut self, channel_id: u128) -> Result<(), PSP22Error>;

    /// Gets the current vote counts and deadline for a fake news vote
    #[ink(message)]
    fn get_votes_fakes_news(&self, channel_id: u128) -> Result<(u128,u128,u64), PSP22Error>;

    /// Casts a vote in a fake news voting
    #[ink(message)]
    fn doing_vote_fake(&mut self, channel_id: u128, is_fake: bool) -> Result<(), PSP22Error>;

    /// Gets total number of open fake news votes
    #[ink(message)]
    fn get_total_fake_open(&self) -> Result<u128, PSP22Error>;

    /// Opens a new vote for changing the price
    #[ink(message)]
    fn open_vote_for_price(&mut self, new_price: Balance,new_balance_of_auditor:Balance) -> Result<(), PSP22Error>;

    /// Gets details of current price vote
    #[ink(message)]
    fn get_vote_price(&self) -> Result<(), PSP22Error>;

    /// Casts a vote in price voting
    #[ink(message)]
    fn doing_vote_price(&mut self, is_proved: bool) -> Result<(), PSP22Error>;

    /// Gets total amount of tokens locked in contract
    #[ink(message)]
    fn get_balance_token_locked(&self) -> u128;

    /// Recovers locked balance from a public channel
    #[ink(message)]
    fn recovery_safe_balance_public(&mut self, channel_id: u128) -> Result<u128, PSP22Error>;

    /// Gets channel ID associated with a contract address
    #[ink(message)]
    fn get_id_channel(&self, address_contract: AccountId) -> Option<u128>;

    /// Gets the fee receiver wallet address
    #[ink(message)]
    fn get_fee_receiver_wallet(&self) -> Option<AccountId>;

    /// Gets the accumulated fee balance
    #[ink(message)]
    fn get_fee_receiver_balance(&self) -> Balance;

    /// Allows fee receiver to withdraw accumulated fees
    #[ink(message)]
    fn get_fee_receiver_withdrawal(&mut self) -> Result<u128, PSP22Error>;

    /// Synchronizes contract state
    #[ink(message)]
    fn sync(&mut self) -> Result<(), PSP22Error>;
        /// Gets total votes allowed per voting round
    #[ink(message)]
    fn get_total_votes_allowed(&self) -> u128;
    
    /// Gets the current price per channel
    #[ink(message)]
    fn get_price_per_channel(&self) -> u128;

    /// Transfers balance between token and native currency
    #[ink(message)]
    fn transfer_balance_channel(&mut self,address_token: Option<AccountId>, type_transfer: u8) -> Result<(), PSP22Error>;

    /// Gets the current balance of the auditor
    #[ink(message)]
    fn get_balance_auditor(&self) -> Result<u128, PSP22Error>;

    /// Checks if a channel is marked as fake news
    #[ink(message)]
    fn check_channel_fake(&self, channel_id: u128) -> Result<(), PSP22Error>;
}