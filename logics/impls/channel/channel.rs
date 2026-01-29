#![warn(clippy::arithmetic_side_effects)]

use crate::impls::channel::data::Data;
use crate::trails::governance::GovernanceRef;
use openbrush::contracts::{
    ownable,
    reentrancy_guard
};
use openbrush::{
    contracts::{
        ownable::only_owner,
        psp22::PSP22Error,
        traits::psp22::PSP22Ref,
    },    
    traits::{
        AccountId,
        String,
        Storage,
    },
};
use ink_prelude::vec::Vec;

/// Trait defining the core functionality for a messaging channel
#[openbrush::trait_definition]
pub trait ChannelImpl: Storage<Data> + Storage<reentrancy_guard::Data> + Storage<ownable::Data> {
    
    /// Sends a new message to the channel
    /// 
    /// # Arguments
    /// * `message` - The message content to send
    /// 
    /// # Returns
    /// * `Ok(())` if message was sent successfully
    /// * `Err` if the operation failed
    #[ink(message)]
    fn send_messages(&mut self, message: String) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
        //verify is permission
        if self.data::<Data>().id_private {
            if self.data::<Data>().user_permissions.get(&caller).is_none() {
                return Err(PSP22Error::Custom(String::from("Unauthorized attempt")));
            }    
        }
        
        // Safely increment message ID using checked_add
        self.data::<Data>().message_id = self.data::<Data>().message_id.checked_add(1)
            .ok_or_else(|| PSP22Error::Custom(String::from("Message ID overflow")))?;
        
        let id_message = self.data::<Data>().message_id;
        let date_now = Self::env().block_timestamp();
        self.data::<Data>().messages.insert(&id_message, &(caller, message, date_now, date_now));
        Ok(())
    }

    /// Edits an existing message
    /// 
    /// # Arguments
    /// * `message` - The new message content
    /// * `id_messagee` - ID of the message to edit
    /// 
    /// # Returns
    /// * `Ok(())` if message was edited successfully
    /// * `Err` if message not found or caller is not owner
    #[ink(message)]
    fn edit_messages(&mut self, message: String, id_messagee: u128) -> Result<(), PSP22Error> {
        let caller = Self::env().caller();
         //verify is permission
         if self.data::<Data>().id_private {
            if self.data::<Data>().user_permissions.get(&caller).is_none() {
                return Err(PSP22Error::Custom(String::from("Unauthorized attempt")));
            }    
        }
        let (owner, _, date_create, _) = self.data::<Data>().messages.get(&id_messagee)
            .ok_or_else(|| PSP22Error::Custom(String::from("Message not found")))?;

        if caller != owner {
            return Err(PSP22Error::Custom(String::from("Caller not owner")));
        }

        let date_now = Self::env().block_timestamp();
        self.data::<Data>().messages.insert(&id_messagee, &(caller, message, date_create, date_now));
        Ok(())
    }

    /// Retrieves a message by its ID
    /// 
    /// # Arguments
    /// * `id_message` - ID of the message to retrieve
    /// 
    /// # Returns
    /// * Message data including owner, content and timestamps if found
    #[ink(message)]
    fn received_messages(&self, id_message: u128) -> Result<Option<(AccountId, String, u64, u64)>, PSP22Error> {
         //verify is permission
         let caller = Self::env().caller();
         if self.data::<Data>().id_private {
            if self.data::<Data>().user_permissions.get(&caller).is_none() {
                return Err(PSP22Error::Custom(String::from("Unauthorized attempt")));
            }    
        }
        Ok(self.data::<Data>().messages.get(&id_message))
    }

    /// Gets the default messages set for this channel
    #[ink(message)]
    fn get_default_message(&self) -> Result<Option<Vec<String>>, PSP22Error> {
        Ok(self.data::<Data>().default_message.clone())
    }

    /// Gets the total number of messages in the channel
    #[ink(message)]
    fn get_total_messages(&self) -> Option<u128> {
        Some(self.data::<Data>().message_id)
    }

    /// Gets the channel ID from governance contract
    /// 
    /// # Returns
    /// * Channel ID if found in governance
    /// * Error if governance not set or channel not found
    #[ink(message)]
    fn get_id_channel_public(&self) -> Result<u128, PSP22Error> {
        let address_governance = self.data::<Data>().address_governance
            .ok_or_else(|| PSP22Error::Custom(String::from("Governance not set")))?;
        
        let this_address = Self::env().account_id().into();
        GovernanceRef::get_id_channel(&address_governance, this_address)
            .ok_or_else(|| PSP22Error::Custom(String::from("Not Found in governance")))
    }

    /// Gets the governance contract address if set
    #[ink(message)]
    fn get_address_governance(&self) -> Option<AccountId> {
        self.data::<Data>().address_governance
    }

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
    fn set_address_governance(&mut self, address_governance: AccountId) -> Result<(), PSP22Error> {
        if self.data::<Data>().address_governance.is_some() {
            return Err(PSP22Error::Custom(String::from("Governance already set")));
        }
        self.data::<Data>().address_governance = Some(address_governance);
        Ok(())
    }   

    /// Gets the balance of a token
    /// 
    /// # Arguments
    /// * `address_token` - Address of token contract
    /// 
    /// # Returns
    /// * Token balance if found
    /// * Error if token not found
     #[ink(message)]
    fn get_balance_token(&self, address_token: AccountId) -> Result<u128, PSP22Error> {
        Ok(PSP22Ref::balance_of(&address_token, Self::env().caller()))
    }

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
    #[openbrush::modifiers(only_owner)]
    fn add_permission(&mut self, address: AccountId, type_permission: bool) -> Result<(), PSP22Error> {
        if type_permission {
            self.data::<Data>().user_permissions.insert(&address, &type_permission);
        } else {
            self.data::<Data>().user_permissions.remove(&address);
        }
        Ok(())
    }

    /// Add emotion
    ///
    /// # Arguments
    /// * `emotion` - Emotion to add
    /// 
    /// # Returns
    /// * `Ok(())` if transfer was successful
    /// * `Err` if transfer failed
    #[ink(message)]
    fn add_emotion(&mut self, emotion: String) -> Result<(), PSP22Error> {
        let quantity_emotions = self.data::<Data>().emotions.get(&emotion);
        if !self.data::<Data>().emotion_keys.contains(&emotion) {
            self.data::<Data>().emotion_keys.push(emotion.clone());
        }
        self.data::<Data>().emotions.insert(&emotion, &(quantity_emotions.unwrap_or(0) + 1));
        Ok(())
    }

    /// List emotions
    ///
    /// # Returns
    /// * `Ok(())` if transfer was successful
    /// * `Err` if transfer failed
    #[ink(message)]
    fn get_emotions(&self) -> Result<Vec<(String, u128)>, PSP22Error> {
        let emotions = self.data::<Data>().emotion_keys.clone();
        let mut result = Vec::new();
        for key in emotions.into_iter() {
            if let Some(value) = self.data::<Data>().emotions.get(&key) {
                result.push((key.clone(), value));
            }
        }
        Ok(result)
    }
    
    /// Is Private
     /// 
     /// # Returns
     /// * `Ok(())` if transfer was successful
     /// * `Err` if transfer failed
     #[ink(message)]
     fn get_is_private(&self) -> bool {
        self.data::<Data>().id_private
     }

}