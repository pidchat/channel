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
	 * getTotalChannel
	 *
	*/
	"getTotalChannel" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTotalChannel", [], __options);
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
	 * setTimeBlockBalancePost
	 *
	 * @param { (number | string | BN) } timeBlockBalancePost,
	*/
	"setTimeBlockBalancePost" (
		timeBlockBalancePost: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::setTimeBlockBalancePost", [timeBlockBalancePost], __options);
	}

	/**
	 * getTimeVotePrice
	 *
	*/
	"getTimeVotePrice" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTimeVotePrice", [], __options);
	}

	/**
	 * getTimeBlockBalancePost
	 *
	*/
	"getTimeBlockBalancePost" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTimeBlockBalancePost", [], __options);
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
	 * getTotalFakeOpen
	 *
	*/
	"getTotalFakeOpen" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTotalFakeOpen", [], __options);
	}

	/**
	 * getBalanceAuditor
	 *
	*/
	"getBalanceAuditor" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getBalanceAuditor", [], __options);
	}

	/**
	 * openVoteForPrice
	 *
	 * @param { (string | number | BN) } newPrice,
	 * @param { (string | number | BN) } newBalanceOfAuditor,
	*/
	"openVoteForPrice" (
		newPrice: (string | number | BN),
		newBalanceOfAuditor: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::openVoteForPrice", [newPrice, newBalanceOfAuditor], __options);
	}

	/**
	 * getTimeVoteFake
	 *
	*/
	"getTimeVoteFake" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getTimeVoteFake", [], __options);
	}

	/**
	 * checkChannelFake
	 *
	 * @param { (string | number | BN) } channelId,
	*/
	"checkChannelFake" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::checkChannelFake", [channelId], __options);
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
	 * getBalanceTokenLocked
	 *
	*/
	"getBalanceTokenLocked" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getBalanceTokenLocked", [], __options);
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
	 * setTimeVotePrice
	 *
	 * @param { (number | string | BN) } timeVotePrice,
	*/
	"setTimeVotePrice" (
		timeVotePrice: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::setTimeVotePrice", [timeVotePrice], __options);
	}

	/**
	 * transferBalanceChannel
	 *
	 * @param { ArgumentTypes.AccountId | null } addressToken,
	 * @param { (number | string | BN) } typeTransfer,
	 * @param { (string | number | BN) } channelId,
	*/
	"transferBalanceChannel" (
		addressToken: ArgumentTypes.AccountId | null,
		typeTransfer: (number | string | BN),
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::transferBalanceChannel", [addressToken, typeTransfer, channelId], __options);
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
	 * getVotesPrice
	 *
	*/
	"getVotesPrice" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getVotesPrice", [], __options);
	}

	/**
	 * setTimeVoteFake
	 *
	 * @param { (number | string | BN) } timeVoteFake,
	*/
	"setTimeVoteFake" (
		timeVoteFake: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::setTimeVoteFake", [timeVoteFake], __options);
	}

	/**
	 * getChannelFake
	 *
	 * @param { (string | number | BN) } channelFakeId,
	*/
	"getChannelFake" (
		channelFakeId: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getChannelFake", [channelFakeId], __options);
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
	 * getPricePerChannel
	 *
	*/
	"getPricePerChannel" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::getPricePerChannel", [], __options);
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
	 * addMessagesPublic
	 *
	 * @param { Array<string> | null } defaultMessage,
	 * @param { string } typeDefaultMessageChannel,
	*/
	"addMessagesPublic" (
		defaultMessage: Array<string> | null,
		typeDefaultMessageChannel: string,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::addMessagesPublic", [defaultMessage, typeDefaultMessageChannel], __options);
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
	 * openVoteForFakeNews
	 *
	 * @param { (string | number | BN) } channelId,
	 * @param { string } reason,
	*/
	"openVoteForFakeNews" (
		channelId: (string | number | BN),
		reason: string,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "governanceImp::openVoteForFakeNews", [channelId, reason], __options);
	}

	/**
	 * renounceOwnership
	 *
	*/
	"renounceOwnership" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::renounceOwnership", [], __options);
	}

	/**
	 * transferOwnership
	 *
	 * @param { ArgumentTypes.AccountId } newOwner,
	*/
	"transferOwnership" (
		newOwner: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::transferOwnership", [newOwner], __options);
	}

	/**
	 * owner
	 *
	*/
	"owner" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::owner", [], __options);
	}

}