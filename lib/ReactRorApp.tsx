import {createHashRouter, RouterProvider} from "react-router-dom";
import {Controller} from "./Controller";
import {ErrorPageType} from "./ErrorPage";
import {Router as RemixRouter} from "@remix-run/router/dist/router";

export interface ControllerMappingType{
    [key: string]: any
}

interface ReactRorAppProps{
    controllerMapping: ControllerMappingType
    onError?: ErrorPageType
    router?: RemixRouter
}

export default function ReactRorApp({controllerMapping, router, onError}: ReactRorAppProps){
    let rt = router
    if (!rt){
        rt = createHashRouter([
            {
                path: "/:controller?/:action?/:id?",
                element: <Controller controllerMapping={controllerMapping} onError={onError} />,
            },
        ]);
    }

    return (
        <RouterProvider router={rt} />
    );
}