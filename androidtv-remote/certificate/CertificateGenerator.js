"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateGenerator = void 0;
const forge = __importStar(require("node-forge"));
const crypto = __importStar(require("crypto"));
class CertificateGenerator {
    static generateFull(name, country, state, locality, organisation, OU) {
        const keys = forge.pki.rsa.generateKeyPair({ bits: 2048 });
        const cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.serialNumber = '01' + crypto.randomBytes(19).toString('hex');
        cert.validity.notBefore = new Date();
        const date = new Date();
        date.setUTCFullYear(2099);
        cert.validity.notAfter = date;
        const attributes = [
            { name: 'commonName', value: name },
            { name: 'countryName', value: country },
            { shortName: 'ST', value: state },
            { name: 'localityName', value: locality },
            { name: 'organizationName', value: organisation },
            { shortName: 'OU', value: OU },
        ];
        cert.setSubject(attributes);
        cert.sign(keys.privateKey, forge.md.sha256.create());
        return {
            cert: forge.pki.certificateToPem(cert),
            key: forge.pki.privateKeyToPem(keys.privateKey),
        };
    }
}
exports.CertificateGenerator = CertificateGenerator;
//# sourceMappingURL=CertificateGenerator.js.map