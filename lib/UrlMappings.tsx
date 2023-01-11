import {createHashRouter, RouterProvider} from "react-router-dom";
import {RouteComponent} from "./RouteComponent";
import {ReactElement, ReactNode} from "react";
import {ErrorElementProps, ErrorElementType} from "./ErrorElement";

export interface ControllerMappingType{
    [key: string]: any
}

interface UrlMappingsProps{
    controllerMapping: ControllerMappingType
    errorElement?: ErrorElementType
}

export default function UrlMappings({controllerMapping, errorElement}: UrlMappingsProps){
    const router = createHashRouter([
        {
            path: "/:controller/:action",
            element: <RouteComponent controllerMapping={controllerMapping} errorElement={errorElement} />,
        },
        {
            path: "/:controller",
            element: <RouteComponent controllerMapping={controllerMapping} errorElement={errorElement} />,
        },
        {
            path: "/",
            element: <RouteComponent controllerMapping={controllerMapping} errorElement={errorElement} />,
        },
    ]);

    return (
        <RouterProvider router={router} />
    );
}