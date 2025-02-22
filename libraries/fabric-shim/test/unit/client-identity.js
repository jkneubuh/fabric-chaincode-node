/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

/* global describe it */

const shim = require('../../../fabric-shim/lib/chaincode.js');

const chai = require('chai');
const expect = chai.expect;

const certWithoutAttrs = '-----BEGIN CERTIFICATE-----' +
'MIICXTCCAgSgAwIBAgIUeLy6uQnq8wwyElU/jCKRYz3tJiQwCgYIKoZIzj0EAwIw' +
'eTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh' +
'biBGcmFuY2lzY28xGTAXBgNVBAoTEEludGVybmV0IFdpZGdldHMxDDAKBgNVBAsT' +
'A1dXVzEUMBIGA1UEAxMLZXhhbXBsZS5jb20wHhcNMTcwOTA4MDAxNTAwWhcNMTgw' +
'OTA4MDAxNTAwWjBdMQswCQYDVQQGEwJVUzEXMBUGA1UECBMOTm9ydGggQ2Fyb2xp' +
'bmExFDASBgNVBAoTC0h5cGVybGVkZ2VyMQ8wDQYDVQQLEwZGYWJyaWMxDjAMBgNV' +
'BAMTBWFkbWluMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFq/90YMuH4tWugHa' +
'oyZtt4Mbwgv6CkBSDfYulVO1CVInw1i/k16DocQ/KSDTeTfgJxrX1Ree1tjpaodG' +
'1wWyM6OBhTCBgjAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0TAQH/BAIwADAdBgNVHQ4E' +
'FgQUhKs/VJ9IWJd+wer6sgsgtZmxZNwwHwYDVR0jBBgwFoAUIUd4i/sLTwYWvpVr' +
'TApzcT8zv/kwIgYDVR0RBBswGYIXQW5pbHMtTWFjQm9vay1Qcm8ubG9jYWwwCgYI' +
'KoZIzj0EAwIDRwAwRAIgCoXaCdU8ZiRKkai0QiXJM/GL5fysLnmG2oZ6XOIdwtsC' +
'IEmCsI8Mhrvx1doTbEOm7kmIrhQwUVDBNXCWX1t3kJVN' +
'-----END CERTIFICATE-----';

const certWithAttrs = '-----BEGIN CERTIFICATE-----' +
'MIIB6TCCAY+gAwIBAgIUHkmY6fRP0ANTvzaBwKCkMZZPUnUwCgYIKoZIzj0EAwIw' +
'GzEZMBcGA1UEAxMQZmFicmljLWNhLXNlcnZlcjAeFw0xNzA5MDgwMzQyMDBaFw0x' +
'ODA5MDgwMzQyMDBaMB4xHDAaBgNVBAMTE015VGVzdFVzZXJXaXRoQXR0cnMwWTAT' +
'BgcqhkjOPQIBBggqhkjOPQMBBwNCAATmB1r3CdWvOOP3opB3DjJnW3CnN8q1ydiR' +
'dzmuA6A2rXKzPIltHvYbbSqISZJubsy8gVL6GYgYXNdu69RzzFF5o4GtMIGqMA4G' +
'A1UdDwEB/wQEAwICBDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBTYKLTAvJJK08OM' +
'VGwIhjMQpo2DrjAfBgNVHSMEGDAWgBTEs/52DeLePPx1+65VhgTwu3/2ATAiBgNV' +
'HREEGzAZghdBbmlscy1NYWNCb29rLVByby5sb2NhbDAmBggqAwQFBgcIAQQaeyJh' +
'dHRycyI6eyJhdHRyMSI6InZhbDEifX0wCgYIKoZIzj0EAwIDSAAwRQIhAPuEqWUp' +
'svTTvBqLR5JeQSctJuz3zaqGRqSs2iW+QB3FAiAIP0mGWKcgSGRMMBvaqaLytBYo' +
'9v3hRt1r8j8vN0pMcg==' +
'-----END CERTIFICATE-----';

const certWithLongDNs = '-----BEGIN CERTIFICATE-----' +
'MIICGjCCAcCgAwIBAgIRAIPRwJHVLhHK47XK0BbFZJswCgYIKoZIzj0EAwIwczEL' +
'MAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBG' +
'cmFuY2lzY28xGTAXBgNVBAoTEG9yZzIuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh' +
'Lm9yZzIuZXhhbXBsZS5jb20wHhcNMTcwNjIzMTIzMzE5WhcNMjcwNjIxMTIzMzE5' +
'WjBbMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMN' +
'U2FuIEZyYW5jaXNjbzEfMB0GA1UEAwwWVXNlcjFAb3JnMi5leGFtcGxlLmNvbTBZ' +
'MBMGByqGSM49AgEGCCqGSM49AwEHA0IABBd9SsEiFH1/JIb3qMEPLR2dygokFVKW' +
'eINcB0Ni4TBRkfIWWUJeCANTUY11Pm/+5gs+fBTqBz8M2UzpJDVX7+2jTTBLMA4G' +
'A1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIKfUfvpGproH' +
'cwyFD+0sE3XfJzYNcif0jNwvgOUFZ4AFMAoGCCqGSM49BAMCA0gAMEUCIQC8NIMw' +
'e4ym/QRwCJb5umbONNLSVQuEpnPsJrM/ssBPvgIgQpe2oYa3yO3USro9nBHjpM3L' +
'KsFQrpVnF8O6hoHOYZQ=' +
'-----END CERTIFICATE-----';

