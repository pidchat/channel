/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { GasLimit, GasLimitAndRequiredValue } from '@727-ventures/typechain-types';
import { buildSubmittableExtrinsic } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/channel';
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
	 * destroy
	 *
	*/
	"destroy" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "destroy", [], __options);
	}

	/**
	 * transferBalance
	 *
	 * @param { ArgumentTypes.AccountId | null } addressToken,
	 * @param { ArgumentTypes.AccountId } to,
	 * @param { (number | string | BN) } typeTransfer,
	*/
	"transferBalance" (
		addressToken: ArgumentTypes.AccountId | null,
		to: ArgumentTypes.AccountId,
		typeTransfer: (number | string | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "transferBalance", [addressToken, to, typeTransfer], __options);
	}

	/**
	 * editMessages
	 *
	 * @param { string } message,
	 * @param { (string | number | BN) } idMessagee,
	*/
	"editMessages" (
		message: string,
		idMessagee: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::editMessages", [message, idMessagee], __options);
	}

	/**
	 * addPermission
	 *
	 * @param { ArgumentTypes.AccountId } address,
	 * @param { boolean } typePermission,
	*/
	"addPermission" (
		address: ArgumentTypes.AccountId,
		typePermission: boolean,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::addPermission", [address, typePermission], __options);
	}

	/**
	 * getDefaultMessage
	 *
	*/
	"getDefaultMessage" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::getDefaultMessage", [], __options);
	}

	/**
	 * addEmotion
	 *
	 * @param { string } emotion,
	*/
	"addEmotion" (
		emotion: string,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::addEmotion", [emotion], __options);
	}

	/**
	 * getTotalMessages
	 *
	*/
	"getTotalMessages" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::getTotalMessages", [], __options);
	}

	/**
	 * getEmotions
	 *
	*/
	"getEmotions" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::getEmotions", [], __options);
	}

	/**
	 * getIsPrivate
	 *
	*/
	"getIsPrivate" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::getIsPrivate", [], __options);
	}

	/**
	 * getBalanceToken
	 *
	 * @param { ArgumentTypes.AccountId } addressToken,
	*/
	"getBalanceToken" (
		addressToken: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::getBalanceToken", [addressToken], __options);
	}

	/**
	 * setAddressGovernance
	 *
	 * @param { ArgumentTypes.AccountId } addressGovernance,
	*/
	"setAddressGovernance" (
		addressGovernance: ArgumentTypes.AccountId,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::setAddressGovernance", [addressGovernance], __options);
	}

	/**
	 * getAddressGovernance
	 *
	*/
	"getAddressGovernance" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::getAddressGovernance", [], __options);
	}

	/**
	 * sendMessages
	 *
	 * @param { string } message,
	*/
	"sendMessages" (
		message: string,
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::sendMessages", [message], __options);
	}

	/**
	 * getIdChannelPublic
	 *
	*/
	"getIdChannelPublic" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::getIdChannelPublic", [], __options);
	}

	/**
	 * receivedMessages
	 *
	 * @param { (string | number | BN) } idMessage,
	*/
	"receivedMessages" (
		idMessage: (string | number | BN),
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "channelImpl::receivedMessages", [idMessage], __options);
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
	 * renounceOwnership
	 *
	*/
	"renounceOwnership" (
		__options: GasLimit,
	){
		return buildSubmittableExtrinsic( this.__apiPromise, this.__nativeContract, "ownable::renounceOwnership", [], __options);
	}

}