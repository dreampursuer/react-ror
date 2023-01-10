import {createHashRouter, RouterProvider} from "react-router-dom";

export default function UrlMappings(){
    const router = createHashRouter([
        {
            path: "/:controller/:action",
            element: <RouteComponent />,
        },
        {
            path: "/:controller",
            element: <RouteComponent />,
        },
        {
            path: "/",
            element: <RouteComponent />,
        },
    ]);

    return (
        <RouterProvider router={router} />
    );
}