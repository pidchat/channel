/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryOkJSON, queryJSON, handleReturnType } from '@727-ventures/typechain-types';
import { txSignAndSend } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/governance';
import type * as ReturnTypes from '../types-returns/governance';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
// @ts-ignore
import type {EventRecord} from "@polkadot/api/submittable";
import {decodeEvents} from "../shared/utils";
import DATA_TYPE_DESCRIPTIONS from '../data/governance.json';
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/governance.json';


export default class Methods {
	readonly __nativeContract : ContractPromise;
	readonly __keyringPair : KeyringPair;
	readonly __callerAddress : string;
	readonly __apiPromise: ApiPromise;

	constructor(
		apiPromise : ApiPromise,
		nativeContract : ContractPromise,
		keyringPair : KeyringPair,
	) {
		this.__apiPromise = apiPromise;
		this.__nativeContract = nativeContract;
		this.__keyringPair = keyringPair;
		this.__callerAddress = keyringPair.address;
	}

	/**
	* getBalanceTokenLocked
	*
	* @returns { void }
	*/
	"getBalanceTokenLocked" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::getBalanceTokenLocked", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* doingVotePrice
	*
	* @param { boolean } isProved,
	* @returns { void }
	*/
	"doingVotePrice" (
		isProved: boolean,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::doingVotePrice", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [isProved], __options);
	}

