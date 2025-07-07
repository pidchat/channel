/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryJSON, queryOkJSON, handleReturnType } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/governance';
import type * as ReturnTypes from '../types-returns/governance';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
import DATA_TYPE_DESCRIPTIONS from '../data/governance.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __apiPromise: ApiPromise;
	readonly __callerAddress : string;

	constructor(
		nativeContract : ContractPromise,
		nativeApi : ApiPromise,
		callerAddress : string,
	) {
		this.__nativeContract = nativeContract;
		this.__callerAddress = callerAddress;
		this.__apiPromise = nativeApi;
	}

	/**
	* getPrices
	*
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getPrices" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getPrices", [], __options , (result) => { return handleReturnType(result, getTypeDescription(9, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getVotesPrice
	*
	* @returns { Result<Result<[ReturnNumber, ReturnNumber, ReturnNumber, number], ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getVotesPrice" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<[ReturnNumber, ReturnNumber, ReturnNumber, number], ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getVotesPrice", [], __options , (result) => { return handleReturnType(result, getTypeDescription(13, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getFeeReceiverWithdrawal
	*
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getFeeReceiverWithdrawal" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getFeeReceiverWithdrawal", [], __options , (result) => { return handleReturnType(result, getTypeDescription(9, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* sync
	*
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"sync" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::sync", [], __options , (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getTotalFakeOpen
	*
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getTotalFakeOpen" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTotalFakeOpen", [], __options , (result) => { return handleReturnType(result, getTypeDescription(9, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* doingVotePrice
	*
	* @param { boolean } isProved,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"doingVotePrice" (
		isProved: boolean,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::doingVotePrice", [isProved], __options , (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* openVoteForPrice
	*
	* @param { (string | number | BN) } newPrice,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"openVoteForPrice" (
		newPrice: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::openVoteForPrice", [newPrice], __options , (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* rewardSafeForFakeNews
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"rewardSafeForFakeNews" (
		channelId: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::rewardSafeForFakeNews", [channelId], __options , (result) => { return handleReturnType(result, getTypeDescription(9, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* recoverySafeBalancePublic
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"recoverySafeBalancePublic" (
		channelId: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::recoverySafeBalancePublic", [channelId], __options , (result) => { return handleReturnType(result, getTypeDescription(9, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getChannel
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<[ReturnTypes.AccountId, ReturnNumber, number, ReturnTypes.AccountId] | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getChannel" (
		channelId: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<[ReturnTypes.AccountId, ReturnNumber, number, ReturnTypes.AccountId] | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getChannel", [channelId], __options , (result) => { return handleReturnType(result, getTypeDescription(19, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getFeeReceiverBalance
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getFeeReceiverBalance" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getFeeReceiverBalance", [], __options , (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getIdChannel
	*
	* @param { ArgumentTypes.AccountId } addressContract,
	* @returns { Result<ReturnNumber | null, ReturnTypes.LangError> }
	*/
	"getIdChannel" (
		addressContract: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getIdChannel", [addressContract], __options , (result) => { return handleReturnType(result, getTypeDescription(24, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getBalanceTokenLocked
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getBalanceTokenLocked" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getBalanceTokenLocked", [], __options , (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* doingVoteFake
	*
	* @param { (string | number | BN) } channelId,
	* @param { boolean } isFake,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"doingVoteFake" (
		channelId: (string | number | BN),
		isFake: boolean,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::doingVoteFake", [channelId, isFake], __options , (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getVotesFakesNews
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<[ReturnNumber, ReturnNumber, number], ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getVotesFakesNews" (
		channelId: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<[ReturnNumber, ReturnNumber, number], ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getVotesFakesNews", [channelId], __options , (result) => { return handleReturnType(result, getTypeDescription(26, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* addMessagesPublic
	*
	* @param { ArgumentTypes.AccountId } addressChannel,
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"addMessagesPublic" (
		addressChannel: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::addMessagesPublic", [addressChannel], __options , (result) => { return handleReturnType(result, getTypeDescription(9, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getTotalChannel
	*
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getTotalChannel" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTotalChannel", [], __options , (result) => { return handleReturnType(result, getTypeDescription(9, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* openVoteForFakeNews
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"openVoteForFakeNews" (
		channelId: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::openVoteForFakeNews", [channelId], __options , (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getFeeReceiverWallet
	*
	* @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
	*/
	"getFeeReceiverWallet" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getFeeReceiverWallet", [], __options , (result) => { return handleReturnType(result, getTypeDescription(29, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getTotalVotesAllowed
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getTotalVotesAllowed" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTotalVotesAllowed", [], __options , (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getPricePerChannel
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getPricePerChannel" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getPricePerChannel", [], __options , (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

}