import {createHashRouter, RouterProvider} from "react-router-dom";
import {RouteComponent} from "./RouteComponent";
import {ReactElement, ReactNode} from "react";
import {ErrorElementProps, ErrorElementType} from "./ErrorElement";

export interface ControllerMappingType{
    [key: string]: any
}

interface UrlMappingsProps{
    controllerMapping: ControllerMappingType
    onError?: ErrorElementType
}

export default function UrlMappings({controllerMapping, onError}: UrlMappingsProps){
    const router = createHashRouter([
        {
            path: "/:controller/:action",
            element: <RouteComponent controllerMapping={controllerMapping} onError={onError} />,
        },
        {
            path: "/:controller",
            element: <RouteComponent controllerMapping={controllerMapping} onError={onError} />,
        },
        {
            path: "/",
            element: <RouteComponent controllerMapping={controllerMapping} onError={onError} />,
        },
    ]);

    return (
        <RouterProvider router={router} />
    );
}