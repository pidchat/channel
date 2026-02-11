//! Governance contract module for managing channel creation and voting
//! 
//! This module implements the core governance functionality including:
//! - Channel management and creation
//! - Voting system for price changes
//! - Fee collection and distribution
//! - Fake channel detection and reporting

#![cfg_attr(not(feature = "std"), no_std, no_main)]
#[openbrush::implementation(Ownable)]
#[openbrush::contract]
pub mod governance {
    use ink::ToAccountId;
    use ink::env::call::FromAccountId;
    use pidchat_pkg::impls::governance::{ governance::*, data };
    use channel::channel::ChannelContractRef;
    use ink_prelude::vec::Vec;
    use openbrush::{
        contracts::{
            ownable::self,
            reentrancy_guard,
            traits::psp22::PSP22Error,
        },
        storage::Mapping,
        traits::{
            Storage, String
        },
    };
    /// Main storage struct for the governance contract
    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct GovernanceContract {
        /// Core governance data storage
        #[storage_field]
        governance_data: data::Data,
        /// Reentrancy guard for security
        #[storage_field]
        guard: reentrancy_guard::Data,
        /// Ownable data for access control
        #[storage_field]
        ownable: ownable::Data,
    }
 
    impl GovernanceImp for GovernanceContract {}
    impl InternalImp for GovernanceContract {
        /// Creates a new channel contract instance
        /// 
        /// # Arguments
        /// * `default_message` - Optional default messages for the channel
        /// * `address_governance` - Optional governance contract address
        /// * `type_channel` - Type of channel (Bytes or String)
        fn create_channel(
            &self,
            address_this_contract: AccountId,
            default_message: Option<Vec<String>>,
            type_default_message_channel: String,
            pair_hash: Hash,
            salt_bytes: [u8; 32],
        ) ->  Result<AccountId, PSP22Error> {
            let channel = match ChannelContractRef::new(
                default_message,
                Some(address_this_contract),
                type_default_message_channel,
                false,
            ).endowment(0)
            .code_hash(pair_hash)
            .salt_bytes(&salt_bytes[..4])
            .try_instantiate()
             {
                Ok(Ok(res)) => Ok(res),
                _ => Err(PSP22Error::Custom(String::from("Channel creation failed"))),
            }?;
                  
            Ok(channel.to_account_id())
        }
        /// Destroys a channel contract instance
        /// 
        /// # Arguments
        /// * `channel_id` - ID of the channel to destroy
        fn destroy_channel(
            &self,
            channel_id: AccountId,
        ) -> Result<(), PSP22Error> {
            let mut channel = ChannelContractRef::from_account_id(channel_id);
            channel.destroy()?;
            Ok(())
        }
       fn transfer_balance(
        &self,
        channel_id: AccountId,
        address_token: AccountId,
        to: AccountId,
        type_transfer: u8,
        amount: Balance,
    )  -> Result<(), PSP22Error> {
        let mut channel = ChannelContractRef::from_account_id(channel_id);
        channel.transfer_balance(address_token, to, type_transfer, amount)
         .map_err(|_| PSP22Error::Custom(String::from("Transfer failed")))?;
        Ok(())
    }

    }
    impl GovernanceContract {
        /// Creates a new instance of the governance contract
        /// 
        /// # Arguments
        /// * `token_address` - Optional address of the governance token contract
        /// * `fee_receiver` - Optional address that will receive collected fees
        /// 
        /// # Returns
        /// * New instance of GovernanceContract with initialized storage
        #[ink(constructor)]
        pub fn new(token_address: Option<AccountId>,channel_code_hash: Hash, price_per_channel: u128,qtd_total_per_vote: u128, fee_receiver: Option<AccountId>) -> Self {
            let mut instance = Self::default();
            let caller = instance.env().caller();
            // Initialize ownership to contract creator
            ownable::InternalImpl::_init_with_owner(&mut instance, caller);
            // Initialize core contract data
            instance.governance_data.token_address = token_address;
            instance.governance_data.channel_id = 0;
            instance.governance_data.channel_fake_id = 0;
            instance.governance_data.channels = Mapping::default();
            instance.governance_data.price = price_per_channel; // Base price for channel creation
            instance.governance_data.balance_of_auditor = 1_000_000_000_000_000_000_000_000u128;
            // Initialize voting related data
            instance.governance_data.vote_id = 0;
            instance.governance_data.new_price = 0;
            instance.governance_data.vote_price_end = 0;
            instance.governance_data.qtd_total_per_vote = qtd_total_per_vote; // Required votes threshold
            
            // Initialize fake news reporting mappings
            instance.governance_data.who_open_fake = Mapping::default();
            instance.governance_data.channel_fake_in_user = Mapping::default();
            instance.governance_data.qtd_fake_yes = Default::default();
            instance.governance_data.qtd_fake_no = Default::default();
            instance.governance_data.deadlines_fake = Default::default();
            instance.governance_data.open_fake = Mapping::default();
            
            // Initialize payment and fee related data
            instance.governance_data.recovery_in_user_payment = Mapping::default();
            instance.governance_data.price_vote_auditor = Mapping::default();
            instance.governance_data.qtd_price_no = Default::default();
            instance.governance_data.qtd_price_yes = Default::default();
            instance.governance_data.fee_receiver = fee_receiver;
            instance.governance_data.fee_balance = 0;
            instance.governance_data.channel_contract_code_hash = channel_code_hash;
            // voting deadline for price changes
            instance.governance_data.time_vote_price = 1;
            // voting deadline for fake news votes
            instance.governance_data.time_vote_fake = 1;
            // Time block balance post
            instance.governance_data.time_block_balance_post = 1;
            
            instance
        }
    }
    
    #[cfg(test)]
    mod tests {
        use super::*;       
        
        #[ink::test]
        fn it_works() {
            let accounts = ink_env::test::default_accounts();
            let mut instance = GovernanceContract::new(None,100,100,accounts.bob);
            assert_eq!(instance.get(), 0);
        }
    }
}
