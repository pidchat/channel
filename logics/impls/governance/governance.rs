#![warn(clippy::arithmetic_side_effects)]
use crate::impls::governance::data::Data;
use openbrush::{
    contracts::traits::psp22::PSP22Ref,
    contracts::psp22::PSP22Error,
    traits::{
        Balance,
        AccountId,
        Storage,
        String
    },
};
use ink_prelude::vec::Vec;
use super::data::GovError;
use ink::{
    env::hash::Blake2x256,
    primitives::Hash,
};

/// Governance implementation trait that provides functionality for managing channels,
/// voting on fake news, and handling token payments

#[openbrush::wrapper]
pub type GovernanceRef = dyn GovernanceImp;

#[openbrush::trait_definition]
pub trait GovernanceImp : Storage<Data> + Internal{
    
    /// Gets channel details by ID
    /// Returns tuple of (owner, balance, expiry timestamp, creator) if found
    #[ink(message)]
    fn get_channel(&self,channel_id: u128) -> Result<Option<(AccountId, Balance,u64,AccountId)>, PSP22Error>{        
        let channel = self.data::<Data>().channels.get(&channel_id);
        if channel == Default::default() {
            return Err(PSP22Error::Custom(GovError::NotFound.as_str()));
        }            
        Ok(channel)    
    }

    /// Gets total number of channels created
    #[ink(message)] 
    fn get_total_channel(&self) -> Result<u128, PSP22Error>{
        Ok(self.data::<Data>().channel_id)    
    } 


    /// Creates a new public channel with payment
    /// Takes channel address as input and returns channel ID
    #[ink(message)]
    fn add_messages_public(&mut self,default_message: Option<Vec<String>>,type_default_message_channel: String) -> Result<AccountId, PSP22Error>{
        let caller = Self::env().caller();
        
        // Get token address and price
        let token_address = self.data::<Data>().token_address
            .ok_or_else(|| PSP22Error::Custom(GovError::NotFoundToken.as_str()))?;
        let price = self.data::<Data>().price.clone();
        if price == 0 {
            return Err(PSP22Error::Custom(String::from(GovError::PriceNotSet.as_str())));
        }

        // Process payment
        let adddress_this_contract = Self::env().account_id();        
        PSP22Ref::transfer_from(&token_address,caller, adddress_this_contract, price, Vec::<u8>::new())
            .map_err(|_| PSP22Error::Custom(GovError::PaymentFail.as_str()))?;

        // Create new channel
        self.data::<Data>().channel_id +=1;
        let date_block = Self::env().block_timestamp() + (86624000*10); // 10 days expiry        
        let id_channel = self.data::<Data>().channel_id.clone();        
        //create channel 
         let address_this_contract = Self::env().account_id();
        let date_salt = (default_message.clone(),type_default_message_channel.clone(),address_this_contract.clone());
        let salt = Self::env().hash_encoded::<Blake2x256, _>(&date_salt);
        let contract_code_hash =  self.data::<Data>().channel_contract_code_hash;
       
        let address_channel = self.create_channel(address_this_contract,default_message.clone(),type_default_message_channel.clone(),contract_code_hash,salt)?;
        // Store channel data
        self.data::<Data>().channels.insert(&id_channel, &(address_channel,price,date_block,caller));
        self.data::<Data>().channels_for_addrress.insert(&address_channel,&id_channel);
        
        Ok(address_channel)
    }

