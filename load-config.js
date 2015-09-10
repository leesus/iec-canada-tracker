'use strict';

import nconf from 'nconf';

nconf.argv()
     .env({ separator: '__' })
     .file('./config/settings.json');

export default nconf;