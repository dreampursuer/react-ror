import {createHashRouter, RouterProvider} from "react-router-dom";
import {Controller} from "./Controller";
import {ErrorPageType} from "./ErrorPage";
import {Router as RemixRouter} from "@remix-run/router/dist/router";
import {LayoutManager} from "./LayoutManager";

export interface ControllerMappingType{
    [key: string]: any
}

export type LayoutMappingType = {
    [key: string]: any
}

export type OnCheckType = (params?:any)=>boolean;

interface ReactRorAppProps{
    controllerMapping: ControllerMappingType
    layoutMapping: LayoutMappingType
    onError?: ErrorPageType
    router?: RemixRouter
    onCheck?: OnCheckType
}

export default function ReactRorApp({controllerMapping, router, onError, layoutMapping, onCheck}: ReactRorAppProps){
    let rt = router
    if (!rt){
        rt = createHashRouter([
            {
                element: <LayoutManager layoutMapping={layoutMapping}/>,
                children:[
                    {
                        path: "/:controller?/:action?/:id?",
                        element: <Controller controllerMapping={controllerMapping} onError={onError} onCheck={onCheck} />,
                    },
                ]
            },
        ]);
    }

    return (
        <RouterProvider router={rt} />
    );
}