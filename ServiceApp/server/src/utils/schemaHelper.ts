import { SchemaManager } from 'identity_ts';
const Schema1 = require('./../Schemas/0173-1#01-AAI711#001.json');
const Schema2 = require('./../Schemas/0173-1#01-AAJ336#002.json');
const Schema3 = require('./../Schemas/0173-1#01-AAO742#002.json');
const Schema4 = require('./../Schemas/0173-1#01-AAP788#001.json');
const Schema5 = require('./../Schemas/0173-1#01-BAF577#004.json');

//TODO: Add DID's to trust
export class SchemaHelper {
    private static instance : SchemaHelper;

    private constructor() {
        //Load all default application schemas
        const manager = SchemaManager.GetInstance();
        manager.AddSchema("0173-1#01-AAI711#001", Schema1);
        manager.AddSchema("0173-1#01-AAJ336#002", Schema2);
        manager.AddSchema("0173-1#01-AAO742#002", Schema3);
        manager.AddSchema("0173-1#01-AAP788#001", Schema4);
        manager.AddSchema("0173-1#01-BAF577#004", Schema5);
    }

    static GetInstance() : SchemaManager {
        if(!SchemaHelper.instance) {
            SchemaHelper.instance = new SchemaHelper();
        }
        return SchemaHelper.GetInstance();
    }
}