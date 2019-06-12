/**
 * ConfigurationService Class.
 */
export class ConfigurationService {
    constructor() {
        this._configuration = {};
	}

    /**
     * Load the configuration.
     * @param path The path to the configuration.
     * @returns Promise.
    */
	async load(path) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                this._configuration = await response.json();
                return this._configuration;
            } else {
                throw new Error(`Could not find file`);
            }
        } catch (err) {
            throw new Error(`Error loading configuration file\n${err.message}`);
        }
    }

    get() {
        return this._configuration;
    }
}