	/**
	* getBalanceAuditor
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getBalanceAuditor" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getBalanceAuditor", [], __options, (result) => { return handleReturnType(result, getTypeDescription(11, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getChannelFake
	*
	* @param { (string | number | BN) } channelFakeId,
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getChannelFake" (
		channelFakeId: (string | number | BN),
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getChannelFake", [channelFakeId], __options, (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getTimeVoteFake
	*
	* @returns { Result<number, ReturnTypes.LangError> }
	*/
	"getTimeVoteFake" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<number, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTimeVoteFake", [], __options, (result) => { return handleReturnType(result, getTypeDescription(18, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* openVoteForPrice
	*
	* @param { (string | number | BN) } newPrice,
	* @param { (string | number | BN) } newBalanceOfAuditor,
	* @returns { void }
	*/
	"openVoteForPrice" (
		newPrice: (string | number | BN),
		newBalanceOfAuditor: (string | number | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::openVoteForPrice", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [newPrice, newBalanceOfAuditor], __options);
	}

	/**
	* getTotalChannel
	*
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getTotalChannel" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTotalChannel", [], __options, (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getChannel
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<[ReturnTypes.AccountId, ReturnNumber, number, ReturnTypes.AccountId] | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getChannel" (
		channelId: (string | number | BN),
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<[ReturnTypes.AccountId, ReturnNumber, number, ReturnTypes.AccountId] | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getChannel", [channelId], __options, (result) => { return handleReturnType(result, getTypeDescription(19, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getVotesPrice
	*
	* @returns { Result<Result<[ReturnNumber, ReturnNumber, ReturnNumber, ReturnNumber, number], ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getVotesPrice" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<[ReturnNumber, ReturnNumber, ReturnNumber, ReturnNumber, number], ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getVotesPrice", [], __options, (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getTimeBlockBalancePost
	*
	* @returns { Result<number, ReturnTypes.LangError> }
	*/
	"getTimeBlockBalancePost" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<number, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTimeBlockBalancePost", [], __options, (result) => { return handleReturnType(result, getTypeDescription(18, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* checkChannelFake
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<string, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"checkChannelFake" (
		channelId: (string | number | BN),
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<string, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::checkChannelFake", [channelId], __options, (result) => { return handleReturnType(result, getTypeDescription(26, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* transferBalanceChannel
	*
	* @param { ArgumentTypes.AccountId } addressToken,
	* @param { (number | string | BN) } typeTransfer,
	* @param { (string | number | BN) } channelId,
	* @param { (string | number | BN) } amount,
	* @returns { void }
	*/
	"transferBalanceChannel" (
		addressToken: ArgumentTypes.AccountId,
		typeTransfer: (number | string | BN),
		channelId: (string | number | BN),
		amount: (string | number | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::transferBalanceChannel", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [addressToken, typeTransfer, channelId, amount], __options);
	}

	/**
	* addMessagesPublic
	*
	* @param { Array<string> | null } defaultMessage,
	* @param { string } typeDefaultMessageChannel,
	* @returns { void }
	*/
	"addMessagesPublic" (
		defaultMessage: Array<string> | null,
		typeDefaultMessageChannel: string,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::addMessagesPublic", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [defaultMessage, typeDefaultMessageChannel], __options);
	}

	/**
	* setTimeVoteFake
	*
	* @param { (number | string | BN) } timeVoteFake,
	* @returns { void }
	*/
	"setTimeVoteFake" (
		timeVoteFake: (number | string | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::setTimeVoteFake", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [timeVoteFake], __options);
	}

	/**
	* getPricePerChannel
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getPricePerChannel" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getPricePerChannel", [], __options, (result) => { return handleReturnType(result, getTypeDescription(11, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getFeeReceiverWallet
	*
	* @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
	*/
	"getFeeReceiverWallet" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getFeeReceiverWallet", [], __options, (result) => { return handleReturnType(result, getTypeDescription(32, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* rewardSafeForFakeNews
	*
	* @param { (string | number | BN) } channelId,
	* @returns { void }
	*/
	"rewardSafeForFakeNews" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::rewardSafeForFakeNews", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [channelId], __options);
	}

	/**
	* sync
	*
	* @returns { void }
	*/
	"sync" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::sync", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* getTotalFakeOpen
	*
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getTotalFakeOpen" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTotalFakeOpen", [], __options, (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getFeeReceiverBalance
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getFeeReceiverBalance" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getFeeReceiverBalance", [], __options, (result) => { return handleReturnType(result, getTypeDescription(11, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getVotesFakesNews
	*
	* @param { (string | number | BN) } channelId,
	* @returns { Result<Result<[ReturnNumber, ReturnNumber, number, string], ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getVotesFakesNews" (
		channelId: (string | number | BN),
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<[ReturnNumber, ReturnNumber, number, string], ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getVotesFakesNews", [channelId], __options, (result) => { return handleReturnType(result, getTypeDescription(33, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* doingVoteFake
	*
	* @param { (string | number | BN) } channelId,
	* @param { boolean } isFake,
	* @returns { void }
	*/
	"doingVoteFake" (
		channelId: (string | number | BN),
		isFake: boolean,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::doingVoteFake", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [channelId, isFake], __options);
	}

	/**
	* recoverySafeBalancePublic
	*
	* @param { (string | number | BN) } channelId,
	* @returns { void }
	*/
	"recoverySafeBalancePublic" (
		channelId: (string | number | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::recoverySafeBalancePublic", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [channelId], __options);
	}

	/**
	* setTimeVotePrice
	*
	* @param { (number | string | BN) } timeVotePrice,
	* @returns { void }
	*/
	"setTimeVotePrice" (
		timeVotePrice: (number | string | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::setTimeVotePrice", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [timeVotePrice], __options);
	}

	/**
	* getTotalVotesAllowed
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"getTotalVotesAllowed" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTotalVotesAllowed", [], __options, (result) => { return handleReturnType(result, getTypeDescription(11, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* setTimeBlockBalancePost
	*
	* @param { (number | string | BN) } timeBlockBalancePost,
	* @returns { void }
	*/
	"setTimeBlockBalancePost" (
		timeBlockBalancePost: (number | string | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::setTimeBlockBalancePost", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [timeBlockBalancePost], __options);
	}

	/**
	* getFeeReceiverWithdrawal
	*
	* @returns { void }
	*/
	"getFeeReceiverWithdrawal" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::getFeeReceiverWithdrawal", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* getTimeVotePrice
	*
	* @returns { Result<number, ReturnTypes.LangError> }
	*/
	"getTimeVotePrice" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<number, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getTimeVotePrice", [], __options, (result) => { return handleReturnType(result, getTypeDescription(18, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* openVoteForFakeNews
	*
	* @param { (string | number | BN) } channelId,
	* @param { string } reason,
	* @returns { void }
	*/
	"openVoteForFakeNews" (
		channelId: (string | number | BN),
		reason: string,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::openVoteForFakeNews", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [channelId, reason], __options);
	}

	/**
	* getIdChannel
	*
	* @param { ArgumentTypes.AccountId } addressContract,
	* @returns { Result<ReturnNumber | null, ReturnTypes.LangError> }
	*/
	"getIdChannel" (
		addressContract: ArgumentTypes.AccountId,
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "governanceImp::getIdChannel", [addressContract], __options, (result) => { return handleReturnType(result, getTypeDescription(36, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getPrices
	*
	* @returns { void }
	*/
	"getPrices" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "governanceImp::getPrices", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* transferOwnership
	*
	* @param { ArgumentTypes.AccountId } newOwner,
	* @returns { void }
	*/
	"transferOwnership" (
		newOwner: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::transferOwnership", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [newOwner], __options);
	}

	/**
	* owner
	*
	* @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
	*/
	"owner" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "ownable::owner", [], __options, (result) => { return handleReturnType(result, getTypeDescription(32, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* renounceOwnership
	*
	* @returns { void }
	*/
	"renounceOwnership" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "ownable::renounceOwnership", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

}