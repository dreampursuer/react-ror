import {LayoutMappingType} from "./ReactRorApp";
import {Outlet, useParams} from "react-router-dom";


type LayoutManagerProps = {
    layoutMapping: LayoutMappingType
}
export function LayoutManager({layoutMapping}: LayoutManagerProps){
    const params = useParams()

    let controllerName = params.controller;
    if (!controllerName){
        controllerName = "main";
    }
    let actionName = params.action;
    if (!actionName){
        actionName = "index";
    }

    const fullActionName = "/" + controllerName + "/" + actionName
    let layoutElement = layoutMapping[fullActionName]
    if (!layoutElement){
        layoutElement = layoutMapping["*"]
    }
    if (!layoutElement){
        layoutElement = <Outlet />
    }
    if (typeof layoutElement === 'function'){
        layoutElement = layoutElement()
    }

    return layoutElement
}

