"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const RouteComponent_1 = require("./RouteComponent");
function UrlMappings({ controllerMapping }) {
    const router = (0, react_router_dom_1.createHashRouter)([
        {
            path: "/:controller/:action",
            element: <RouteComponent_1.RouteComponent controllerMapping={controllerMapping}/>,
        },
        {
            path: "/:controller",
            element: <RouteComponent_1.RouteComponent controllerMapping={controllerMapping}/>,
        },
        {
            path: "/",
            element: <RouteComponent_1.RouteComponent controllerMapping={controllerMapping}/>,
        },
    ]);
    return (<react_router_dom_1.RouterProvider router={router}/>);
}
exports.default = UrlMappings;
