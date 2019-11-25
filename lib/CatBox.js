const {
	Validators: {
		FilesValidator,
		AlbumValidator
	}
} = require('../components');

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
	 * Upload files
	 * @param {String} urlOrPath - A url or path to the file to upload
	 * @returns {Promise<String>} The uploaded file url
	 */
	async upload(urlOrPath) {
		if (typeof urlOrPath !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof urlOrPath}`);
		}

		try {
			const { createReadStream } = require('fs');
			const { parse } = require('url');
			const { slashes: isURL, href, path } = parse(urlOrPath);

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
	 * @returns {Promise<Array>} All files deleted
	 */
	async delete(...files) {
		this._hasUserHash('delete');

		try {
			files = FilesValidator(files);
			const response = await this._post({
				reqtype: 'deletefiles',
				userhash: this.userHash,
				files: files.join(' ')
			});

			if (response.statusCode === 200) {
				return files.map((file) => `https://files.catbox.moe/${file}`);
			} else {
				throw new Error('Unable to delete one or more requested files');
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Get album information
	 * @param {String} short - Short code or url album to retrieve information
	 * @returns {Promise<Object>} Requested Album Info
	 */
	async getAlbum(short) {
		try {
			const response = await this._post({
				reqtype: 'getalbum',
				short: AlbumValidator(short)
			});

			const body = await this._get(response);

			return JSON.parse(body).data;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Create a new album for your account or anonymously
	 * @param {Object} options - Settings for album creation
	 * @returns {Promise<String>} The URL of the created album
	 */
	async createAlbum(options = {}) {
		try {
			if (options.title) {
				let files = options.files ? FilesValidator(options.files) : null;
				const response = await this._post({
					reqtype: 'createalbum',
					userhash: this.userHash,
					title: options.title,
					desc: options.description || '',
					files: files ? files.join(' ') : ''
				});

				return this._get(response);
			} else {
				throw new Error('Title property is undefined');
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Edit album info
	 * @param {Object} options - Settings that will change in the album
	 * @returns {Promise<String>} The URL of the edited album
	 */
	async editAlbum(options = {}) {
		this._hasUserHash('editAlbum');

		try {
			if (options.short) {
				const album = await this.getAlbum(AlbumValidator(options.short));
				const response = await this._post({
					reqtype: 'editalbum',
					userhash: this.userHash,
					short: album.short,
					title: options.title || album.title,
					desc: options.description || album.description,
					files: FilesValidator(album.files.split(' '), options.files).join(' ')
				});

				return this._get(response);
			} else {
				throw new Error('Malformed request');
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Add files to an album
	 * @param {Object} options - Settings to define which album and which files to upload
	 * @returns {Promise<String>} The URL of the album that was added to the files
	 */
	async addFilesAlbum(options = {}) {
		this._hasUserHash('addFilesAlbum');

		try {
			if (options.short && options.files) {
				const response = await this._post({
					reqtype: 'addtoalbum',
					userhash: this.userHash,
					short: AlbumValidator(options.short),
					files: FilesValidator(options.files).join(' ')
				});

				return this._get(response);
			} else {
				throw new Error('Malformed request');
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Remove one or more files from an album
	 * @param {Object} options - Settings to define which album and which files are removed
	 * @returns {Promise<String>} The URL of the album from which the files were removed
	 */
	async removeFilesAlbum(options = {}) {
		this._hasUserHash('removeFilesAlbum');

		try {
			if (options.short && options.files) {
				const response = await this._post({
					reqtype: 'removefromalbum',
					userhash: this.userHash,
					short: AlbumValidator(options.short),
					files: FilesValidator(options.files).join(' ')
				});

				return this._get(response);
			} else {
				throw new Error('Malformed request');
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Delete album
	 * @param {String} short - Short code of album to be deleted
	 * @returns {Promise<String>} Success response
	 */
	async deleteAlbum(short) {
		this._hasUserHash('deleteAlbum');

		if (typeof short !== 'string') {
			throw new TypeError(`Expected a string, got ${typeof short}`);
		}

		try {
			short = AlbumValidator(short);
			const response = await this._post({
				reqtype: 'deletealbum',
				userhash: this.userHash,
				short
			});

			if (response.statusCode === 200) {
				return `Album ${short} successfully deleted`;
			} else {
				throw new Error('Unable to delete album requested');
			}
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

		return promisify(formData.submit).bind(formData)(this.baseURL);
	}
};