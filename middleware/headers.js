const headers = async (req, res, next) =>  {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE');
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, accept, Authorization');

    next()
}

module.exports= headers;

// test update