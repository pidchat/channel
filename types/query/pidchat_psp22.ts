/* This file is auto-generated */

import type { ContractPromise } from '@polkadot/api-contract';
import type { ApiPromise } from '@polkadot/api';
import type { GasLimit, GasLimitAndRequiredValue, Result } from '@727-ventures/typechain-types';
import type { QueryReturnType } from '@727-ventures/typechain-types';
import { queryJSON, queryOkJSON, handleReturnType } from '@727-ventures/typechain-types';
import type * as ArgumentTypes from '../types-arguments/pidchat_psp22';
import type * as ReturnTypes from '../types-returns/pidchat_psp22';
import type BN from 'bn.js';
//@ts-ignore
import {ReturnNumber} from '@727-ventures/typechain-types';
import {getTypeDescription} from './../shared/utils';
import DATA_TYPE_DESCRIPTIONS from '../data/pidchat_psp22.json';


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
	* emitTransferEvent
	*
	* @param { ArgumentTypes.AccountId | null } from,
	* @param { ArgumentTypes.AccountId | null } to,
	* @param { (string | number | BN) } amount,
	* @returns { Result<null, ReturnTypes.LangError> }
	*/
	"emitTransferEvent" (
		from: ArgumentTypes.AccountId | null,
		to: ArgumentTypes.AccountId | null,
		amount: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "emitTransferEvent", [from, to, amount], __options , (result) => { return handleReturnType(result, getTypeDescription(4, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* emitApprovalEvent
	*
	* @param { ArgumentTypes.AccountId } owner,
	* @param { ArgumentTypes.AccountId } spender,
	* @param { (string | number | BN) } amount,
	* @returns { Result<null, ReturnTypes.LangError> }
	*/
	"emitApprovalEvent" (
		owner: ArgumentTypes.AccountId,
		spender: ArgumentTypes.AccountId,
		amount: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "emitApprovalEvent", [owner, spender, amount], __options , (result) => { return handleReturnType(result, getTypeDescription(4, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* increaseAllowance
	*
	* @param { ArgumentTypes.AccountId } spender,
	* @param { (string | number | BN) } deltaValue,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"increaseAllowance" (
		spender: ArgumentTypes.AccountId,
		deltaValue: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::increaseAllowance", [spender, deltaValue], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* transferFrom
	*
	* @param { ArgumentTypes.AccountId } from,
	* @param { ArgumentTypes.AccountId } to,
	* @param { (string | number | BN) } value,
	* @param { Array<(number | string | BN)> } data,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"transferFrom" (
		from: ArgumentTypes.AccountId,
		to: ArgumentTypes.AccountId,
		value: (string | number | BN),
		data: Array<(number | string | BN)>,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::transferFrom", [from, to, value, data], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* balanceOf
	*
	* @param { ArgumentTypes.AccountId } owner,
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"balanceOf" (
		owner: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::balanceOf", [owner], __options , (result) => { return handleReturnType(result, getTypeDescription(14, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* totalSupply
	*
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"totalSupply" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::totalSupply", [], __options , (result) => { return handleReturnType(result, getTypeDescription(14, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* decreaseAllowance
	*
	* @param { ArgumentTypes.AccountId } spender,
	* @param { (string | number | BN) } deltaValue,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"decreaseAllowance" (
		spender: ArgumentTypes.AccountId,
		deltaValue: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::decreaseAllowance", [spender, deltaValue], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* allowance
	*
	* @param { ArgumentTypes.AccountId } owner,
	* @param { ArgumentTypes.AccountId } spender,
	* @returns { Result<ReturnNumber, ReturnTypes.LangError> }
	*/
	"allowance" (
		owner: ArgumentTypes.AccountId,
		spender: ArgumentTypes.AccountId,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<ReturnNumber, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::allowance", [owner, spender], __options , (result) => { return handleReturnType(result, getTypeDescription(14, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* transfer
	*
	* @param { ArgumentTypes.AccountId } to,
	* @param { (string | number | BN) } value,
	* @param { Array<(number | string | BN)> } data,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"transfer" (
		to: ArgumentTypes.AccountId,
		value: (string | number | BN),
		data: Array<(number | string | BN)>,
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::transfer", [to, value, data], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* approve
	*
	* @param { ArgumentTypes.AccountId } spender,
	* @param { (string | number | BN) } value,
	* @returns { Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> }
	*/
	"approve" (
		spender: ArgumentTypes.AccountId,
		value: (string | number | BN),
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<Result<null, ReturnTypes.PSP22Error>, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22::approve", [spender, value], __options , (result) => { return handleReturnType(result, getTypeDescription(10, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* tokenDecimals
	*
	* @returns { Result<number, ReturnTypes.LangError> }
	*/
	"tokenDecimals" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<number, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22Metadata::tokenDecimals", [], __options , (result) => { return handleReturnType(result, getTypeDescription(15, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* tokenName
	*
	* @returns { Result<string | null, ReturnTypes.LangError> }
	*/
	"tokenName" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<string | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22Metadata::tokenName", [], __options , (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

	/**
	* tokenSymbol
	*
	* @returns { Result<string | null, ReturnTypes.LangError> }
	*/
	"tokenSymbol" (
		__options ? : GasLimit,
	): Promise< QueryReturnType< Result<string | null, ReturnTypes.LangError> > >{
		return queryOkJSON( this.__apiPromise, this.__nativeContract, this.__callerAddress, "psp22Metadata::tokenSymbol", [], __options , (result) => { return handleReturnType(result, getTypeDescription(16, DATA_TYPE_DESCRIPTIONS)); });
	}

}