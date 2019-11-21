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

	/**
	 * Delete one or more files
	 * @param {Array<String>} files - Files to be deleted
	 * @param {Promise<Array>} All files deleted
	 */
	async delete(...files) {
		this._hasUserHash('delete');
		const validFiles = Array.prototype.concat.apply([], files).filter((file) => !file.includes(' '));

		try {
			const response = await this._post({
				reqtype: 'deletefiles',
				userhash: this.userHash,
				files: validFiles.join(' ')
			});

			if (response.statusCode === 200) {
				return validFiles;
			} else {
				throw new Error('Unable to delete one or more requested files');
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Create a new album for your account or anonymously
	 * @param {Object} options - Settings for album creation
	 * @param {Promise<String>} The URL of the created album
	 */
	async createAlbum(options = {}) {
		const validFiles = options.files ? options.files.filter((file) => !file.includes(' ')) : null;

		try {
			const response = await this._post({
				reqtype: 'createalbum',
				userhash: this.userHash,
				title: options.title,
				desc: options.description || '',
				files: validFiles ? validFiles.join(' ') : ''
			});

			return this._get(response);
		} catch (error) {
			throw error;
		}
	}

	_hasUserHash(method) {
		if (!this.userHash) {
			throw new Error(`You must add a user hash in constructor to use the "${method}" method`);
		}

		return;
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