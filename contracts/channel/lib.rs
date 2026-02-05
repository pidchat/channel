#![cfg_attr(not(feature = "std"), no_std, no_main)]
#[openbrush::implementation(Ownable)]
#[openbrush::contract]
pub mod channel {
    use openbrush::{
        contracts::{
            ownable::{
                self,
                only_owner,
            },
            reentrancy_guard,
            traits::psp22::{PSP22Ref, PSP22Error},
        },
        traits::{
            Storage, String
        },
    };
    use ink::prelude::vec::Vec;
    use pidchat_pkg::impls::channel::{ channel::*, data };
    use ink::prelude::string::ToString;
    /// Contract for managing a messaging channel
    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct ChannelContract {
        /// Channel data storage
        #[storage_field]
        channel_data: data::Data,
        /// Reentrancy guard for security
        #[storage_field]
        guard: reentrancy_guard::Data,
        /// Ownable data for access control
        #[storage_field]
        ownable: ownable::Data,
    }
 
    impl ChannelImpl for ChannelContract {}

    impl ChannelContract {
        /// Creates a new channel contract instance
        /// 
        /// # Arguments
        /// * `default_message` - Optional default messages for the channel
        /// * `address_governance` - Optional governance contract address
        /// * `type_channel` - Type of channel (Bytes or String)
        #[ink(constructor)]
        pub fn new(default_message: Option<Vec<String>>, address_governance: Option<AccountId>, type_default_message_channel: String, id_private: bool) -> Self {
            let mut instance = Self::default();
            let caller = instance.env().caller();
            // Initialize ownership to contract creator
            ownable::InternalImpl::_init_with_owner(&mut instance, caller);
            instance.channel_data.type_default_message_channel = type_default_message_channel;
            // Initialize channel data
            instance.channel_data.id_private = id_private;
            instance.channel_data.emotion_keys = Default::default();
            instance.channel_data.emotions = Default::default();
            instance.channel_data.user_permissions = Default::default();
            instance.channel_data.user_permissions.insert(&caller, &true);
            instance.channel_data.message_id = 0;
            instance.channel_data.default_message = default_message;
            instance.channel_data.date_created = Self::env().block_timestamp();
            instance.channel_data.messages = Default::default();
            instance.channel_data.address_governance = address_governance;
            instance
        }

        /// Destroys the channel contract if no governance is set
        /// Only callable by contract owner
        /// 
        /// # Returns
        /// * `Ok(())` if contract is destroyed successfully
        /// * `Err` if governance is set or destruction fails
        #[openbrush::modifiers(only_owner)]
        #[ink(message)]
        pub fn destroy(&mut self) -> Result<(), PSP22Error> {     
            let address_governance = self.channel_data.address_governance;

            // Cannot destroy if governance is set
            if address_governance != Default::default() {
                return Err(PSP22Error::Custom(String::from("Cannot destroy - governance is set")));
            }

            // Terminate contract and transfer remaining balance to caller
            self.env().terminate_contract(self.env().caller())
        }  
        /// Transfers owner Token and native balance
    /// 
    /// # Arguments
    /// * `address_token` - Address of token contract
    /// * `to` - Address to transfer to
    /// * `type_transfer` - 0 for token, 1 for native
    /// 
    /// # Returns
    /// * `Ok(())` if transfer was successful
    /// * `Err` if transfer failed
    #[ink(message)]
    #[openbrush::modifiers(only_owner)]
    pub fn transfer_balance(&mut self,address_token: Option<AccountId>, to: AccountId, type_transfer: u8) -> Result<(), PSP22Error> {
        let caller = self.env().caller();

        if type_transfer == 0 {
            // balance available
            let balance = self.env().balance();
            let current_balance = balance
                    .checked_sub(self.env().minimum_balance())
                    .unwrap_or_default();
            if current_balance == 0 {
                return Err(PSP22Error::Custom(String::from("Balance not found")));
            }    
            self.env()
                .transfer(to, current_balance)
                .map_err(|_| PSP22Error::Custom(String::from("Transfer failed")))?;
        } else {
            if address_token.is_none() {
                return Err(PSP22Error::Custom(String::from("Token not found")));
            }
            let balance_token = PSP22Ref::balance_of(&address_token.unwrap(), caller);
            if balance_token == 0 {
                return Err(PSP22Error::Custom(String::from("Token balance not found")));
            }
            PSP22Ref::transfer(&address_token, to, balance_token,Vec::new())?;
        }
        Ok(())
    }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::env::{test::*, DefaultEnvironment};
    
