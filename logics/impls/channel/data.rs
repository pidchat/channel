use ink::prelude::vec::Vec;
use openbrush::{
    storage::Mapping,
    traits::{
        AccountId,
        String,        
    },
};

/// Data structure for storing channel state and messages
#[derive(Default, Debug)]
#[openbrush::storage_item]
pub struct Data {
    /// Whether the channel is private
    pub id_private : bool,
    /// Counter for message IDs, increments with each new message
    pub message_id: u128,
    
    /// Optional list of default messages for the channel
    pub default_message: Option<Vec<String>>,
    
    /// Timestamp when the channel was created
    pub date_created: u64,    
    
    /// Storage for messages, mapping message ID to:
    /// - AccountId: Message author
    /// - String: Message content  
    /// - u64: Creation timestamp
    /// - u64: Last edit timestamp
    pub messages: Mapping<u128, (AccountId,String,u64,u64)>,
    
    /// Optional address of the governance contract
    pub address_governance: Option<AccountId>,
    //Type Message Default // Bytes or String
    pub type_default_message_channel: String,

    ///Emotions 
    pub emotions: Mapping<String, u128>,
    pub emotion_keys: Vec<String>,

    ///User permissions
    pub user_permissions: Mapping<AccountId, bool>,
}