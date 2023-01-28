import {createHashRouter, RouterProvider} from "react-router-dom";
import {Controller} from "./Controller";
import {ErrorPage} from "./ErrorPage";
import {Router as RemixRouter} from "@remix-run/router/dist/router";
import {LayoutManager} from "./LayoutManager";
import {ReactElement} from "react";

export interface ControllerMappingType{
    [key: string]: any
}

export type LayoutMappingType = {
    [key: string]: any
}

export type AccessCheckType = (params?:any)=>boolean;

interface ReactRorAppProps{
    controllerMapping: ControllerMappingType
    layoutMapping: LayoutMappingType
    errorPage?: ReactElement
    router?: RemixRouter
    accessCheck?: AccessCheckType
    skipAccessCheck?: string[]
}

export default function ReactRorApp({controllerMapping, router, errorPage, layoutMapping, accessCheck, skipAccessCheck}: ReactRorAppProps){
    let rt = router
    if (!rt){
        let errorElement = <ErrorPage />;
        if (errorPage) {
            errorElement = errorPage;
        }
        rt = createHashRouter([
            {
                element: <LayoutManager layoutMapping={layoutMapping} />,
                errorElement: errorElement,
                children:[
                    {
                        path: "/:controller?/:action?/:id?",
                        element: <Controller controllerMapping={controllerMapping} accessCheck={accessCheck} skipAccessCheck={skipAccessCheck}/>,
                    },
                ]
            },
        ]);
    }

    return (
        <RouterProvider router={rt} />
    );
}