    /// Claims reward for correctly identifying fake news
    /// Returns reward amount if successful
    #[ink(message)]
    fn reward_safe_for_fake_news(&mut self,channel_id: u128) -> Result<u128, PSP22Error>{
        let caller = Self::env().caller();
        
        // Verify channel exists and user voted
        self.data::<Data>().channels.get(&channel_id)
            .ok_or_else(|| PSP22Error::Custom(GovError::NotFound.as_str()))?;
        self.data::<Data>().channel_fake_in_user.get(&(caller,channel_id))
            .ok_or_else(|| PSP22Error::Custom(GovError::NoVote.as_str()))?;
       
        // Check if already claimed
        let user_in_recovery = self.data::<Data>().recovery_in_user_payment.get(&(caller,channel_id));
        if user_in_recovery != Default::default() {
            return Err(PSP22Error::Custom(GovError::DepositDone.as_str()));
        }
        
        // Get vote counts
        let quantity_yes = self.data::<Data>().qtd_fake_yes.get(&channel_id).unwrap();
        let quantity_no = self.data::<Data>().qtd_fake_no.get(&channel_id).unwrap();
        if quantity_yes < quantity_no {
            return Err(PSP22Error::Custom(GovError::NoApproval.as_str()));
        }

        // Check if voting period ended
        let everybody  =  quantity_yes + quantity_no;  
        let date_end = self.data::<Data>().deadlines_fake.get(&channel_id).unwrap();
        let date_block = Self::env().block_timestamp();
        if date_block < date_end {
            return Err(PSP22Error::Custom(GovError::TimeInVote.as_str()));
        }

        // Calculate and process reward
        let is_autor_auditor_open_fake = self.data::<Data>().who_open_fake.get(&channel_id).unwrap();
        let channel = self.data::<Data>().channels.get(&channel_id).unwrap();
        let token_address = self.data::<Data>().token_address.unwrap();
        
        let perc_auditor:Balance = (channel.1 * 10) / 100; // 10% for auditor
        let mut division:Balance =  (channel.1 - perc_auditor) / everybody;
        if is_autor_auditor_open_fake == caller {
            division = perc_auditor + channel.1;
        }

        // Transfer reward
        PSP22Ref::transfer(&token_address, caller, division, Vec::<u8>::new())
            .map_err(|_| PSP22Error::Custom(GovError::PaymentFail.as_str()))?;
            
        // Record payment
        self.data::<Data>().recovery_in_user_payment.insert(&(caller,channel_id), &division);    
        Ok(division)
    }

    /// Gets current price for creating channels
    #[ink(message)]
    fn get_prices(&mut self) -> Result<Balance, PSP22Error>{
        Ok(self.data::<Data>().price)
    }

    /// Opens voting period for marking content as fake news
    #[ink(message)]
    fn open_vote_for_fake_news(&mut self,channel_id: u128, reason: String) -> Result<(), PSP22Error>{
        let caller = Self::env().caller();        
        
        // Verify channel exists and not expired
        let channel = self.data::<Data>().channels.get(&channel_id)
                        .ok_or_else(|| PSP22Error::Custom(GovError::NotFound.as_str()))?;
        let mut date_block = Self::env().block_timestamp();
        if date_block > channel.2 {
            return Err(PSP22Error::Custom(GovError::TimeOverOpenVote.as_str()));
        }      

        // Check if vote already open
        let open_in_vote = self.data::<Data>().who_open_fake.get(&channel_id);
        if open_in_vote != Default::default() {
            return Err(PSP22Error::Custom(GovError::InProgress.as_str()));
        }        
         //verify auditor balance
         let balance_of = PSP22Ref::balance_of(&self.data::<Data>().token_address.unwrap(), caller);
         if balance_of < self.data::<Data>().balance_of_auditor {
             return Err(PSP22Error::Custom(GovError::YouAreNotAuditor.as_str()));
         }
        // Process stake payment
        let address_this_contract = Self::env().account_id();
        let token_address = self.data::<Data>().token_address;
        if token_address == Default::default() {
            return Err(PSP22Error::Custom(GovError::NotFoundToken.as_str()));
        }
        PSP22Ref::transfer_from(&token_address.unwrap(),caller, address_this_contract, channel.1, Vec::<u8>::new())
        .map_err(|_| PSP22Error::Custom(GovError::PaymentFail.as_str()))?;

        // Initialize vote
        date_block = date_block + (86624000); // 1 day voting period
        self.data::<Data>().qtd_fake_yes.insert(&channel_id, &1);
        self.data::<Data>().qtd_fake_no.insert(&channel_id, &0);
        self.data::<Data>().deadlines_fake.insert(&channel_id, &date_block);
        self.data::<Data>().who_open_fake.insert(&channel_id, &caller);
        self.data::<Data>().channel_fake_in_user.insert(&(caller,channel_id), &date_block);
        self.data::<Data>().channel_fake_id+=1;
        let id_fake = self.data::<Data>().channel_fake_id;
        self.data::<Data>().open_fake.insert(&id_fake,&channel_id);
        self.data::<Data>().reason_fake.insert(&channel_id,&reason);

        Ok(())
    }