        // Helper function to setup test environment
        fn setup() -> (AccountId, AccountId) {
            let accounts = default_accounts::<DefaultEnvironment>();
            set_caller::<DefaultEnvironment>(accounts.alice);
            (accounts.alice, accounts.bob)
        }
    
        #[ink::test]
        fn test_send_messages() {
            // Arrange
            let (alice, _) = setup();
            let mut channel = ChannelContract::new(Some(vec!["Hello, world!".to_string()]), None, "String".to_string());
            let message = String::from("Hello, world!");
    
            // Act - Send a new message
            let result = channel.send_messages(message.clone());
    
            // Assert
            // Check if message was sent successfully
            assert!(result.is_ok());
            // Verify message counter was incremented
            let total = channel.get_total_messages();
            assert_eq!(total, Some(1));
            // Test send 500,000  messages
            for _ in 0..500_000 {
                channel.send_messages(message.clone()).unwrap();
            }
            // Verify message counter was incremented
            let total = channel.get_total_messages();
            assert_eq!(total, Some(500_001));
            // Verify message data was stored correctly
            let msg = channel.received_messages(1).unwrap().unwrap();
            assert_eq!(msg.0, alice); // verify sender
            assert_eq!(msg.1, message); // verify message content
        }
    
        #[ink::test]
        fn test_edit_messages() {
            // Arrange
            let (alice, bob) = setup();
            let mut channel = ChannelContract::new(Some(vec!["Hello, world!".to_string()]), None, "String".to_string());
            let message = String::from("Original message");
            let edited_message = String::from("Edited message");
    
            // Act - First send a message
            channel.send_messages(message).unwrap();
            
            // Try to edit as message owner
            let result_owner = channel.edit_messages(edited_message.clone(), 1);
            assert!(result_owner.is_ok());
    
            // Try to edit as different user (should fail)
            set_caller::<DefaultEnvironment>(bob);
            let result_other = channel.edit_messages(String::from("Unauthorized attempt"), 1);
            assert!(result_other.is_err());
    
            // Assert - Verify message was edited correctly
            let msg = channel.received_messages(1).unwrap().unwrap();
            assert_eq!(msg.1, edited_message);
        }
    
        #[ink::test]
        fn test_governance_integration() {
            // Arrange
            let (alice, governance_address) = setup();
            let mut channel = ChannelContract::new(Some(vec!["Hello, world!".to_string()]), None, "String".to_string());
    
            // Act & Assert
            // Test setting governance address
            let result = channel.set_address_governance(governance_address);
            assert!(result.is_ok());
    
            // Try to set governance address again (should fail)
            let result_second = channel.set_address_governance(governance_address);
            assert!(result_second.is_err());
    
            // Verify governance address was stored correctly
            assert_eq!(channel.get_address_governance(), Some(governance_address));
        }    
       
        #[ink::test]
        fn test_received_messages_not_found() {
            // Arrange
            let channel = ChannelContract::new(Some(vec!["Hello, world!".to_string()]), None, "String".to_string());
    
            // Act - Try to get non-existent message
            let result = channel.received_messages(999);
    
            // Assert - Should return None for non-existent message
            assert!(result.unwrap().is_none());
        }
    
        #[ink::test]
        fn test_default_message() {
            // Arrange
            let channel = ChannelContract::new(Some(vec!["Hello, world!".to_string()]), None, "String".to_string());
    
            // Act - Get default message
            let result = channel.get_default_message();
    
            // Assert - Should return successfully
            assert!(result.is_ok());
        }
    }
}

#[cfg(feature = "ink-as-dependency")]
pub use self::channel::*;