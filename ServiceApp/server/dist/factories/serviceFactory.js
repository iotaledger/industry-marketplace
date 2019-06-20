"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Factory for creating services.
 */
class ServiceFactory {
    /**
     * Register a new service.
     * @param name The name of the service.
     * @param instanceCallback The callback to create an instance.
     */
    static register(name, instanceCallback) {
        this._services[name] = instanceCallback;
    }
    /**
     * Unregister a service.
     * @param name The name of the service to unregister.
     */
    static unregister(name) {
        delete this._services[name];
    }
    /**
     * Get a service instance.
     * @param name The name of the service to get.
     * @returns An instance of the service.
     */
    static get(name) {
        if (!this._instances[name] && this._services[name]) {
            this._instances[name] = this._services[name]();
        }
        return this._instances[name];
    }
}
/**
 * Store the service callbacks.
 */
ServiceFactory._services = {};
/**
 * Store the created instances.
 */
ServiceFactory._instances = {};
exports.ServiceFactory = ServiceFactory;
