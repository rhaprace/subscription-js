import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try{
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit())return res.status(429).json({success: false, message: 'Rate limit exceeded. Please try again later.'});
            if(decision.reason.isBot()) return res.status(403).json({success: false,message: 'Access denied for bots.'});
            return res.status(403).json({success: false, message: 'Access denied.'});
        }

        next();
    }catch(error){
        console.log('Arcjet Middleware Error:', error);
        next();
    }
}

export default arcjetMiddleware;