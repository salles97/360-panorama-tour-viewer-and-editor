// import axiosInstance from 'node_modules/axiosInstance';
import axiosInstance from './axiosConfig';
import jwt_decode from 'node_modules/jwt-decode';

// const mongoose = require('mongoose');
// const models = require('../../backend/schemas/models.js');
// const Panorama = mongoose.model('Panorama', models.Panorama);

/**
 * This class provides convienient methods to the backend api routes for requesting data.
 * @class BackendAPI
 * @static
 */
export default class BackendAPI {

	/**
	 * Requests backend data about all panoramas documents and returns them via callback function.
	 * @method getAllPanoramaData
	 * @static
	 * @param {Function(panoramas)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static getAllPanoramaData(resolve, reject) {
		axiosInstance.get("panoramas/")
			.then(response => { resolve(response.data.panoramas); })
			.catch(error => { reject(error); });
	}

	/**
 * Requests backend data about panoramas associated with a specific tour and returns them via callback function.
 * @method getPanoramasByTourId
 * @static
 * @param {String} tourId The ID of the tour for which panoramas are requested.
 * @param {Function(panoramas)} resolve The callback function to handle the data on successful HTTP request.
 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful HTTP request.
 */
	static getPanoramasByTourId(tourId, resolve, reject) {
		axiosInstance.get(`panorama/id/${tourId}`)
			.then(response => {
				console.log(response.data.panoramas.length)
				if (response.status === 200 && response.data.panoramas.length > 0) {
					// data.panoramas.forEach((panorama) => {
					// let panoramaDocument = new Panorama(panorama);
					// panoramaDocument.save((err, doc) => {
					// 	if (err) {
					// 		console.error(e);
					// 		return;
					// } else {
					resolve(response.data.panoramas);
					// }
					// })
					// })
				}
				else {
					let data = JSON.parse(JSON.stringify(require('../../backend/data.json')));

					resolve(data);
					console.log(response.data.panoramas), resolve(response.data.panoramas);
				}
			})
			.catch(error => { reject(error); });
	}

	/**
	 * Create New Tour
	 * @method newTour
	 * @static
	 * @param {object} data
	 * @param {Function(Tours)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static newTour(data, resolve, reject) {
		const body = {
			"user": data.user,
			"name": data.name
			// "panoramas": req.panoramas
		};
		axiosInstance.post('/api', body)
			.then(response => {
				// console.log(response.data.tour._id);
				resolve(response.data.tour._id);
			})
			.catch(error => { reject(error); });
	}
	/**
		 * Requests backend data about all Tours documents and returns them via callback function.
		 * @method getAllToursApi
		 * @static
		 * @param {Function(Tours)} resolve The callback function to handle the data on successful http request.
		 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
		 */
	static getAllToursApi(resolve, reject) {
		console.log('getAllToursApi')
		axiosInstance.get("/list-tour")
			.then(response => {
				console.log(response);
				resolve(response.tours);
			})
			.catch(error => { reject(error); });
	}

	/**
	 * Requests backend data about all Tours documents and returns them via callback function.
	 * @method getTourById
		 * @static	
	 * @param {String} _id The id to identify the panorama document with.
	 * @param {Function(Tours)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static getTourById(id, resolve, reject) {
		axiosInstance.get("/tour" + id)
			.then(response => { resolve(response.data.views); })
			.catch(error => { reject(error); });
	}

	// /**
	//  * Requests Point of Interest entry from the backend database and returns them via callback function.
	//  * The POIs can be limited by providing latitude, longitude, radius and floor parameters to only return POIs in a certain proximity.
	//  * @method getPOIData
	//  * @static
	//  * @param {Number} latitude The latitude value.
	//  * @param {Number} longitude The longitude value.
	//  * @param {Number} radius The radius around the provided location in which POIs should be returned.
	//  * @param {Number} floor The building floor (currently still unsupported by the backend).
	//  * @param {Function(pois)} resolve The callback function to handle the pois as array on successful http request.
	//  * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	//  */
	// static getPOIData(latitude, longitude, radius, floor, resolve, reject) {
	// 	axiosInstance.get("pois?lat=" + latitude + "&lon=" + longitude + "&radius=" + radius + "&floor=" + floor)
	// 		.then(response => { resolve(response.data); })
	// 		.catch(error => { reject(error); });
	// }

