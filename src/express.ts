import { Application, NextFunction, Request, Response, Router } from 'express';
import * as express from 'express';
import { ServerResponse } from 'http';

enum ParameterType {
    REQUEST,
    RESPONSE,
    PARAMS,
    NUM_PARAM,
    QUERY,
    NUM_QUERY,
    BODY,
    HEADERS,
    NEXT
}

interface IParameterDeclaration {
    index: number;
    type: ParameterType;
    name?: string;
    isFloat?: boolean;
}

interface IRouteDeclaration {
    url: string;
    method: string;
    params: IParameterDeclaration[];
    mw: MiddleWare[];
}

export type MiddleWare = (req: Request, res: Response, next: NextFunction) => void;

/**
 * function decorator
 * @param path base path for the controller
 */
export function Controller(path: string) {
    return (target: any) => {
        let meta = getMeta(target.prototype);
        meta.url = path;
    };
}

/**
 * function decorator
 * @param path path for get method
 */
export function Get(path: string = '', middleware?: MiddleWare[]) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
        }
        meta.routes[key].url = path || '';
        meta.routes[key].method = 'get';
        meta.routes[key].mw = middleware;
        return;
    };
}

/**
 * function decorator
 * @param path path for post method
 */
export function Post(path: string = '', middleware?: MiddleWare[]) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
        }
        meta.routes[key].url = path;
        meta.routes[key].method = 'post';
        meta.routes[key].mw = middleware;
        return;
    };
}

/**
 * function decorator
 * @param path path for put method
 */
export function Put(path: string = '', middleware?: MiddleWare[]) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
        }
        meta.routes[key].url = path;
        meta.routes[key].method = 'put';
        meta.routes[key].mw = middleware;
        return;
    };
}

/**
 * function decorator
 * @param path path for delete method
 */
export function Delete(path: string = '', middleware?: MiddleWare[]) {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
        }
        meta.routes[key].url = path;
        meta.routes[key].method = 'delete';
        meta.routes[key].mw = middleware;

        return;
    };
}

/**
 * parameter decorator
 * @param name name of param to pass from request params
 */
export function Params(name?: string) {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * parameter decorator
 * @param name name of param to pass from request params as number
 */
export function NumParam(name: string, isFloat: boolean = false) {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * parameter decorator
 * @param name name of param to pass from request query
 */
export function Query(name?: string) {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * parameter decorator
 * @param name name of param to pass from request query as number
 */
export function NumQuery(name: string, isFloat: boolean = false) {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * parameter decorator
 * @param name name of param to pass from request query
 */
export function Headers(name?: string) {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
        }

        let routeDeclaration = meta.routes[key];
        if (routeDeclaration.params == null) {
            routeDeclaration.params = [];
        }

        routeDeclaration.params.push({
            index: index,
            name: name,
            type: ParameterType.HEADERS
        });
    };
}

/**
 * parameter decorator
 * @param name name of param to pass from request body
 */
export function Body(name?: string) {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * parameter decorator
 * parameter to pass express Response object as
 */
export function Response() {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * parameter decorator
 * parameter to pass express Request object as
 */
export function Request() {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * parameter decorator
 * parameter to pass express next function as
 */
export function Next() {
    return (target: any, key: string, index: number) => {
        let meta = getMeta(target);
        if (meta.routes[key] == null) {
            meta.routes[key] = {} as IRouteDeclaration;
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

/**
 * function decorator
 * wraps express route method in try catch and will respond with error result message
 */
export function CatchAndSendError() {
    return (target: any, key: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any) {
            // if we do not have a response object we cannot handle the error
            let res: Response = null;
            for (let arg of args) {
                if (arg instanceof ServerResponse) {
                    res = arg as Response;
                    break;
                }
            }

            try {
                let value = originalMethod.apply(this, args);
                if (value != null && value.catch != null) {
                    value.catch((err: Error) => {
                        if (res != null) {
                            res.status(400).json({ error: err.message });
                        } else {
                            // throw and let default handler handle this
                            throw err;
                        }
                    });
                }
            } catch (ex) {
                if (res != null) {
                    res.status(400).json({ error: ex.message || 'an error has occurred processing request' });
                } else {
                    // throw and let default handler handle this
                    throw ex;
                }
            }
        };
    };
}

/**
 * creates and registeres the given controller type with express
 * @param app express app or router instance
 * @param controller instance of your Express router class decorated with the @Controller attribute
 */
// tslint:disable-next-line:no-shadowed-variable
export function registerController(app: Application | Router, controller: any) {
    let meta = getMeta(controller);
    let router = Router();
    let url = meta.url;

    for (let methodName of Object.keys(meta.routes)) {
        let route = meta.routes[methodName];
        const routeHandler = (req: Request, res: Response, next: NextFunction) => {
            let args = getParameters(req, res, next, route.params);
            let handler = controller[methodName].apply(controller, args);

            return handler;
        };

        if (route.mw != null && route.mw.length > 0) {
            (router as any)[route.method].apply(router, [route.url, ...route.mw, routeHandler]);
        } else {
            (router as any)[route.method].apply(router, [route.url, routeHandler]);
        }
    }

    app.use(url, router as Application); // router as sub application, for some reason the type defs updated for v 4.17+ and must cast to Application
}

function getParameters(req: Request, res: Response, next: NextFunction, params: IParameterDeclaration[]): any[] {
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
                args[pd.index] = pd.name != null ? (req.params[pd.name] != null ? req.params[pd.name] : null) : req.params;
                break;
            case ParameterType.NUM_PARAM:
                try {
                    let value = pd.isFloat ? parseFloat(req.params[pd.name]) : parseInt(req.params[pd.name], 10);
                    args[pd.index] = isNaN(value) === true ? null : value;
                } catch {
                    args[pd.index] = null;
                }
                break;
            case ParameterType.QUERY:
                args[pd.index] = pd.name != null ? (req.query[pd.name] != null ? req.query[pd.name] : null) : req.query;
                break;
            case ParameterType.NUM_QUERY:
                try {
                    let value = pd.isFloat ? parseFloat(req.query[pd.name]) : parseInt(req.query[pd.name], 10);
                    args[pd.index] = isNaN(value) === true ? null : value;
                } catch {
                    args[pd.index] = null;
                }
                break;
            case ParameterType.BODY:
                args[pd.index] = pd.name != null ? (req.body[pd.name] != null ? req.body[pd.name] : null) : req.body;
                break;
            case ParameterType.HEADERS:
                args[pd.index] = pd.name != null ? (req.headers[pd.name] != null ? req.headers[pd.name] : null) : req.headers;
                break;
            default:
                args[pd.index] = null;
        }
    }

    return args;
}

function getMeta(target: any): { url: string, routes: { [key: string]: IRouteDeclaration } } {
    if (target.__express_meta__ == null) {
        target.__express_meta__ = {
            url: '',
            routes: {}
        };
    }

    return target.__express_meta__;
}