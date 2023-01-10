"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteComponent = void 0;
const react_router_dom_1 = require("react-router-dom");
function isInstanced(obj) {
    const type = typeof obj;
    if (type === "object") {
        return true;
    }
    return false;
}
function RouteComponent({ controllerMapping }) {
    const params = (0, react_router_dom_1.useParams)();
    let controllerName = params.controller;
    if (!controllerName) {
        controllerName = "main";
    }
    let actionName = params.action;
    if (!actionName) {
        actionName = "index";
    }
    let controller = controllerMapping[controllerName];
    if (!isInstanced(controller)) {
        controller = Reflect.construct(controller, []);
        controllerMapping[controllerName] = controller;
    }
    const result = controller[actionName]();
    return result;
}
exports.RouteComponent = RouteComponent;
