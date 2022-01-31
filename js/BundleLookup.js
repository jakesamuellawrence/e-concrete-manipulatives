/**
 * Usage: LookupTable[bundle_size](radius, x_0, y_0)
 * to get a list of all stick positions
 */
 export let positionLookup = {
    2: (r, x_0, y_0) => {return [
        {x: x_0 + 2*r, y: y_0}
    ]},
    3: (r, x_0, y_0) => {return [
        {x: x_0 + 2*r, y: y_0},
        {x: x_0 + r, y: y_0 + Math.sqrt(3) * r}
    ]},
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
    ]},
    6: (r, x_0, y_0) => {return [
        {x: x_0 + 2*r, y: y_0},
        {x: x_0 - 2*r*Math.cos(toRad(60)), y: y_0 + 2*r*Math.sin(toRad(60))},
        {x: x_0 + 2*r + 2*r*Math.cos(toRad(60)), y: y_0 + 2*r*Math.sin(toRad(60))},
        {x: x_0, y: y_0 + 4*r*Math.sin(toRad(60))},
        {x: x_0 + 2*r, y: y_0 + 4*r*Math.sin(toRad(60))}
    ]},
    7: (r, x_0, y_0) => {return [
        {x: x_0, y: y_0 + 2*r}, 
        {x: x_0, y: y_0 - 2*r}, 
        {x: x_0 - Math.sqrt(3)*r, y: y_0 + r}, 
        {x: x_0 - Math.sqrt(3)*r, y: y_0 - r}, 
        {x: x_0 + Math.sqrt(3)*r, y: y_0 - r}, 
        {x: x_0 + Math.sqrt(3)*r, y: y_0 + r}
    ]},
    8: (r, x_0, y_0) => {return [
        {x: x_0 + 2*r, y: y_0}, 
        {x: x_0 - 2*r*Math.cos(toRad(360/7)), y: y_0 + 2*r*Math.sin(toRad(360/7))},
        {x: x_0 + 2*r + 2*r*Math.cos(toRad(360/7)), y: y_0 + 2*r*Math.sin(toRad(360/7))},
        {x: x_0 + r, y: y_0 + r/Math.tan(toRad(360/14))},
        {x: x_0 + r, y: y_0 + r/Math.tan(toRad(360/28))},
        {x: x_0 + r - 2*r*Math.cos(toRad(180/7)), y: y_0 + r/Math.tan(toRad(360/28)) - 2*r*Math.sin(toRad(180/7))},
        {x: x_0 + r + 2*r*Math.cos(toRad(180/7)), y: y_0 + r/Math.tan(toRad(360/28)) - 2*r*Math.sin(toRad(180/7))}
    ]},
    9: (r, x_0, y_0) => {return [
        {x: x_0, y: y_0 + 2*r}, 
        {x: x_0, y: y_0 + 4*r}, 
        {x: x_0 + 2*r, y: y_0}, 
        {x: x_0 + 2*r, y: y_0 + 2*r}, 
        {x: x_0 + 2*r, y: y_0 + 4*r}, 
        {x: x_0 + 4*r, y: y_0}, 
        {x: x_0 + 4*r, y: y_0 + 2*r},
        {x: x_0 + 4*r, y: y_0 + 4*r}
    ]},
};

export let radiusLookup = {
    2: (r) => {return 2*r},
    3: (r) => {return Math.sqrt(Math.pow(2*r, 2) - Math.pow(r, 2)) + r - Math.sqrt(Math.pow(2*r, 2) - Math.pow(r, 2))/3},
    4: (r) => {return r/Math.cos(toRad(45)) + r},
    5: (r) => {return r/Math.sin(toRad(36)) + r},
    6: (r) => {return 3*r},
    7: (r) => {return 3*r},
    8: (r) => {return r / Math.cos(toRad(30))},
    9: (r) => {return Math.sqrt(8)*r+r},
}

export let centerLookup = {
    2: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0}},
    3: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + Math.sqrt(3)*r/3}},
    4: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r}},
    5: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r / Math.tan(toRad(36))}},
    6: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r/Math.tan(toRad(30))}},
    7: (r, x_0, y_0) => {return {x: x_0, y: y_0}},
    8: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r/Math.tan(toRad(360/14))}},
    9: (r, x_0, y_0) => {return {x: x_0 + 2*r, y: y_0 + 2*r}}
}

function toRad(degrees) {
    return degrees * (Math.PI / 180)
}