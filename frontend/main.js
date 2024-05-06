import BackendAPI from 'frontend/http/backend-api';
import Panoramas from 'frontend/marzipano/panoramas';
import PanoramaList from 'frontend/menus/panorama-list';
import LoginMenu from 'frontend/menus/login-menu';
import Hotspots from 'frontend/marzipano/hotspots';
import Autorotation from 'frontend/others/autorotate';
import Detection from 'frontend/others/browser-detection';
import Controls from 'frontend/others/controls';
import Fullscreen from 'frontend/others/fullscreen';
import Minimap from 'frontend/map/minimap';

import Portal from 'frontend/hotspots/portal';
import POI from 'frontend/hotspots/poi';
import TextInfo from 'frontend/hotspots/text-info';
import North from 'frontend/hotspots/north';

const RAD = Math.PI / 180;


/**
 * This class handles the startup of the application and initializes all required functionality.
 * @class Main
 * @static
 */
export default class Main {

	/**
	 * Initializes the application by requesting the panorama documents from the backend.
	 * This should only be called once on application startup. 
	 * @method setup
	 * @static
	 */
	// static setup() { // start application by loading data from the backend
	// 	BackendAPI.getAllPanoramaData(
	// 		Main.showTourDetails,
	// 		() => Main.showError
	// 	);
	// }
	static setup() {
		// Inicializar a aplicação exibindo a listagem de tours
		// BackendAPI.getAllPanoramaData(
		// 	Main.startApplication, () => Main.showError);


		//Chamar a lista de panoramas
		// BackendAPI.getAllToursApi(

		// );

		//a parti dela, chamar o startApplication  passando o id do tour

		// BackendAPI.getPanoramasByTourId(
		// 	Main.startApplication, () => Main.showError);

		// Criar um novo tour, pegar o id dele, e iniciar as rotas passando ele.
		const data = {
			name: "sallesTeste",
			user: "662654e533d3f012046cca4f"
		}
		// BackendAPI.newTour(data,
		// 	// (tourData) => console.log(tourData))
		// 	Main.showTourDetails, console.log('aaaa'), () => Main.showError)

		Main.showTourDetails('66265b3916ce5c3e0cd7b63e')
	}

	/**
		 * Initializes the application with the provided panorama documents.
		 * This should only be called once on application startup after retrieving the panorama documents.
		 * @method setup
		 * @static
		 * @param {Number} tour_id  
		 */
	static showTourDetails(tour_id) {
		console.log('tour_id', tour_id)
		// Fazer uma solicitação ao backend para obter os detalhes de um tour específico
		// Substitua pelo ID do tour desejado
		BackendAPI.getPanoramasByTourId(
			tour_id,
			(tourData) => {
				console.log(tourData)
				if (tourData.length > 0) {
					// Chamar startApplication() com os detalhes do tour recebidos
					Main.startApplication(tourData);
				} else {
					Main.startApplication();
				}
			},
			(error) => {
				// Lidar com o erro se não for possível obter os detalhes do tour
				Main.showError(error);
			}
		);
	}

	/**
	 * Initializes the application with the provided panorama documents.
	 * This should only be called once on application startup after retrieving the panorama documents.
	 * @method setup
	 * @static
	 * @param {Array} panoramaDocuments Contains all panorama documents. Will be used to create marzipano panorama scenes from.
	 */
	static startApplication(panoramaDocuments) {

		// set state
		global.state = Main.initState();

		// preperation work
		Detection.setup();

		// init Marzipano
		Panoramas.setup(panoramaDocuments);
		Hotspots.initHotspots(panoramaDocuments);

		// setup UI
		PanoramaList.setup();
		Minimap.setup();
		LoginMenu.setup();
		Controls.setup();
		Fullscreen.setup();
		Autorotation.setup();

		// prevent browser context menu from opening on rightclicking (optional)
		document.querySelector('body').addEventListener('contextmenu', (event) => {
			event.preventDefault();
		});

		// determine and switch to starting panorama
		Panoramas.openStartPanorama();

		// check if user was already logged in from a previous session.
		LoginMenu.checkIfAlreadyLoggedIn()
	}

	/**
	 * Handles an error message.
	 * @method showError
	 * @static
	 * @param {Object} e The error message object
	 */
	static showError(e) {
		// TODO toast popup
		console.error(e);
	}

	/**
	 * Creates and returns an object with default values that will be used as the global state object throughout the application to read and write data.
	 * @method initState
	 * @static
	 * @return {Object} The state object with initial values.
	 */
	static initState() {
		let get = (str) => document.querySelector(str);

		return {
			panoramasByID: {},

			hotspotTypes: {
				portal: Portal,
				textInfo: TextInfo,
				poi: POI,
				north: North
			},
			hotspots: {},

			viewer: undefined,
			currentPanorama: undefined,
			autorotate: undefined,

			currentSidebar: {},

			cache: {
				buildings: {},
			},

			tempData: {},

			settings: {
				preloadAllPanoramaImages: false, // if true preloads all panorama images on startup (slow startup, but if set to false no transition animation because of long load time)
				panoramaTransitionDuration: 500,

				velocity: 0.55,
				friction: 1.5,

				autorotateEnabled: false,
				allowFullscreen: true,

				editorEnabled: false
			},

			htmlElements: {
				pano: get('#pano'),

				titleBar: get('#titleBar'),
				panoramaName: get('#titleBar .panoramaName'),
				panoramaList: get('#panoramaList'),
				loginMenu: get('#loginMenu'),
				minimap: get('#minimap-container'),

				sidebar: get('#detailSidebar'),
				sidebarContainer: get('#sidebarContainer'),

				panoramaListToggle: get('#panoramaListToggle'),
				minimapToggle: get('#minimapToggle'),
				autorotateToggle: get('#autorotateToggle'),
				fullscreenToggle: get('#fullscreenToggle'),

				viewUp: get('#viewUp'),
				viewDown: get('#viewDown'),
				viewLeft: get('#viewLeft'),
				viewRight: get('#viewRight'),
				viewIn: get('#viewIn'),
				viewOut: get('#viewOut'),
			}
		};
	}

	/**
	 * Converts an angle in degree to radian.
	 * @method degToRad
	 * @static
	 * @param {Number} deg The angle in degree.
	 * @return {Number} The angle in radian.
	 */
	static degToRad(deg) {
		return deg * RAD
	}

	/**
	 * Converts an angle in radian to degree.
	 * @method radToDeg
	 * @static
	 * @param {Number} rad The angle in radian.
	 * @return {Number} The angle in degree
	 */
	static radToDeg(rad) {
		return rad / RAD
	}
}