    /// Gets current vote counts and deadline for fake news vote
    #[ink(message)]
    fn get_votes_fakes_news(&self,channel_id: u128) -> Result<(u128,u128,u64,String), PSP22Error>{
        let date_end = self.data::<Data>().deadlines_fake.get(&channel_id)
            .ok_or_else(|| PSP22Error::Custom(GovError::NotFound.as_str()))?;
        let quantity_yes = self.data::<Data>().qtd_fake_yes.get(&channel_id).unwrap();
        let quantity_no = self.data::<Data>().qtd_fake_no.get(&channel_id).unwrap();       
         let channel_reason = self.data::<Data>().reason_fake.get(&channel_id);
        Ok((quantity_yes,quantity_no,date_end,channel_reason.unwrap()))
    }

    /// Casts vote for fake news
    #[ink(message)]
    fn doing_vote_fake(&mut self,channel_id: u128,is_fake:bool) -> Result<(), PSP22Error>{
        let caller = Self::env().caller();
        
        // Verify channel exists
        self.data::<Data>().channels.get(&channel_id)
            .ok_or_else(|| PSP22Error::Custom(GovError::NotFound.as_str()))?;
            
        // Verify vote is open
        self.data::<Data>().who_open_fake.get(&channel_id)
            .ok_or_else(|| PSP22Error::Custom(GovError::NotOpenVoteInFake.as_str()))?;
        
        // Check if user already voted
        let user_in_vote = self.data::<Data>().channel_fake_in_user.get(&(caller, channel_id))
            .unwrap_or_default();
        if user_in_vote != Default::default() {
            return Err(PSP22Error::Custom(GovError::VoteDone.as_str()));
        }

        // Check if voting period ended
        let current_timestamp = Self::env().block_timestamp();
        let vote_deadline = self.data::<Data>().deadlines_fake.get(&channel_id)
            .unwrap_or_default();
        if current_timestamp > vote_deadline {
            return Err(PSP22Error::Custom(GovError::TimeOver.as_str()));
        }        

        // Check vote limit not exceeded
        let qtd_yes = self.data::<Data>().qtd_fake_yes.get(&channel_id).unwrap();
        let qtd_no = self.data::<Data>().qtd_fake_no.get(&channel_id).unwrap();
        let everybody  =  qtd_yes + qtd_no +1;
        let qtd_total_per_vote = self.data::<Data>().qtd_total_per_vote;
        if everybody > qtd_total_per_vote {
            return Err(PSP22Error::Custom(GovError::VotoFull.as_str()));
        }

        // Record vote
        if is_fake {          
            self.data::<Data>().qtd_fake_yes.insert(&channel_id, &(qtd_yes + 1u128));
        }else{           
            self.data::<Data>().qtd_fake_no.insert(&channel_id, &(qtd_no + 1u128));
        }
        let date = Self::env().block_timestamp();
        self.data::<Data>().channel_fake_in_user.insert(&(caller,channel_id), &date);
        Ok(())
    }  

