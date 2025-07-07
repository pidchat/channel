/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types';
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/governance';
import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';



export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		apiPromise: ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__apiPromise = apiPromise;
	}
	/**
	 * getPrices
	 *
	*/
	"getPrices" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getPrices", [], __options);
	}

	/**
	 * getVotesPrice
	 *
	*/
	"getVotesPrice" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getVotesPrice", [], __options);
	}

	/**
	 * getFeeReceiverWithdrawal
	 *
	*/
	"getFeeReceiverWithdrawal" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getFeeReceiverWithdrawal", [], __options);
	}

	/**
	 * sync
	 *
	*/
	"sync" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::sync", [], __options);
	}

	/**
	 * getTotalFakeOpen
	 *
	*/
	"getTotalFakeOpen" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTotalFakeOpen", [], __options);
	}

	/**
	 * doingVotePrice
	 *
	 * @param { boolean } isProved,
	*/
	"doingVotePrice" (
		isProved: boolean,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::doingVotePrice", [isProved], __options);
	}

	/**
	 * openVoteForPrice
	 *
	 * @param { (string | number | BN) } newPrice,
	*/
	"openVoteForPrice" (
		newPrice: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::openVoteForPrice", [newPrice], __options);
	}

	/**
	 * rewardSafeForFakeNews
	 *
	 * @param { (string | number | BN) } channelId,
	*/
	"rewardSafeForFakeNews" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::rewardSafeForFakeNews", [channelId], __options);
	}

	/**
	 * recoverySafeBalancePublic
	 *
	 * @param { (string | number | BN) } channelId,
	*/
	"recoverySafeBalancePublic" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::recoverySafeBalancePublic", [channelId], __options);
	}

	/**
	 * getChannel
	 *
	 * @param { (string | number | BN) } channelId,
	*/
	"getChannel" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getChannel", [channelId], __options);
	}

	/**
	 * getFeeReceiverBalance
	 *
	*/
	"getFeeReceiverBalance" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getFeeReceiverBalance", [], __options);
	}

	/**
	 * getIdChannel
	 *
	 * @param { ArgumentTypes.AccountId } addressContract,
	*/
	"getIdChannel" (
		addressContract: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getIdChannel", [addressContract], __options);
	}

	/**
	 * getBalanceTokenLocked
	 *
	*/
	"getBalanceTokenLocked" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getBalanceTokenLocked", [], __options);
	}

	/**
	 * doingVoteFake
	 *
	 * @param { (string | number | BN) } channelId,
	 * @param { boolean } isFake,
	*/
	"doingVoteFake" (
		channelId: (string | number | BN),
		isFake: boolean,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::doingVoteFake", [channelId, isFake], __options);
	}

	/**
	 * getVotesFakesNews
	 *
	 * @param { (string | number | BN) } channelId,
	*/
	"getVotesFakesNews" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getVotesFakesNews", [channelId], __options);
	}

	/**
	 * addMessagesPublic
	 *
	 * @param { ArgumentTypes.AccountId } addressChannel,
	*/
	"addMessagesPublic" (
		addressChannel: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::addMessagesPublic", [addressChannel], __options);
	}

	/**
	 * getTotalChannel
	 *
	*/
	"getTotalChannel" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTotalChannel", [], __options);
	}

	/**
	 * openVoteForFakeNews
	 *
	 * @param { (string | number | BN) } channelId,
	*/
	"openVoteForFakeNews" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::openVoteForFakeNews", [channelId], __options);
	}

	/**
	 * getFeeReceiverWallet
	 *
	*/
	"getFeeReceiverWallet" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getFeeReceiverWallet", [], __options);
	}

	/**
	 * getTotalVotesAllowed
	 *
	*/
	"getTotalVotesAllowed" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTotalVotesAllowed", [], __options);
	}

	/**
	 * getPricePerChannel
	 *
	*/
	"getPricePerChannel" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getPricePerChannel", [], __options);
	}

}