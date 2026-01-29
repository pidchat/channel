use ink::primitives::AccountId;
use openbrush::{
    contracts::psp22::PSP22Error,
    traits::String
};
use ink_prelude::vec::Vec;

/// Reference type for the Channel trait
#[openbrush::wrapper]
pub type ChannelRef = dyn Channel;

/// Trait defining the core functionality for a messaging channel
#[openbrush::trait_definition]
pub trait Channel {
    /// Sends a new message to the channel
    /// 
    /// # Arguments
    /// * `message` - The message content to send
    /// 
    /// # Returns
    /// * `Ok(())` if message was sent successfully
    /// * `Err` if the operation failed
    #[ink(message)]
    fn send_messages(&mut self, message: String) -> Result<(), PSP22Error>;
    
    /// Edits an existing message
    /// 
    /// # Arguments
    /// * `message` - The new message content
    /// * `id_message` - ID of the message to edit
    /// 
    /// # Returns
    /// * `Ok(())` if message was edited successfully
    /// * `Err` if message not found or caller is not owner
    #[ink(message)]
    fn edit_messages(&mut self, message: String, id_message: u128) -> Result<(), PSP22Error>;

    /// Retrieves a message by its ID
    /// 
    /// # Arguments
    /// * `id_message` - ID of the message to retrieve
    /// 
    /// # Returns
    /// * Message data if found, error if not found
    #[ink(message)]
    fn received_messages(&self, id_message: u128) -> Result<Option<(AccountId, String, u64, u64)>, PSP22Error>;

    /// Gets the default messages set for this channel
    /// 
    /// # Returns
    /// * List of default messages if set
    #[ink(message)]
    fn get_default_message(&self) -> Result<Option<Vec<String>>, PSP22Error>;

    /// Gets the total number of messages in the channel
    #[ink(message)]
    fn get_total_messages(&self) -> Option<u128>;    

    /// Gets the governance contract address if set
    #[ink(message)]
    fn get_address_governance(&self) -> Option<AccountId>; 

    /// Sets the governance contract address
    /// Can only be set once
    /// 
    /// # Arguments
    /// * `address_governance` - Address of governance contract
    /// 
    /// # Returns
    /// * `Ok(())` if set successfully
    /// * `Err` if governance already set
    #[ink(message)]
    fn set_address_governance(&mut self, address_governance: AccountId) -> Result<(), PSP22Error>;


    /// Get Balance Token 
    ///
    /// # Returns
    /// * `Ok(())` if transfer was successful
    /// * `Err` if transfer failed
    #[ink(message)]
    fn get_balance_token(&self, address_token: AccountId) -> Result<u128, PSP22Error>;    

    /// Add Permission
    ///
    /// # Arguments
    /// * `address` - Address to add permission
    /// * `type_permission` - 0 for token, 1 for native
    /// 
    /// # Returns
    /// * `Ok(())` if transfer was successful
    /// * `Err` if transfer failed
    #[ink(message)]
    fn add_permission(&mut self, address: AccountId, type_permission: bool) -> Result<(), PSP22Error>;

    /// Add emotion
    ///
    /// # Arguments
    /// * `emotion` - Emotion to add
    /// 
    /// # Returns
    /// * `Ok(())` if transfer was successful
    /// * `Err` if transfer failed
    #[ink(message)]
    fn add_emotion(&mut self, emotion: String) -> Result<(), PSP22Error>;

    /// List emotions
    ///
    /// # Returns
    /// * `Ok(())` if transfer was successful
    /// * `Err` if transfer failed
    #[ink(message)]
    fn get_emotions(&self) -> Result<Option<Vec<(String, u128)>>, PSP22Error>;
     /// Is Private
     /// 
     /// # Returns
     /// * `Ok(())` if transfer was successful
     /// * `Err` if transfer failed
     #[ink(message)]
     fn get_is_private(&self) -> bool;
}