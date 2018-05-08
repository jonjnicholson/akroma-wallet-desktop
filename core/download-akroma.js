const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const request = require('request');
const app = require('electron').remote;

const AdmZip = require('adm-zip');

const clientVersions = require('./client-versions');
const client = clientVersions.clients.akroma.platforms[os.platform()][os.arch()];
const clientPath = path.join(process.env.HOME + client.extract_path);
const clientBin = client.bin;

/**
 * TODO:
 * Chop up install path for zips and binaries based on the operating system type
 * Linux, windows, and mac can be separate. Maybe a dotfile/dotdirectory somewhere?
 */

module.exports = {
    akromaClientExists: () => {
        const exists = fs.existsSync(clientPath + path.sep + clientBin);
        console.info('exists?', exists);
        return exists;
    },
    downloadAkromaClient: (callback) => {
        var tempDir;
        const url = client.download.url;
        const fileName = `${os.platform()}-${os.arch()}-${clientVersions.clients.akroma.version}.zip`;
        const req = request(url);

        console.info('[Downloading Akroma client...]')
        if (fs.existsSync(clientPath) === false) {
            fs.mkdirSync(clientPath);
        }

        req.on('response', (response) => {
            fs.mkdtemp(`${os.tmpdir()}${path.sep}`, (err, folder) => {
              tempDir = folder;
              if (err) throw err;
              response.pipe(fs.createWriteStream(tempDir + path.sep + fileName));
            });
        });

        req.on('end', () => {
            const zip = new AdmZip(tempDir + path.sep + fileName);
            if (module.exports.archiveVerifiedMd5Checksum(zip.toBuffer())) {
                zip.extractAllTo(clientPath, true);
                fs.chmodSync(clientPath + path.sep + clientBin, fs.constants.S_IXUSR);
                callback(true);
                return;
            } 

            callback(false, 'Akroma client archive does not match MD5 checksum.');
        });
    },
    archiveVerifiedMd5Checksum: (fileString) => {
        return crypto.createHash('md5').update(fileString).digest('hex') === client.download.md5;
    },
};