    /// Gets total number of fake news votes opened
    #[ink(message)]
    fn get_total_fake_open(&self) -> Result<u128, PSP22Error>{
        Ok(self.data::<Data>().channel_fake_id)
    }

    /// Opens voting period for changing channel price
    #[ink(message)]
    fn open_vote_for_price(&mut self, new_price:Balance,new_balance_of_auditor:Balance) -> Result<(), PSP22Error>{
        let date = Self::env().block_timestamp();
        let vote_price_end =  self.data::<Data>().vote_price_end;
        if date <= vote_price_end {
            return Err(PSP22Error::Custom(GovError::InProgress.as_str()));
        }

        // Verify caller has enough tokens to be auditor
        let caller = Self::env().caller();
        let balance_of = PSP22Ref::balance_of(&self.data::<Data>().token_address.unwrap(), caller);
        if balance_of < self.data::<Data>().balance_of_auditor {
            return Err(PSP22Error::Custom(GovError::YouAreNotAuditor.as_str()));
        }

        // Initialize price vote
        self.data::<Data>().new_price = new_price;
        self.data::<Data>().new_balance_of_auditor = new_balance_of_auditor;
        self.data::<Data>().vote_price_end = date;
        self.data::<Data>().vote_id+=1u128;
        let vote_id = self.data::<Data>().vote_id;
        self.data::<Data>().qtd_price_no.insert(&vote_id, &0u128);
        self.data::<Data>().qtd_price_yes.insert(&vote_id, &0u128);
        Ok(())
    }

    /// Gets current vote counts and details for price change vote
    #[ink(message)]
    fn get_votes_price(&self) -> Result<(u128,u128,Balance,Balance,u64), PSP22Error>{        
        let vote_id = self.data::<Data>().vote_id;
        if vote_id == 0 {
            return Err(PSP22Error::Custom(GovError::NotFound.as_str()));
        }
        let qtd_price_yes = self.data::<Data>().qtd_price_yes.get(&vote_id).unwrap();
        let qtd_price_no = self.data::<Data>().qtd_price_no.get(&vote_id).unwrap();
        let new_price = self.data::<Data>().new_price;
        let new_balance_of_auditor = self.data::<Data>().new_balance_of_auditor;
        let data_end  = self.data::<Data>().vote_price_end;        
        Ok((qtd_price_yes,qtd_price_no,new_price,new_balance_of_auditor,data_end))
    }

    /// Casts vote for price change
    #[ink(message)]
    fn doing_vote_price(&mut self,is_proved:bool) -> Result<(), PSP22Error>{
        let caller = Self::env().caller();
        
        // Verify caller has enough tokens to be auditor
        let balance_of = PSP22Ref::balance_of(&self.data::<Data>().token_address.unwrap(), caller);
        if balance_of < self.data::<Data>().balance_of_auditor {
            return Err(PSP22Error::Custom(GovError::YouAreNotAuditor.as_str()));
        }

        // Check if voting period ended
        let vote_id = self.data::<Data>().vote_id;
        let date = Self::env().block_timestamp();
        let vote_price_end =  self.data::<Data>().vote_price_end;
        if date > vote_price_end {
            return Err(PSP22Error::Custom(GovError::DateNexVoteIn.as_str()));
        }

        // Check if user already voted
        let user_in_vote = self.data::<Data>().price_vote_auditor.get(&(caller,vote_id)).unwrap();
        if user_in_vote != Default::default() {
            return Err(PSP22Error::Custom(GovError::VoteDone.as_str()));
        }
        
        // Record vote
        if is_proved {
            let qtd = self.data::<Data>().qtd_price_yes.get(&vote_id).unwrap();
            self.data::<Data>().qtd_price_yes.insert(&vote_id, &(qtd + 1u128));
        }else{
            let qtd = self.data::<Data>().qtd_price_no.get(&vote_id).unwrap();
            self.data::<Data>().qtd_price_no.insert(&vote_id, &(qtd + 1u128));
        }
        let date = Self::env().block_timestamp();
        self.data::<Data>().price_vote_auditor.insert(&(caller,vote_id), &date);
        Ok(())
    }