const certWithLotsOfAttrs = '-----BEGIN CERTIFICATE-----\n' +
'MIICuDCCAl6gAwIBAgIUFAyz0HVql93FhIgU3DJah7vtQLswCgYIKoZIzj0EAwIw\n' +
'czELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\n' +
'biBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT\n' +
'E2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTkwOTA1MTYzMTAwWhcNMjAwOTA0MTYz\n' +
'NjAwWjAjMQ8wDQYDVQQLEwZjbGllbnQxEDAOBgNVBAMTB3NzdG9uZTEwWTATBgcq\n' +
'hkjOPQIBBggqhkjOPQMBBwNCAAQdB0zBWOdBTQZjOIQ3s+px0g1wpeXrkC+suY2N\n' +
'jANugF1ie1QF0YT97gt7o0jMCItLFF+RTU3HiIn+mW5omKtro4IBHjCCARowDgYD\n' +
'VR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFC1x4XKFPRRXvLd2\n' +
'kq+Ly1CCjkKXMCsGA1UdIwQkMCKAIBw8JOPUf5+Yky3e04oqNRH5VpBhHBHdnpKN\n' +
'TniD3O9UMIGtBggqAwQFBgcIAQSBoHsiYXR0cnMiOnsiaGYuQWZmaWxpYXRpb24i\n' +
'OiIiLCJoZi5FbnJvbGxtZW50SUQiOiJzc3RvbmUxIiwiaGYuVHlwZSI6ImNsaWVu\n' +
'dCIsInRlc3QxIjoiZm9vYmFyIiwidGVzdDIiOiJ3b3cgc3VjaCBhdHRyaWJ1dGVz\n' +
'IiwidGVzdDMiOiJyb2NraW5nIGFyb3VuZCB0aGUgd29ybGQifX0wCgYIKoZIzj0E\n' +
'AwIDSAAwRQIhAJQoKLJv6CzpQNgkIrt27qUbKvTyp2hveRiQEf9ke8jWAiARdmfu\n' +
'K7/4F98z4aWuP1rA8+j3mRtXFaIQBk9+4eKETg==\n' +
'-----END CERTIFICATE-----\n';

describe('Client-Identity', () => {

    it ('should throw an error when using a bad cert', () => {
        const stub = mockStub('I AM NOT A CERT');
        expect(() => {
            new shim.ClientIdentity(stub);
        }).to.throw(/Failed to find start line or end line of the certificate./);
    });

    describe('Certificate with values', () => {
        const stub = mockStub(certWithAttrs);
        const cid = new shim.ClientIdentity(stub);

        it ('should have correct mspId', () => {
            expect(cid.getMSPID()).to.deep.equal('dummyId');
        });

        it ('should return correct ID bytes', () => {
            const actualIdBytes = cid.getIDBytes();
            const expectedIdBytes = Buffer.from(certWithAttrs);
            expect(actualIdBytes.compare(expectedIdBytes)).to.equal(0);
        });

        it ('should return correct value on getID()', () => {
            expect(cid.getID()).to.deep.equal('x509::CN=MyTestUserWithAttrs::CN=fabric-ca-server');
        });

        it ('should have correct attrs', () => {
            expect(cid.attrs.attr1).to.deep.equal('val1');
        });

        it ('should return the value when getAttributeValue() called with known attribute', () => {
            expect(cid.getAttributeValue('attr1')).to.deep.equal('val1');
        });

        it ('should return null when getAttributeValue() called with unknown attribute', () => {
            expect(cid.getAttributeValue('unknown')).to.be.null;
        });

        it ('should return true when value provided matches known attribute in assertAttributeValue()', () => {
            expect(cid.assertAttributeValue('attr1', 'val1')).to.deep.equal(true);
        });

        it ('should return false when value provided does not match known attribute in assertAttributeValue()', () => {
            expect(cid.assertAttributeValue('attr1', 'val2')).to.deep.equal(false);
        });

        it ('should return false when unknown attribute in assertAttributeValue()', () => {
            expect(cid.assertAttributeValue('unknown', 'val1')).to.deep.equal(false);
        });
    });

    describe('Certificate with multiple attributes', () => {
        const stub = mockStub(certWithLotsOfAttrs);
        const cid = new shim.ClientIdentity(stub);

        it('should have correct attributes', () => {
            expect(cid.attrs).to.deep.equal({
                'hf.Affiliation': '',
                'hf.EnrollmentID': 'sstone1',
                'hf.Type': 'client',
                test1: 'foobar',
                test2: 'wow such attributes',
                test3: 'rocking around the world'
            });
        });
    });

    describe('Certificate without values', () => {
        const stub = mockStub(certWithoutAttrs);
        const cid = new shim.ClientIdentity(stub);

        it ('should have correct mspId', () => {
            expect(cid.getMSPID()).to.deep.equal('dummyId');
        });

        it ('should have not attributes', () => {
            expect(cid.attrs).to.deep.equal({});
        });
    });

    describe('Certificate with long DNs', () => {
        const stub = mockStub(certWithLongDNs);
        const cid = new shim.ClientIdentity(stub);

        it ('should return correct value on getID()', () => {
            expect(cid.getID()).to.deep.equal('x509::CN=User1@org2.example.com,L=San Francisco,ST=California,C=US::CN=ca.org2.example.com,O=org2.example.com,L=San Francisco,ST=California,C=US');
        });
    });
});

function mockStub(cert) {
    return {
        getCreator: function() {
            return {
                mspid: 'dummyId',
                idBytes: Buffer.from(cert)
            };
        },
        getTxID: function() {
            return 'dummy Tx ID';
        },
        getChannelID: function() {
            return 'dummy channel ID';
        }
    };
}
