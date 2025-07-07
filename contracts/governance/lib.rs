//! Governance contract module for managing channel creation and voting
//! 
//! This module implements the core governance functionality including:
//! - Channel management and creation
//! - Voting system for price changes
//! - Fee collection and distribution
//! - Fake channel detection and reporting

#![cfg_attr(not(feature = "std"), no_std, no_main)]
#[openbrush::contract]
pub mod governance {
    use openbrush::{storage::Mapping, traits::Storage};
    use pidchat_pkg::impls::governance::{ governance::*, data };

    /// Main storage struct for the governance contract
    #[ink(storage)]
    #[derive(Default, Storage)]
    pub struct GovernanceContract {
        /// Core governance data storage
        #[storage_field]
        governance_data: data::Data,
    }
 
    impl GovernanceImp for GovernanceContract {}

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
        pub fn new(token_address: Option<AccountId>,price_per_channel: u128,qtd_total_per_vote: u128, fee_receiver: Option<AccountId>) -> Self {
            let mut instance = Self::default();

            // Initialize core contract data
            instance.governance_data.token_address = token_address;
            instance.governance_data.channel_id = 0;
            instance.governance_data.channel_fake_id = 0;
            instance.governance_data.channels = Mapping::default();
            instance.governance_data.price = price_per_channel; // Base price for channel creation
            instance.governance_data.balance_of_auditor = 50_000_000_000_000_000_000_000_000u128;
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