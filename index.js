'use strict';

import server from './server';
import agenda from './lib/agenda';

let port = server.get('port');

server.listen(port, () => {
    console.log('===========================');
    console.log(`Server running on port ${port}`);
    console.log('===========================');
});