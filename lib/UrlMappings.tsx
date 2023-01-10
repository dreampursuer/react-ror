import {createHashRouter, RouterProvider} from "react-router-dom";
import {RouteComponent} from "./RouteComponent";
export interface ControllerMappingType{
    [key: string]: any
}

interface UrlMappingsProps{
    controllerMapping: ControllerMappingType
}

export default function UrlMappings({controllerMapping}: UrlMappingsProps){
    const router = createHashRouter([
        {
            path: "/:controller/:action",
            element: <RouteComponent controllerMapping={controllerMapping} />,
        },
        {
            path: "/:controller",
            element: <RouteComponent controllerMapping={controllerMapping} />,
        },
        {
            path: "/",
            element: <RouteComponent controllerMapping={controllerMapping} />,
        },
    ]);

    return (
        <RouterProvider router={router} />
    );
}