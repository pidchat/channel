/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryOkJSON, queryJSON, handleReturnType } from '@727-ventures/typechain-types';
import { txSignAndSend } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/channel';
import type * as ReturnTypes from '../types-returns/channel';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
// @ts-ignore
import type {EventRecord} from "@polkadot/api/submittable";
import {decodeEvents} from "../shared/utils";
import DATA_TYPE_DESCRIPTIONS from '../data/channel.json';
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/channel.json';


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
	* destroy
	*
	* @returns { void }
	*/
	"destroy" (
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "destroy", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [], __options);
	}

	/**
	* transferBalance
	*
	* @param { ArgumentTypes.AccountId } addressToken,
	* @param { ArgumentTypes.AccountId } to,
	* @param { (number | string | BN) } typeTransfer,
	* @param { (string | number | BN) } amount,
	* @returns { void }
	*/
	"transferBalance" (
		addressToken: ArgumentTypes.AccountId,
		to: ArgumentTypes.AccountId,
		typeTransfer: (number | string | BN),
		amount: (string | number | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "transferBalance", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [addressToken, to, typeTransfer, amount], __options);
	}

	/**
	* receivedMessages
	*
	* @param { (string | number | BN) } idMessage,
	* @returns { Result<Result<[ReturnTypes.AccountId, string, number, number] | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"receivedMessages" (
		idMessage: (string | number | BN),
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<[ReturnTypes.AccountId, string, number, number] | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::receivedMessages", [idMessage], __options, (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* addPermission
	*
	* @param { ArgumentTypes.AccountId } address,
	* @param { boolean } typePermission,
	* @returns { void }
	*/
	"addPermission" (
		address: ArgumentTypes.AccountId,
		typePermission: boolean,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "channelImpl::addPermission", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [address, typePermission], __options);
	}

	/**
	* addEmotion
	*
	* @param { string } emotion,
	* @returns { void }
	*/
	"addEmotion" (
		emotion: string,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "channelImpl::addEmotion", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [emotion], __options);
	}

	/**
	* getTypeMessage
	*
	* @returns { Result<string, ReturnTypes.LangError> }
	*/
	"getTypeMessage" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<string, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getTypeMessage", [], __options, (result) => { return handleReturnType(result, getTypeDescription(20, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getTotalMessages
	*
	* @returns { Result<ReturnNumber | null, ReturnTypes.LangError> }
	*/
	"getTotalMessages" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getTotalMessages", [], __options, (result) => { return handleReturnType(result, getTypeDescription(21, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getAddressGovernance
	*
	* @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
	*/
	"getAddressGovernance" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getAddressGovernance", [], __options, (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getDefaultMessage
	*
	* @returns { Result<Result<Array<string> | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getDefaultMessage" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<Array<string> | null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getDefaultMessage", [], __options, (result) => { return handleReturnType(result, getTypeDescription(24, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* setAddressGovernance
	*
	* @param { ArgumentTypes.AccountId } addressGovernance,
	* @returns { void }
	*/
	"setAddressGovernance" (
		addressGovernance: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "channelImpl::setAddressGovernance", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [addressGovernance], __options);
	}

	/**
	* getEmotions
	*
	* @returns { Result<Result<Array<[string, ReturnNumber]>, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getEmotions" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<Array<[string, ReturnNumber]>, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getEmotions", [], __options, (result) => { return handleReturnType(result, getTypeDescription(26, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getIsPrivate
	*
	* @returns { Result<boolean, ReturnTypes.LangError> }
	*/
	"getIsPrivate" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<boolean, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getIsPrivate", [], __options, (result) => { return handleReturnType(result, getTypeDescription(30, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* getIdChannelPublic
	*
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getIdChannelPublic" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getIdChannelPublic", [], __options, (result) => { return handleReturnType(result, getTypeDescription(31, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* sendMessages
	*
	* @param { string } message,
	* @returns { void }
	*/
	"sendMessages" (
		message: string,
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "channelImpl::sendMessages", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [message], __options);
	}

	/**
	* editMessages
	*
	* @param { string } message,
	* @param { (string | number | BN) } idMessagee,
	* @returns { void }
	*/
	"editMessages" (
		message: string,
		idMessagee: (string | number | BN),
		__options: GasLimit,
	){
		return txSignAndSend( this.__apiPromise, this.__nativeContract, this.__keyringPair, "channelImpl::editMessages", (events: EventRecord) => {
			return decodeEvents(events, this.__nativeContract, EVENT_DATA_TYPE_DESCRIPTIONS);
		}, [message, idMessagee], __options);
	}

	/**
	* getBalanceToken
	*
	* @param { ArgumentTypes.AccountId } addressToken,
	* @returns { Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"getBalanceToken" (
		addressToken: ArgumentTypes.AccountId,
		__options: GasLimit,
	): Promise< QueryReturnType< Result<Result<ReturnNumber, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "channelImpl::getBalanceToken", [addressToken], __options, (result) => { return handleReturnType(result, getTypeDescription(31, DATA_TYPE_DESCRIPTIONS)); });
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

	/**
	* owner
	*
	* @returns { Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> }
	*/
	"owner" (
		__options: GasLimit,
	): Promise< QueryReturnType< Result<ReturnTypes.AccountId | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "ownable::owner", [], __options, (result) => { return handleReturnType(result, getTypeDescription(23, DATA_TYPE_DESCRIPTIONS)); });
	}

}