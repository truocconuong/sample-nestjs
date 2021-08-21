import { Controller, Get, Query, Res } from '@nestjs/common';
const securityHelper = require('./security');
const querystring = require('querystring');
const _ = require('lodash')
const restClient = require('superagent-bluebird-promise');


@Controller('singpass')
export class SingPassController {
    constructor() { }
    @Get('getEnv')
    configEnv() {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        var _publicCertContent = process.env.MYINFO_SIGNATURE_CERT_PUBLIC_CERT;
        var _privateKeyContent = process.env.DEMO_APP_SIGNATURE_CERT_PRIVATE_KEY;
        var _clientId = process.env.MYINFO_APP_CLIENT_ID;
        var _clientSecret = process.env.MYINFO_APP_CLIENT_SECRET;
        var _redirectUrl = process.env.MYINFO_APP_REDIRECT_URL;
        var _authLevel = process.env.AUTH_LEVEL;
        var _authApiUrl = process.env.MYINFO_API_AUTHORISE;
        var _tokenApiUrl = process.env.MYINFO_API_TOKEN;
        var _personApiUrl = process.env.MYINFO_API_PERSON;
        var _attributes = "uinfin,name,sex,race,nationality,dob,email,mobileno,regadd,housingtype,hdbtype,marital,edulevel,noa-basic,ownerprivate,cpfcontributions,cpfbalances";
        return {
            _publicCertContent,
            _privateKeyContent,
            _clientId,
            _clientSecret,
            _redirectUrl,
            _authLevel,
            _tokenApiUrl,
            _authApiUrl,
            _personApiUrl,
            _attributes
        }


    }


    createTokenRequest(code: any) {
        const configEnv = this.configEnv();
        var cacheCtl = "no-cache";
        var contentType = "application/x-www-form-urlencoded";
        var method = "POST";

        // assemble params for Token API
        var strParams = "grant_type=authorization_code" +
            "&code=" + code +
            "&redirect_uri=" + configEnv._redirectUrl +
            "&client_id=" + configEnv._clientId +
            "&client_secret=" + configEnv._clientSecret;
        var params = querystring.parse(strParams);


        // assemble headers for Token API
        var strHeaders = "Content-Type=" + contentType + "&Cache-Control=" + cacheCtl;
        var headers = querystring.parse(strHeaders);

        // Add Authorisation headers for connecting to API Gateway
        var authHeaders = null;
        if (configEnv._authLevel == "L0") {
            // No headers
        } else if (configEnv._authLevel == "L2") {
            authHeaders = securityHelper.generateAuthorizationHeader(
                configEnv._tokenApiUrl,
                params,
                method,
                contentType,
                configEnv._authLevel,
                configEnv._clientId,
                configEnv._privateKeyContent,
                configEnv._clientSecret
            );
        } else {
            throw new Error("Unknown Auth Level");
        }

        if (!_.isEmpty(authHeaders)) {
            _.set(headers, "Authorization", authHeaders);
        }

        console.log(JSON.stringify(headers));

        var request = restClient.post(configEnv._tokenApiUrl);

        // Set headers
        if (!_.isUndefined(headers) && !_.isEmpty(headers))
            request.set(headers);

        // Set Params
        if (!_.isUndefined(params) && !_.isEmpty(params))
            request.send(params);

        return request;
    }

