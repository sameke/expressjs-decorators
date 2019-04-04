"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_1 = require("http");
var ParameterType;
(function (ParameterType) {
    ParameterType[ParameterType["REQUEST"] = 0] = "REQUEST";
    ParameterType[ParameterType["RESPONSE"] = 1] = "RESPONSE";
    ParameterType[ParameterType["PARAMS"] = 2] = "PARAMS";
    ParameterType[ParameterType["NUM_PARAM"] = 3] = "NUM_PARAM";
    ParameterType[ParameterType["QUERY"] = 4] = "QUERY";
    ParameterType[ParameterType["NUM_QUERY"] = 5] = "NUM_QUERY";
    ParameterType[ParameterType["BODY"] = 6] = "BODY";
    ParameterType[ParameterType["HEADERS"] = 7] = "HEADERS";
    ParameterType[ParameterType["NEXT"] = 8] = "NEXT";
})(ParameterType || (ParameterType = {}));
function Controller(path) {
    return (target) => {
        let meta = getMeta(target.prototype);
        meta.url = path;
    };
}
exports.Controller = Controller;
function Get(path) {
    return (target, key, descriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        meta.routes[key].url = path;
        meta.routes[key].method = 'get';
        return;
    };
}
exports.Get = Get;
function Post(path) {
    return (target, key, descriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        meta.routes[key].url = path;
        meta.routes[key].method = 'post';
        return;
    };
}
exports.Post = Post;
function Put(path) {
    return (target, key, descriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        meta.routes[key].url = path;
        meta.routes[key].method = 'put';
        return;
    };
}
exports.Put = Put;
function Delete(path) {
    return (target, key, descriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        meta.routes[key].url = path;
        meta.routes[key].method = 'delete';
        return;
    };
}
exports.Delete = Delete;
function Params(name) {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            name: name,
            type: ParameterType.PARAMS
        });
    };
}
exports.Params = Params;
function NumParam(name, isFloat = false) {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            name: name,
            type: ParameterType.NUM_PARAM,
            isFloat: isFloat
        });
    };
}
exports.NumParam = NumParam;
function Query(name) {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            name: name,
            type: ParameterType.QUERY
        });
    };
}
exports.Query = Query;
function NumQuery(name, isFloat = false) {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            name: name,
            type: ParameterType.NUM_QUERY,
            isFloat: isFloat
        });
    };
}
exports.NumQuery = NumQuery;
function Body(name) {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            name: name,
            type: ParameterType.BODY
        });
    };
}
exports.Body = Body;
function Response() {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            type: ParameterType.RESPONSE
        });
    };
}
exports.Response = Response;
function Request() {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            type: ParameterType.REQUEST
        });
    };
}
exports.Request = Request;
function Next() {
    return (target, key, index) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {};
        }
        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }
        routeDeclaration.params.push({
            index: index,
            type: ParameterType.NEXT
        });
    };
}
exports.Next = Next;
function CatchAndSendError() {
    return (target, key, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            let res = null;
            for (let arg of args) {
                if (arg instanceof http_1.ServerResponse) {
                    res = arg;
                    break;
                }
            }
            try {
                let value = originalMethod.apply(this, args);
                if (value != null && value.catch != null) {
                    value.catch((err) => {
                        if (res != null) {
                            res.status(400).json({ error: err.message });
                        }
                        else {
                            throw err;
                        }
                    });
                }
            }
            catch (ex) {
                if (res != null) {
                    res.status(400).json({ error: ex.message || 'an error has occurred processing request' });
                }
                else {
                    throw ex;
                }
            }
        };
    };
}
exports.CatchAndSendError = CatchAndSendError;
function registerController(app, controller) {
    let meta = getMeta(controller);
    let router = express_1.Router();
    let url = meta.url;
    for (let methodName of Object.keys(meta.routes)) {
        let route = meta.routes[methodName];
        const routeHandler = (req, res, next) => {
            let args = getParameters(req, res, next, route.params);
            let handler = controller[methodName].apply(controller, args);
            return handler;
        };
        router[route.method].apply(router, [route.url, routeHandler]);
    }
    app.use(url, router);
}
exports.registerController = registerController;
function getParameters(req, res, next, params) {
    if (params == null || params.length <= 0) {
        return [req, res, next];
    }
    const args = [];
    for (let pd of params) {
        switch (pd.type) {
            case ParameterType.RESPONSE:
                args[pd.index] = res;
                break;
            case ParameterType.REQUEST:
                args[pd.index] = req;
                break;
            case ParameterType.NEXT:
                args[pd.index] = next;
                break;
            case ParameterType.PARAMS:
                args[pd.index] = pd.name != null ? req.params[pd.name] || null : req.params;
                break;
            case ParameterType.NUM_PARAM:
                try {
                    let value = pd.isFloat ? parseFloat(req.params[pd.name]) : parseInt(req.params[pd.name], 10);
                    args[pd.index] = value;
                }
                catch (_a) {
                    args[pd.index] = null;
                }
                break;
            case ParameterType.QUERY:
                args[pd.index] = pd.name != null ? req.query[pd.name] || null : req.query;
                break;
            case ParameterType.NUM_QUERY:
                try {
                    let value = pd.isFloat ? parseFloat(req.query[pd.name]) : parseInt(req.query[pd.name], 10);
                    args[pd.index] = value;
                }
                catch (_b) {
                    args[pd.index] = null;
                }
                break;
            case ParameterType.BODY:
                args[pd.index] = pd.name != null ? req.body[pd.name] || null : req.body;
                break;
            case ParameterType.HEADERS:
                args[pd.index] = pd.name != null ? req.headers[pd.name] || null : req.headers;
                break;
            default:
                args[pd.index] = null;
        }
    }
    return args;
}
function getMeta(target) {
    if (target.__express_meta__ == null) {
        target.__express_meta__ = {
            url: '',
            routes: {}
        };
    }
    return target.__express_meta__;
}

//# sourceMappingURL=express.js.map
