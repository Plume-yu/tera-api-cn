"use strict";

/**
 * @typedef {import("../datasheet.model").data} data
 */

/**
 * @param {data} data
 */
module.exports = data => {
	const result = new Map();

	data.forEach(element =>
		result.set(Number(element.attributes.id), element.attributes.string)
	);

	return result;
};