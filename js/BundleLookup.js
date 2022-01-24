/**
 * Usage: LookupTable[bundle_size](radius, x_0, y_0)
 * to get a list of all stick positions
 */
export let positionLookup = {
    4: (r, x_0, y_0) => {return [
        {x: x_0 + 2*r, y: y_0},
        {x: x_0, y: y_0 + 2*r}, 
        {x: x_0 + 2*r, y: y_0 + 2*r}
    ]},
    5: (r, x_0, y_0) => {return [
        {x: x_0 + 2*r, y: y_0},
        {x: x_0 - 2*r*Math.cos(toRad(72)), y: y_0 + 2*r*Math.sin(toRad(72))},
        {x: x_0 + 2*r + 2*r*Math.cos(toRad(72)), y: y_0 + 2*r*Math.sin(toRad(72))},
        {x: x_0 + r, y: y_0 + r*Math.tan(toRad(72))}
    ]}
};

export let radiusLookup = {
    4: (r) => {return r/Math.cos(toRad(45)) + r},
    5: (r) => {return r/Math.sin(toRad(36)) + r}
}

export let centerLookup = {
    4: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r}},
    5: (r, x_0, y_0) => {return {x: start_x + r, y: y_0 + r / Math.tan(toRad(36))}}
}

function toRad(degrees) {
    return degrees * (Math.PI / 180)
}