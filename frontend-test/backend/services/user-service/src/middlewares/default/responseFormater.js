export function responseFormatter(req, res, next) {

     res.success = (message = null, data = null, statusCode = 200) => {
          res.status(statusCode).json({
               success: true,
               message: message,
               timestamp: new Date().toISOString(),
               data: data,
          });
     };
          
     res.fail = (message = null, statusCode = 400, ...kwargs) => {
          res.status(statusCode).json({
               success: false,
               message: message,
               timestamp: new Date().toISOString(),
               route: req.originalUrl,
               data: null,
               ...kwargs[0],
          });
     };

     next();
}
