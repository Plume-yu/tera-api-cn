"use strict";

/**
 * @typedef {import("../app").modules} modules
 * @typedef {import("express").RequestHandler} RequestHandler
 */

const expressLayouts = require("express-ejs-layouts");
const body = require("express-validator").body;
const helpers = require("../utils/helpers");

const { accessFunctionHandler, writeOperationReport } = require("../middlewares/admin.middlewares");

/**
 * @param {modules} modules
 */
module.exports.index = ({ logger, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		serverModel.strings.findAll().then(strings => {
			res.render("adminServerStrings", {
				layout: "adminLayout",
				strings
			});
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.add = () => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.render("adminServerStringsAdd", {
			layout: "adminLayout",
			errors: null,
			language: "",
			categoryPvE: "",
			categoryPvP: "",
			serverOffline: "",
			serverLow: "",
			serverMedium: "",
			serverHigh: "",
			crowdNo: "",
			crowdYes: "",
			popup: ""
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.addAction = ({ i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("language").trim().toLowerCase()
			.isAlpha().withMessage(i18n.__("Language field must be a valid value."))
			.isLength({ min: 2, max: 3 }).withMessage(i18n.__("Language field must be between 2 and 3 characters.")),
		body("categoryPvE").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Category PvE field must be between 1 and 50 characters.")),
		body("categoryPvP").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Category PvP field must be between 1 and 50 characters.")),
		body("serverOffline").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server offline field must be between 1 and 50 characters.")),
		body("serverLow").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server low field must be between 1 and 50 characters.")),
		body("serverMedium").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server medium field must be between 1 and 50 characters.")),
		body("serverHigh").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server high field must be between 1 and 50 characters.")),
		body("crowdNo").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Crowdness no field must be between 1 and 50 characters.")),
		body("crowdYes").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Crowdness yes field must be between 1 and 50 characters.")),
		body("popup").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Popup field must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { language, categoryPvE, categoryPvP, serverOffline,
			serverLow, serverMedium, serverHigh, crowdNo, crowdYes, popup } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!errors.isEmpty()) {
			return res.render("adminServerStringsAdd", {
				layout: "adminLayout",
				errors: errors.array(),
				language,
				categoryPvE,
				categoryPvP,
				serverOffline,
				serverLow,
				serverMedium,
				serverHigh,
				crowdNo,
				crowdYes,
				popup
			});
		}

		serverModel.strings.create({
			language,
			categoryPvE,
			categoryPvP,
			serverOffline,
			serverLow,
			serverMedium,
			serverHigh,
			crowdNo,
			crowdYes,
			popup
		}).then(() =>
			next()
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/server_strings");
	}
];

/**
 * @param {modules} modules
 */
module.exports.edit = ({ logger, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		const { language } = req.query;

		serverModel.strings.findOne({ where: { language } }).then(data => {
			if (data === null) {
				return res.redirect("/server_strings");
			}

			res.render("adminServerStringsEdit", {
				layout: "adminLayout",
				errors: null,
				language: data.get("language"),
				categoryPvE: data.get("categoryPvE"),
				categoryPvP: data.get("categoryPvP"),
				serverOffline: data.get("serverOffline"),
				serverLow: data.get("serverLow"),
				serverMedium: data.get("serverMedium"),
				serverHigh: data.get("serverHigh"),
				crowdNo: data.get("crowdNo"),
				crowdYes: data.get("crowdYes"),
				popup: data.get("popup")
			});
		}).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	}
];

/**
 * @param {modules} modules
 */
module.exports.editAction = ({ i18n, logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	[
		body("categoryPvE").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Category PvE field must be between 1 and 50 characters.")),
		body("categoryPvP").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Category PvP field must be between 1 and 50 characters.")),
		body("serverOffline").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server offline field must be between 1 and 50 characters.")),
		body("serverLow").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server low field must be between 1 and 50 characters.")),
		body("serverMedium").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server medium field must be between 1 and 50 characters.")),
		body("serverHigh").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Server high field must be between 1 and 50 characters.")),
		body("crowdNo").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Crowdness no field must be between 1 and 50 characters.")),
		body("crowdYes").trim()
			.isLength({ min: 1, max: 50 }).withMessage(i18n.__("Crowdness yes field must be between 1 and 50 characters.")),
		body("popup").trim()
			.isLength({ min: 1, max: 2048 }).withMessage(i18n.__("Popup field must be between 1 and 2048 characters."))
	],
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { language } = req.query;
		const { categoryPvE, categoryPvP, serverOffline,
			serverLow, serverMedium, serverHigh, crowdNo, crowdYes, popup } = req.body;
		const errors = helpers.validationResultLog(req, logger);

		if (!language) {
			return res.redirect("/server_strings");
		}

		if (!errors.isEmpty()) {
			return res.render("adminServerStringsEdit", {
				layout: "adminLayout",
				errors: errors.array(),
				language,
				categoryPvE,
				categoryPvP,
				serverOffline,
				serverLow,
				serverMedium,
				serverHigh,
				crowdNo,
				crowdYes,
				popup
			});
		}

		serverModel.strings.update({
			categoryPvE,
			categoryPvP,
			serverOffline,
			serverLow,
			serverMedium,
			serverHigh,
			crowdNo,
			crowdYes,
			popup
		}, {
			where: { language }
		}).then(() =>
			next()
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/server_strings");
	}
];

/**
 * @param {modules} modules
 */
module.exports.deleteAction = ({ logger, reportModel, serverModel }) => [
	accessFunctionHandler,
	expressLayouts,
	/**
	 * @type {RequestHandler}
	 */
	(req, res, next) => {
		const { language } = req.query;

		if (!language) {
			return res.redirect("/server_strings");
		}

		serverModel.strings.destroy({ where: { language } }).then(() =>
			next()
		).catch(err => {
			logger.error(err);
			res.render("adminError", { layout: "adminLayout", err });
		});
	},
	writeOperationReport(reportModel),
	/**
	 * @type {RequestHandler}
	 */
	(req, res) => {
		res.redirect("/server_strings");
	}
];