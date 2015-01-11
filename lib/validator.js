(function() {

	"use strict";

	/*
        TODO: Well, this is kinda simplistic.
    */
    var isPrimitiveType = function(type) {
        return ['string', 'number', 'integer', 'boolean', 'array'].indexOf(type) > -1;
    };


	var Validator = function(schemaManager) {
		this.schemaManager = schemaManager;
	};


	Validator.prototype.validate = function*(obj, entitySchema) {
		var customValidationResults, def, field, fieldName;

		var errors = [];

		if (entitySchema.ctor && !(obj instanceof entitySchema.ctor)) {
			errors.push("value was not constructed with the " + entitySchema.name + " constructor");
		}

		for (fieldName in entitySchema.schema.properties) {
			def = entitySchema.schema.properties[fieldName];
			addValidationError(errors, fieldName, yield* this.validateProperty(obj, obj[fieldName], fieldName, def));
		}

		if (entitySchema.schema.required && entitySchema.schema.required.length) {
			for (var i = 0; i < entitySchema.schema.required.length; i++) {
				field = entitySchema.schema.required[i];
				if (typeof obj[field] === 'undefined') {
					errors.push(field + " is required");
				}
			}
		}

		if (entitySchema.validate) {
			customValidationResults = yield* entitySchema.validate.call(obj);
			if (customValidationResults && customValidationResults.length) {
				return errors.concat(customValidationResults);
			} else {
				return errors;
			}
		} else {
			return errors;
		}
	};


	Validator.prototype.validateProperty = function*(obj, value, fieldName, fieldDef) {
		var errors = [];
		if (value !== undefined && value !== null) {
			if (fieldDef.type === 'array') {
				if (fieldDef.minItems && value.length < fieldDef.minItems) {
					errors.push(fieldName + " must have at least " + fieldDef.minItems + " elements");
				}
				if (fieldDef.maxItems && value.length > fieldDef.maxItems) {
					errors.push(fieldName + " can have at most " + fieldDef.minItems + " elements");
				}
				for (var i = 0; i < value.length; i++) {
					var item = value[i];
					if (!isPrimitiveType(fieldDef.items.type)) {
						if (item.validate) {
							errors = errors.concat(yield* item.validate());
						} else if (fieldDef.items.entitySchema) {
							errors = errors.concat(yield* this.validate(item, fieldDef.items.entitySchema));
						}
					} else {
						errors = errors.concat(yield* this.validateProperty(obj, item, "[" + fieldName + "]", fieldDef.items));
					}
				}
			} else {
				var typeCheck = function(fn) {
					if (!fn()) {
						return errors.push("" + fieldName + ": expected " + fieldDef.type + " but got " + (JSON.stringify(value)));
					}
				};
				switch (fieldDef.type) {
					case 'integer':
						typeCheck(function() {
							return value % 1 === 0;
						});
						break;
					case 'number':
						typeCheck(function() {
							return typeof value === 'number';
						});
						break;
					case 'string':
						typeCheck(function() {
							return typeof value === 'string';
						});
						break;
					case 'boolean':
						typeCheck(function() {
							return typeof value === 'boolean';
						});
						break;
					default:
						if (!isPrimitiveType(fieldDef.type)) {
							if (value.validate) {
								errors = errors.concat(yield* value.validate(this.schemaManager));
							} else if (fieldDef.entitySchema) {
								errors = errors.concat(yield* this.validate(value, fieldDef.entitySchema));
							}
						}
				}
			}
		}
		return errors;
	};


	var addValidationError = function(list, fieldName, error) {
		if (error === true) {
			return list;
		}
		if (error === false) {
			list.push("" + fieldName + " is invalid.");
			return list;
		}
		if (error instanceof Array) {
			if (error.length > 0) {
				for (var i = 0; i < error.length; i++) {
					addValidationError(list, fieldName, error[i]);
				}
			}
			return list;
		}
		if (error) {
			list.push(error);
			return list;
		}
	};


	module.exports = Validator;

})();
