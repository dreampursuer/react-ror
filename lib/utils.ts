/**
 * Redirect to the specified #controller/action
 * @param {string} controller
 * @param {string} action
 * @param params
 */
export function redirect(controller: string, action: string, params?: any){
    let url = buildUrl(controller, action, params)
    const newHref = '#' + url
    const currentHref = window.location.hash
    if (newHref === currentHref){
        // No change in address, then reload directly
        window.location.reload()
    }
    else{
        window.location.hash = newHref
    }
}

/**
 * build url by controller/action/params
 * @param {string} controller
 * @param {string} action
 * @param params Map
 */
function buildUrl(controller: string, action: string, params?: any){
    let url = "/" + controller + "/" + action
    if (params){
        params = buildParams(params)
        if (params){
            url += "?" + params
        }
    }
    return url
}

/**
 * Converting object parameters to the parameter type in the URL
 * @param params
 * @param nameMap Map of parameter key.For example, in params there is: {details:xxx},
 * but we want to change the name of the details to jqGrid when sending to the server,
 * then just define in the nameMap: {details:'jqGrid'}, so that the parameters sent to the server
 * will be jqGrid=xxx
 */
function buildParams(params: any, nameMap?: any){
    let paramsArray = [];
    for (let key of Object.keys(params)) {
        let value = params[key];
        if (value != null){
            if (typeof value === "object"){
                value = JSON.stringify(value)
            }
            let keyMapped = null
            if (nameMap){
                keyMapped = nameMap[key]
            }
            if (keyMapped){
                key = keyMapped
            }
            paramsArray.push(key + '=' + encodeURIComponent(value));
        }
    }
    if (paramsArray.length > 0){
        return paramsArray.join('&');
    }
    return "";
}