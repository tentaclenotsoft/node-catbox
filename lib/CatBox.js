const { createReadStream } = require('fs')
const { promisify } = require('util')
const { parse } = require('url')
const FormData = require('form-data')

const Utils = require('../utils')

module.exports = class CatBox {
	/**
	 * 
	 * @param {String} userHash - The hash of the user to use to perform operations on your account
	 * @param {String} [baseURL] - Base URL for the API
	 */
	constructor(userHash = null, baseURL = 'https://catbox.moe/user/api.php') {
		this.userHash = userHash
		this.baseURL = baseURL
	}

	/**
	 * Upload files
	 * @param {String} urlOrPath - A url or path to the file to upload
	 * @returns {Promise<String>} The uploaded file url
	 */
	async upload(urlOrPath) {
		if (typeof urlOrPath !== 'string') throw new TypeError(`Expected a string, got ${typeof urlOrPath}`)

		try {
			const { slashes: isURL, href, path } = parse(urlOrPath)
			const response = await this._fetch(
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
			)

			return this._get(response)
		} catch (error) {
			throw error
		}
	}

	/**
	 * Delete one or more files
	 * @param {Array<String>} files - Files to be deleted
	 * @returns {Promise<Array>} All files deleted
	 */
	async delete(...files) {
		this._hasUserHash('delete')

		try {
			files = Utils.resolveFiles(files)
			const response = await this._fetch({
				reqtype: 'deletefiles',
				userhash: this.userHash,
				files: files.join(' ')
			})

			if (response.statusCode === 200) {
				return files
			} else {
				throw new Error('Unable to delete one or more requested files')
			}
		} catch (error) {
			throw error
		}
	}

	/**
	 * Get album information
	 * @param {String} short - Short code or url album to retrieve information
	 * @returns {Promise<Object>} Requested Album Info
	 */
	async getAlbum(short) {
		try {
			const response = await this._fetch({
				reqtype: 'getalbum',
				short: Utils.resolveAlbum(short)
			})
			const body = await this._get(response)

			return JSON.parse(body).data
		} catch (error) {
			throw error
		}
	}

	/**
	 * Create a new album for your account or anonymously
	 * @param {Object} [options] - Settings for album creation
	 * @param {String} [options.title] - Name for the album
	 * @param {String} [options.description] - Description for the album
	 * @param {Array<String>} [options.files] - Name or url of files to add to your album if you wish to add
	 * @returns {Promise<String>} The URL of the created album
	 */
	async createAlbum({
		title = '',
		description = '',
		files = []
	} = {}) {
		try {
			const response = await this._fetch({
				reqtype: 'createalbum',
				userhash: this.userHash,
				title,
				desc: description,
				files: files.length ? Utils.resolveFiles(files).join(' ') : ''
			})

			return this._get(response)
		} catch (error) {
			throw error
		}
	}

	/**
	 * Edit album info
	 * @param {Object} [options] - Settings that will change in the album
	 * @param {String} [options.short] - Short code or url of album to be edited
	 * @param {String} [options.title] - New album title
	 * @param {String} [options.description] - New album description
	 * @param {Array<String>} [options.files] - Name or url of files to add to your album
	 * @returns {Promise<String>} The URL of the edited album
	 */
	async editAlbum({
		short = '',
		title = '',
		description = '',
		files = []
	} = {}) {
		this._hasUserHash('editAlbum')

		try {
			if (short) {
				const album = await this.getAlbum(Utils.resolveAlbum(short))
				const response = await this._fetch({
					reqtype: 'editalbum',
					userhash: this.userHash,
					short: album.short,
					title: title ? title : album.title,
					desc: description ? description : album.description,
					files: Utils.resolveFiles(album.files.split(' '), files).join(' ')
				})

				return this._get(response)
			} else {
				throw new Error('Malformed request')
			}
		} catch (error) {
			throw error
		}
	}

	/**
	 * Add files to an album
	 * @param {Object} [options] - Settings to define which album and which files to upload
	 * @param {String} [options.short] - Album short code or url where files will be added
	 * @param {Array<String>} [options.files] - Name or url of the files to add to the album
	 * @returns {Promise<String>} The URL of the album that was added to the files
	 */
	async addFilesAlbum({
		short = '',
		files = []
	} = {}) {
		this._hasUserHash('addFilesAlbum')

		try {
			if (short && files.length) {
				const response = await this._fetch({
					reqtype: 'addtoalbum',
					userhash: this.userHash,
					short: Utils.resolveAlbum(short),
					files: Utils.resolveFiles(files).join(' ')
				})

				return this._get(response)
			} else {
				throw new Error('Malformed request')
			}
		} catch (error) {
			throw error
		}
	}

	/**
	 * Remove one or more files from an album
	 * @param {Object} [options] - Settings to define which album and which files are removed
	 * @param {String} [options.short] - Album code or url from where files will be removed
	 * @param {Array<String>} [options.files] - Name or url of the files to be removed from the album
	 * @returns {Promise<String>} The URL of the album from which the files were removed
	 */
	async removeFilesAlbum({
		short = '',
		files = []
	} = {}) {
		this._hasUserHash('removeFilesAlbum')

		try {
			if (short && files.length) {
				const response = await this._fetch({
					reqtype: 'removefromalbum',
					userhash: this.userHash,
					short: Utils.resolveAlbum(short),
					files: Utils.resolveFiles(files).join(' ')
				})

				return this._get(response)
			} else {
				throw new Error('Malformed request')
			}
		} catch (error) {
			throw error
		}
	}

	/**
	 * Delete album
	 * @param {String} short - Short code or url of album to be deleted
	 * @returns {Promise<String>} Success response
	 */
	async deleteAlbum(short) {
		this._hasUserHash('deleteAlbum')
		if (typeof short !== 'string') throw new TypeError(`Expected a string, got ${typeof short}`)

		try {
			short = Utils.resolveAlbum(short)
			const response = await this._fetch({
				reqtype: 'deletealbum',
				userhash: this.userHash,
				short
			})

			if (response.statusCode === 200) {
				return `Album ${short} successfully deleted`
			} else {
				throw new Error('Unable to delete album requested')
			}
		} catch (error) {
			throw error
		}
	}

	_hasUserHash(method) {
		if (!this.userHash) throw new Error(`You must add a user hash in constructor to use the "${method}" method`)
	}

	_get(data) {
		return new Promise((resolve) =>	data.on('data', (data) => resolve(data.toString())))
	}

	async _fetch(data) {
		const _FormData = new FormData()
		Object.entries(data).filter(([key, value]) => value !== null).map(([key, value]) => _FormData.append(key, value))

		return promisify(_FormData.submit).bind(_FormData)(this.baseURL)
	}
}