    /// Gets total amount of tokens locked in contract
    #[ink(message)]
    fn get_balance_token_locked(&mut self) -> u128{
        PSP22Ref::balance_of(&self.data::<Data>().token_address.unwrap(), Self::env().account_id())        
    }   

    /// Updates channel price if vote passed
    #[ink(message)]
    fn sync(&mut self) -> Result<(), PSP22Error>{
        let date = Self::env().block_timestamp();
        let vote_price_end =  self.data::<Data>().vote_price_end;
        let new_balance_of_auditor = self.data::<Data>().new_balance_of_auditor;
        let price_new = self.data::<Data>().new_price;
        let price = self.data::<Data>().price;
        let vote_id = self.data::<Data>().vote_id;
        
        // Check if vote ended and price changed
        if date > vote_price_end && price_new != price {
            let qtd_price_no= self.data::<Data>().qtd_price_no.get(&vote_id).unwrap();
            let qtd_price_yes = self.data::<Data>().qtd_price_yes.get(&vote_id).unwrap();
            if qtd_price_yes > qtd_price_no {
                // Update price and auditor balance
                self.data::<Data>().balance_of_auditor = new_balance_of_auditor;
                self.data::<Data>().price = price_new;                
            }
        }        
        Ok(())
    }  

    /// Allows channel owner to recover staked balance after expiry
    #[ink(message)]
    fn recovery_safe_balance_public(&mut self, channel_id: u128) -> Result<u128, PSP22Error>{       
        let channel = self.data::<Data>().channels.get(&channel_id)
            .ok_or_else(|| PSP22Error::Custom(GovError::NotFound.as_str()))?;

        let caller = Self::env().caller();
        
        // Verify caller is channel owner
        if channel.3 != caller {
            return Err(PSP22Error::Custom(GovError::NotChannelOwner.as_str()));
        }
        
        // Check if channel expired
        let time_block = channel.2;
        let date = Self::env().block_timestamp();
        if time_block > date {
            return Err(PSP22Error::Custom(GovError::BlockedBalance.as_str()));
        }        

        // Check if already claimed
        let recovery_in_user_payment = self.data::<Data>().recovery_in_user_payment.get(&(caller,channel_id));
        if recovery_in_user_payment != Default::default() {
            return Err(PSP22Error::Custom(GovError::DepositDone.as_str()));
        }

        let mut balance = channel.1;

        // Check if channel has open fake news vote
        let channel_in_vote = self.data::<Data>().who_open_fake.get(&channel_id);
        if channel_in_vote != Default::default() {
            let date_end = self.data::<Data>().deadlines_fake.get(&channel_id).unwrap();
            let date_block = Self::env().block_timestamp();
            if date_block < date_end {
                return Err(PSP22Error::Custom(GovError::InProgress.as_str()));
            }
            let qtd_yes = self.data::<Data>().qtd_fake_yes.get(&channel_id).unwrap();
            let qtd_no = self.data::<Data>().qtd_fake_no.get(&channel_id).unwrap();
            if qtd_yes > qtd_no {
                return Err(PSP22Error::Custom(GovError::NoApproval.as_str()));
            }
            balance = balance + channel.1;
        }

        // Process fee if receiver set
        let fee_receiver = self.data::<Data>().fee_receiver;
        if fee_receiver != Default::default() {
            let fee = (balance * 3) / 100; // 3% fee
            balance = balance - fee;
            self.data::<Data>().fee_balance = self.data::<Data>().fee_balance + fee;
        }

        // Transfer balance
        let token_address = self.data::<Data>().token_address.unwrap();
        PSP22Ref::transfer(&token_address, caller, balance, Vec::<u8>::new())
            .map_err(|_| PSP22Error::Custom(GovError::PaymentFail.as_str()))?;

        self.data::<Data>().recovery_in_user_payment.insert(&(caller,channel_id),&balance);

        Ok(balance)
    }

