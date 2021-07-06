import fs from 'fs';
export function getConfig() {
    try {
        return JSON.parse(fs.readFileSync('./configApp.json', 'utf8'));
    }
    catch (e) {
        throw new Error(e);
    }
}
//# sourceMappingURL=index.js.map