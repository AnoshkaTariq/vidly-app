const winston = require('winston');

// error handler middleware
module.exports = (err, req, res, next) => {
    // if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    //     return res.status(400).send({
    //         error: {
    //             code: "INVALID_JSON",
    //             message: "The body of your request is not valid JSON.",
    //             type: err.type
    //         }
    //     });
    // }

    // console.error(err);
    // res.status(500).send('Something failed!!!');
    winston.error(err.message, { metadata: err });
    res.status(500).send('Something failed!!!');
}