    // function to prepare request for PERSON API
    createPersonRequest(sub: any, validToken: any) {
        const configEnv = this.configEnv();
        var url = configEnv._personApiUrl + "/" + sub + "/";
        var cacheCtl = "no-cache";
        var method = "GET";

        // assemble params for Person API
        var strParams = "client_id=" + configEnv._clientId +
            "&attributes=" + configEnv._attributes;

        var params = querystring.parse(strParams);

        // assemble headers for Person API
        var strHeaders = "Cache-Control=" + cacheCtl;
        var headers = querystring.parse(strHeaders);

        // Add Authorisation headers for connecting to API Gateway
        var authHeaders = securityHelper.generateAuthorizationHeader(
            url,
            params,
            method,
            "", // no content type needed for GET
            configEnv._authLevel,
            configEnv._clientId,
            configEnv._privateKeyContent,
            configEnv._clientSecret
        );

        // NOTE: include access token in Authorization header as "Bearer " (with space behind)
        if (!_.isEmpty(authHeaders)) {
            _.set(headers, "Authorization", authHeaders + ",Bearer " + validToken);
        } else {
            _.set(headers, "Authorization", "Bearer " + validToken);
        }

        console.log(JSON.stringify(headers));
        // invoke person API
        var request = restClient.get(url);

        // Set headers
        if (!_.isUndefined(headers) && !_.isEmpty(headers))
            request.set(headers);

        // Set Params
        if (!_.isUndefined(params) && !_.isEmpty(params))
            request.query(params);

        return request;
    }
    callPersonAPI(accessToken: string, res: any) {
        const configEnv = this.configEnv()

        // validate and decode token to get SUB
        var decoded = securityHelper.verifyJWS(accessToken, configEnv._publicCertContent);
        if (decoded == undefined || decoded == null) {
            res.jsonp({
                status: "ERROR",
                msg: "INVALID TOKEN"
            })
        }

        var sub = decoded.sub;
        if (sub == undefined || sub == null) {
            res.jsonp({
                status: "ERROR",
                msg: "SUB NOT FOUND"
            });
        }

        // **** CALL PERSON API ****
        var request = this.createPersonRequest(sub, accessToken);

        // Invoke asynchronous call
        request
            .buffer(true)
            .end(function (callErr: any, callRes: any) {
                if (callErr) {
                    console.error("Person Call Error: ", callErr.status);
                    console.error(callErr.response.req.res.text);
                    res.jsonp({
                        status: "ERROR",
                        msg: callErr
                    });
                } else {
                    // SUCCESSFUL
                    var data = {
                        body: callRes.body,
                        text: callRes.text
                    };
                    var personData = data.text;
                    if (personData == undefined || personData == null) {
                        res.jsonp({
                            status: "ERROR",
                            msg: "PERSON DATA NOT FOUND"
                        });
                    } else {

                        if (configEnv._authLevel == "L0") {
                            console.log(personData);
                            personData = JSON.parse(personData);
                            // personData = securityHelper.verifyJWS(personData, _publicCertContent);

                            if (personData == undefined || personData == null) {
                                res.jsonp({
                                    status: "ERROR",
                                    msg: "INVALID DATA OR SIGNATURE FOR PERSON DATA"
                                });
                            }

                            // successful. return data back to frontend
                            res.jsonp({
                                status: "OK",
                                text: personData
                            });

                        }
                        else if (configEnv._authLevel == "L2") {
                            console.log(personData);

                            var jweParts = personData.split("."); // header.encryptedKey.iv.ciphertext.tag
                            securityHelper.decryptJWE(jweParts[0], jweParts[1], jweParts[2], jweParts[3], jweParts[4], configEnv._privateKeyContent)
                                .then((personDataJWS: null | undefined) => {
                                    if (personDataJWS == undefined || personDataJWS == null) {
                                        res.jsonp({
                                            status: "ERROR",
                                            msg: "INVALID DATA OR SIGNATURE FOR PERSON DATA"
                                        });
                                    }
                                    console.log(JSON.stringify(personDataJWS));

                                    var decodedPersonData = securityHelper.verifyJWS(personDataJWS, configEnv._publicCertContent);
                                    if (decodedPersonData == undefined || decodedPersonData == null) {
                                        res.jsonp({
                                            status: "ERROR",
                                            msg: "INVALID DATA OR SIGNATURE FOR PERSON DATA"
                                        })
                                    }


                                    console.log(JSON.stringify(decodedPersonData));
                                    // successful. return data back to frontend
                                    res.jsonp({
                                        status: "OK",
                                        text: decodedPersonData
                                    });

                                })
                                .catch((error: any) => {
                                    console.error("Error with decrypting JWE: %s", error);
                                })
                        }
                        else {
                            throw new Error("Unknown Auth Level");
                        }

                    } // end else
                }
            }); //end asynchronous call
    }


    async getEnv() {
        const configEnv = this.configEnv()
        return configEnv
    }

    @Get('getPersonData')
    async getPersonalData(@Res() res: any, @Query() query: any) {
        // get variables from frontend
        var code = query.code
        console.log(code)

        var request;

        // **** CALL TOKEN API ****
        request = this.createTokenRequest(code);
        request
            .buffer(true)
            .end((callErr: any, callRes: any) => {
                if (callErr) {
                    // ERROR
                    console.error("Token Call Error: ", callErr.status);
                    console.error(callErr.response.req.res.text);
                    return ({
                        status: "ERROR",
                        msg: callErr
                    });
                } else {
                    // SUCCESSFUL
                    var data = {
                        body: callRes.body,
                        text: callRes.text
                    };
                    console.log(JSON.stringify(data.body));

                    var accessToken = data.body.access_token;
                    if (accessToken == undefined || accessToken == null) {
                        return ({
                            status: "ERROR",
                            msg: "ACCESS TOKEN NOT FOUND"
                        });
                    }

                    // everything ok, call person API
                    this.callPersonAPI(accessToken, res);
                }
            });
    }
}
