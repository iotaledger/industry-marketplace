import * as fs from 'fs';
import { SchemaManager } from 'identity_ts';

//TODO: Add DID's to trust
export class SchemaHelper {
    private static instance : SchemaHelper;

    private constructor() {
        //Load all default application schemas
        let folderPath : string = __dirname +"../Schemas";
        let filePaths : string[] = fs.readdirSync(folderPath);
        for(let i=0; i < filePaths.length; i++) {
            let fileName : string = filePaths[i].substr(0, filePaths[i].lastIndexOf('.'));
            SchemaManager.GetInstance().AddSchemaFromFile(fileName, folderPath+"/"+filePaths[i]);
        }
    }

    static GetInstance() : SchemaManager {
        if(!SchemaHelper.instance) {
            SchemaHelper.instance = new SchemaHelper();
        }
        return SchemaHelper.GetInstance();
    }
}