    /// Gets channel ID for given contract address
    #[ink(message)]
    fn get_id_channel(&self, address_contract: AccountId) -> Option<u128>{
        self.data::<Data>().channels_for_addrress.get(&address_contract)
    }

    /// Gets fee receiver wallet address
    #[ink(message)]
    fn get_fee_receiver_wallet(&self) -> Option<AccountId>{
        self.data::<Data>().fee_receiver
    }

    /// Gets accumulated fee balance
    #[ink(message)]
    fn get_fee_receiver_balance(&self) -> Balance{
        self.data::<Data>().fee_balance
    }
    
    /// Allows fee receiver to withdraw accumulated fees
    #[ink(message)]
    fn get_fee_receiver_withdrawal(&mut self) -> Result<u128, PSP22Error>{
        let fee_receiver = self.data::<Data>().fee_receiver;
        let caller = Self::env().caller();
        
        // Verify caller is fee receiver
        if fee_receiver != Some(caller) {
            return Err(PSP22Error::Custom(GovError::NoApproval.as_str()));
        }

        let balance = self.data::<Data>().fee_balance;
        let token_address = self.data::<Data>().token_address.unwrap();

        // Transfer fees
        PSP22Ref::transfer(&token_address, caller, balance, Vec::<u8>::new())
            .map_err(|_| PSP22Error::Custom(GovError::PaymentFail.as_str()))?;   
            
        self.data::<Data>().fee_balance = 0;     
        Ok(balance)
    }

    /// Gets total votes allowed per voting round
    #[ink(message)]
    fn get_total_votes_allowed(&self) -> u128{
        self.data::<Data>().qtd_total_per_vote
    }

    /// Gets the current price per channel
    #[ink(message)]
    fn get_price_per_channel(&self) -> u128{
        self.data::<Data>().price
    }

    /// Gets the current balance of the auditor
    #[ink(message)]
    fn get_balance_auditor(&self) -> u128{
        self.data::<Data>().balance_of_auditor
    }
     #[ink(message)]
    fn transfer_balance_channel(&mut self,address_token: Option<AccountId>, type_transfer: u8, channel_id: u128) -> Result<(), PSP22Error>{
        let caller = Self::env().caller();
        let channel = self.data::<Data>().channels.get(&channel_id);
        // Verify channel exists
        if channel == None {
            return Err(PSP22Error::Custom(GovError::PaymentFail.as_str()));
        }
        if channel.unwrap().3 != caller {
            return Err(PSP22Error::Custom(GovError::NotChannelOwner.as_str()));
        }         
        self.transfer_balance(channel.unwrap().0,address_token,caller, type_transfer);
        Ok(())
    }
    /// Checks if a channel is marked as fake news
    #[ink(message)]
    fn check_channel_fake(&self, channel_id: u128) -> Result<String, PSP22Error>{
        let channel_reason = self.data::<Data>().reason_fake.get(&channel_id);
        if channel_reason == Default::default() {
            return Err(PSP22Error::Custom(GovError::NotOpenVoteInFake.as_str()));
        }
        Ok(channel_reason.unwrap())
    }
    
}

pub trait Internal {
    fn create_channel(
        &self,
        address_this_contract: AccountId,
        default_message: Option<Vec<String>>,
        type_default_message_channel: String,
        pair_hash: Hash,
        salt_bytes: [u8; 32],
    ) -> Result<AccountId, PSP22Error>;
    fn  destroy_channel(
        &self,
        channel_id: AccountId,
    ) -> Result<(), PSP22Error>;
    fn transfer_balance(
        &self,
        channel_id: AccountId,
        address_token: Option<AccountId>,
        to: AccountId,
        type_transfer: u8
    ) -> Result<(), PSP22Error>;

}