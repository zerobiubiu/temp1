const axios = require('axios');
const csv = require('fast-csv');
const fs = require('fs');
const OD_SSDPROG = require("./module/OD_SSDPROG");

async function q(){
    console.log(await OD_SSDPROG.startSendSample());
}

q();