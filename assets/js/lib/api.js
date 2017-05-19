/**
 * The external dependencies.
 */
import { head, isUndefined } from 'lodash';
import $ from 'jquery';

/**
 * The internal dependencies.
 */
import { TYPE_COMPLEX, VALUE_PROPERTY } from 'fields/constants';
import { getFieldById, getFieldByName } from 'fields/selectors';
import {
	setFieldValue as setFieldValueAction,
	addComplexGroup,
	removeComplexGroup
} from 'fields/actions';

class Api {

	constructor(store) {
		this.store = store;
		$(document).trigger('carbonFields.apiLoaded');
	}

	getFieldValue(fieldName) {
		let field = getFieldByName(this.store.getState(), fieldName);
		if (field === null) {
			return;
		}

		if (field.type === TYPE_COMPLEX) {
			let value = [];
			for (let i = field.value.length - 1; i >= 0; i--) {
				let group = field.value[i];
				let fieldValue = {[VALUE_PROPERTY]: group.name};

				for (let j = group.fields.length - 1; j >= 0; j--) {
					let groupField = group.fields[j];
					fieldValue[groupField.base_name] = this.getFieldValue(fieldName + '[' + i + ']/' + groupField.base_name);
				}

				value.push(fieldValue);
			}
			return value;
		}
		return field.value;
	}

	setFieldValue(fieldName, value) {
		let field = getFieldByName(this.store.getState(), fieldName);
		if (field === null) {
			return;
		}
		
		this.store.dispatch(setFieldValueAction(field.id, value));
	}

	addComplexFieldGroup(fieldName, groupName) {
		let field = getFieldByName(this.store.getState(), fieldName);
		if (field === null) {
			return;
		}

		let group = head(field.value.filter(group => group.name === groupName));
		if (isUndefined(group)) {
			console.warn(`The specified group does not exist: ${groupName}`);
			return;
		}
		
		this.store.dispatch(addComplexGroup(field.id, groupName));
	}

	removeComplexFieldGroup(fieldName, groupIndex) {
		let field = getFieldByName(this.store.getState(), fieldName);
		if (field === null) {
			return;
		}

		if (isUndefined(field.value[groupIndex])) {
			console.warn(`The specified complex field does not have an entry with index of ${groupIndex}.`);
			return;
		}
		
		this.store.dispatch(removeComplexGroup(field.id, field.value[groupIndex].id));
	}
}

export default Api;