	/**
	 * Request information about the building.
	 * @method getCMDBuildingInfo
	 * @static
	 * @param {*} buildingName The name of the building.
	 * @param {Function(buildingData)} resolve The callback function to handle the data on successful http request. Returns the data of the building that was requested.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static getCMDBuildingInfo(buildingName, resolve, reject) {
		axiosInstance.get("/cmd/" + buildingName + ".json")
			.then(response => { resolve(response.data.building); })
			.catch(error => { reject(error); });
	}


	// EDITOR API CALLS

	/**
	 * Create a new panorama. Returns the newly created panorama object.
	 * @method createNewPanorama
	 * @static
	 * @param {Object} images The six panorama cubemap face images to create a new panorama from.
	 * @param {Number} widthAndHeight The width/height of each cubemap face.
	 * @param {String} originalImageFileName The name of the panorama image file.
	 * @param {String} tourId  
	 * @param {Function(data)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static createNewPanorama(images, widthAndHeight, originalImageFileName, tourId, resolve, reject) {
		let formData = new FormData();
		for (let imageName in images) {
			let blob = images[imageName];
			formData.append('cubemaptiles', blob, imageName);
		}
		formData.append('widthAndHeight', widthAndHeight);
		formData.append('originalImageFileName', originalImageFileName);
		formData.append('tourId', tourId);

		console.log('O tourId inserido no formData foi', tourId);
		const config = {
			headers: { 'content-type': 'multipart/form-data' }
		}
		axiosInstance
			.post('panorama', formData, config).then(response => {
				resolve(response.data);
			}).catch(error => {
				reject(error);
			});
	}

	/**
	 * Update an existing panorama. Resolves with the updated panorama object.
	 * @method updatePanorama
	 * @static
	 * @param {Object} panorama The panorama data to update the panorama document entry in the database. Needs to contain id to identify the panorama docuemnt with.
	 * @param {Function(data)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static updatePanorama(panorama, resolve, reject) {
		axiosInstance.put("panorama", { panorama: panorama })
			.then(response => { resolve(response.data); })
			.catch(error => { reject(error); });
	}

	/**
	 * Delete an existing panorama.
	 * @method deletePanorama
	 * @static
	 * @param {String} _id The id to identify the panorama document with.
	 * @param {Function(data)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static deletePanorama(_id, resolve, reject) {
		axiosInstance({
			method: 'delete',
			url: 'panorama',
			data: { _id: _id }
		})
			.then(response => { resolve(response.data); })
			.catch(error => { reject(error); });
	}


	/**
	 * Create a new hotspot. Returns the newly created hotspot object.
	 * @method createNewHotspot
	 * @static
	 * @param {String} panoramaId The panorama id to add the hotspot to.
	 * @param {Object} hotspot The hotspot data object to create the hotspot with.
	 * @param {Function(data)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static createNewHotspot(panoramaId, hotspot, resolve, reject) {
		axiosInstance({
			method: 'post',
			url: 'hotspot',
			data: {
				_id: panoramaId,
				hotspot: hotspot
			}
		})
			.then(response => { resolve(response.data); })
			.catch(error => { reject(error); });
	}

	/**
	 * Update an existing hotspot. Resolves with the updated hotspot object.
	 * @method updateHotspot
	 * @static
	 * @param {Object} hotspot The hotspot data to update the hotspot with. Needs to contains the hotspot id to identify the hotspot with.
	 * @param {Function(data)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static updateHotspot(hotspot, resolve, reject) {
		axiosInstance.put("hotspot", { hotspot: hotspot })
			.then(response => { resolve(response.data); })
			.catch(error => { reject(error); });
	}

	/**
	 * Delete an existing hotspot.
	 * @method deleteHotspot
	 * @static
	 * @param {String} _id The hotspot id to identify the hotspot dcoument entry with to delete it.
	 * @param {Function(data)} resolve The callback function to handle the data on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static deleteHotspot(_id, resolve, reject) {
		axiosInstance({
			method: 'delete',
			url: 'hotspot',
			data: { _id: _id }
		})
			.then(response => { resolve(response.data); })
			.catch(error => { reject(error); });
	}


	/**
	 * Sends a login request to the backend. Currently only used to login as admin to make changes on the database via the integrated editor on the website.
	 * @method login
	 * @static
	 * @param {String} username The name of the user.
	 * @param {String} password The passwort of the user.
	 * @param {Function(data)} resolve The callback function to handle the returned token on successful http request. Includes the token data.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request.
	 */
	static login(username, password, resolve, reject) {
		axiosInstance({
			method: 'post',
			url: 'user/login',
			data: {
				username: username,
				password: password
			}
		})
			.then(response => {
				const { token } = response.data;
				if (token) {
					axiosInstance.defaults.headers.common['Authorization'] = token;
					localStorage.setItem('jwt_token', token);
					const decodedToken = jwt_decode(token);
					resolve(decodedToken);
				} else {
					// causes Webpack 5 ModuleConcatenationPlugin error
					// delete axiosInstance.defaults.headers.common['Authorization'];
					axiosInstance.defaults.headers.common['Authorization'] = undefined;
					localStorage.removeItem('jwt_token');
					resolve(undefined);
				}
			})
			.catch(error => { reject(error); });
	}


	/**
	 * Sends a request to the backend to check if the jwt token on localStorage is still valid. Currently only used to login as admin to make changes on the database via the integrated editor on the website.
	 * @method isAdmin
	 * @static
	 * @param {Function(data)} resolve The callback function to handle the returned token on successful http request.
	 * @param {Function(error)} reject The callback function to handle the error message on unsuccessful http request. Returns true if the token expired, false if there was no token from a previous session.
	 */
	static isAdmin(resolve, reject) {
		let token = localStorage.getItem('jwt_token');

		if (!token) {
			reject(false);
			return;
		}

		axiosInstance.defaults.headers.common['Authorization'] = token;
		axios({
			method: 'get',
			url: 'user/isAdmin'
		})
			.then(response => {
				if (response.status === 200) {
					resolve();
				} else {
					axiosInstance.defaults.headers.common['Authorization'] = undefined;
					localStorage.removeItem('jwt_token');
					reject(true);
				}
			})
			.catch(error => {
				// causes Webpack 5 ModuleConcatenationPlugin error
				// delete axiosInstance.defaults.headers.common['Authorization'];
				axiosInstance.defaults.headers.common['Authorization'] = undefined;
				localStorage.removeItem('jwt_token');
				reject(true);
			});
	}

}