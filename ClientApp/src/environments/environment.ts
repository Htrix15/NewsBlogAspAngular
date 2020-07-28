// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



export const environment = {
  production: false,
  countStartArticleByCategory: 3,
  countShowComments: 3,
  scrollLimitPxToAdding: 50,
  widthPxVideoCenterSection: 890,
  heightPxVideoCenterSection: 560,
  widthPxVideoSideSection: 500,
  heightPxVideoSideSection: 315,
  sizerSise:20, 
  widthNewImg: 300, 
  heightNewImg: 200, 
  maxWidth: 580, 
  maxHeight: 380, 
  workAreaBorderSize: 3,
  newImgBorderSize: 1,
  maxCountSlideElements: 10,
  configAuthVK:{
    baseURL: "*",
    clientId: "*",
    redirectUri: "*",
    display: "*",
    scope: "*",
    responseType: "*",
    v: "*",
    state: null,
    revoke: 1,
    JSONPbaseURL: "*",
    JSONPmethod: "*",
    JSONPv: "*",
    JSONP_CALLBACK:"JSONP_CALLBACK",
  },
  configAuthYandex:{
    ID: "*",
    Password: "*",
    CallbackURL: "*",
    logonUrl: "*",
    baseURL: "*",
    response_type: "*"
  },
  configAuthGoogle:{
    clientId: "*",
    projectId: "*",
    response_type: "*",
    authUri: "*",
    logonUrl: "*",
    token_uri: "*",
    auth_provider_x509_cert_url: "*",
    client_secret: "*",
    redirect_uris: [ "*" ],
    javascript_origins: [ "*" ],
    scope:"*"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
