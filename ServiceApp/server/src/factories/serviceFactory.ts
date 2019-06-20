/**
 * Factory for creating services.
 */
export class ServiceFactory {
    /**
     * Store the service callbacks.
     */
    private static readonly _services = {};
    /**
     * Store the created instances.
     */
    private static readonly _instances = {};

    /**
     * Register a new service.
     * @param name The name of the service.
     * @param instanceCallback The callback to create an instance.
     */
    public static register(name, instanceCallback) {
        this._services[name] = instanceCallback;
    }

    /**
     * Unregister a service.
     * @param name The name of the service to unregister.
     */
    public static unregister(name) {
        delete this._services[name];
    }

    /**
     * Get a service instance.
     * @param name The name of the service to get.
     * @returns An instance of the service.
     */
    public static get(name) {
        if (!this._instances[name] && this._services[name]) {
            this._instances[name] = this._services[name]();
        }
        return this._instances[name];
    }
}
