module.exports = class CatBox {
	/**
	 * 
	 * @param {String} userHash - The hash of the user to use to perform operations on your account
	 * @param {String} [baseURL] - Base URL for the API
	 */
	constructor(userHash = null, baseURL = 'https://catbox.moe/user/api.php') {
		this.userHash = userHash;
		this.baseURL = baseURL;
	}

	/**
	 * Upload a file via url or path to it
	 * @param {String} urlOrPath - A url or path to the file
	 * @returns {Promise<String>} The uploaded file url
	 */
	async upload(urlOrPath) {
		if (typeof urlOrPath !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof urlOrPath}`);
		}

		try {
			const { createReadStream } = require('fs');
			const url = require('url');
			const { slashes: isURL, href, path } = url.parse(urlOrPath);

			const response = await this._post(
				isURL
				? {
					reqtype: 'urlupload',
					userhash: this.userHash,
					url: href
				}
				: {
					reqtype: 'fileupload',
					userhash: this.userHash,
					fileToUpload: createReadStream(path)
				}
			);

			return this._get(response);
		} catch (error) {
			throw error;
		}
	}

	_get(data) {
		return new Promise((resolve) => {
			data.on('data', (data) => {
				resolve(data.toString());
			});
		});
	}

	async _post(data) {
		const { promisify } = require('util');
		const formData = new (require('form-data'))();

		for (let key in data) {
			const value = data[key];

			if (value != null) {
				formData.append(key, value);
			}
		}

		const submit = promisify(formData.submit).bind(formData);
		return submit(this.baseURL);
	}
};