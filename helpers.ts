import * as path from 'path';
import * as fs from 'fs';

export function ensureDirectoryExistSync(pth: string): void {
    var parentDir = path.dirname(pth);

    if(parentDir === pth){
        return;
    }

	if (parentDir === '.') {
		throw new Error(`Cannot ensure directory ${pth} exists because directory is not an absolute path`);
	}

    var basename = path.basename(parentDir);
    if (basename.length > 0)
        ensureDirectoryExistSync(parentDir);

    try {
        fs.mkdirSync(pth);
    } catch (e) {
        if (e.code != 'EEXIST')
            throw e;
    }
}