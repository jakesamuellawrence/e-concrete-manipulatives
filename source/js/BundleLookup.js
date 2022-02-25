/**
 * dictionary for looking up the positions sticks should take when put into a bundle
 * of a given size
 * 
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
        {x: x_0 + 4*r*Math.sin(toRad(36)), y: y_0},
        {x: x_0 + 2*r*Math.sin(toRad(36)), y: y_0 + 2*r*Math.cos(toRad(36))},
        {x: x_0 + 2*r*Math.sin(toRad(36)), y: y_0 + 2*r*Math.cos(toRad(36)) + 2*r},
        {x: x_0 + 4*r*Math.sin(toRad(36)) + 2.3511*r*Math.cos(toRad(72)), y: y_0 + 2.3511*r*Math.sin(toRad(72))},
        {x: x_0 - 2.3511*r*Math.cos(toRad(72)), y: y_0 + 2.3511*r*Math.sin(toRad(72))},
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
    10: (r, x_0, y_0) => {return [
        {x: x_0 + 2*r, y: y_0},
        {x: x_0 + r, y: y_0 + Math.sqrt(3)*r},
        {x: x_0 + r, y: y_0 + Math.sqrt(3)*r + 2*r},
        {x: x_0 - 2*r*Math.cos(toRad(41.647)), y: y_0 + 2*r*Math.sin(toRad(41.647))},
        {x: x_0 + 2*r + 2*r*Math.cos(toRad(41.647)), y: y_0 + 2*r*Math.sin(toRad(41.647))},
        
        {x: x_0 - 2*r*Math.cos(toRad(41.647)) - 2*r*Math.cos(toRad(83.294)), y: y_0 + 2*r*Math.sin(toRad(41.647)) + 2*r*Math.sin(toRad(83.294))},
        {x: x_0 + 2*r + 2*r*Math.cos(toRad(41.647)) + 2*r*Math.cos(toRad(83.294)), y: y_0 + 2*r*Math.sin(toRad(41.647)) + 2*r*Math.sin(toRad(83.294))},
                    
        {x: x_0 - 2*r*Math.cos(toRad(41.647)) - 2*r*Math.cos(toRad(83.294)) + 2*r*Math.cos(toRad(55.059)), y: y_0 + 2*r*Math.sin(toRad(41.647)) + 2*r*Math.sin(toRad(83.294)) + 2*r*Math.sin(toRad(55.059))},
        {x: x_0 + 2*r + 2*r*Math.cos(toRad(41.647)) + 2*r*Math.cos(toRad(83.294)) - 2*r*Math.cos(toRad(55.059)), y: y_0 + 2*r*Math.sin(toRad(41.647)) + 2*r*Math.sin(toRad(83.294)) + 2*r*Math.sin(toRad(55.059))},                   
    ]},
    11: (r, x_0, y_0) => {return [
        {x: x_0 + 4*r*Math.cos(toRad(20)), y: y_0},
        {x: x_0 + 2*r*Math.cos(toRad(20)), y: y_0 - 2*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70)) - Math.sqrt(3)*r)},
                    
        {x: x_0 + 2*r*Math.cos(toRad(20)) - r, y: y_0 - 2*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70)))},
        {x: x_0 + 2*r*Math.cos(toRad(20)) + r, y: y_0 - 2*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70)))},
                    
        {x: x_0 - r, y: y_0 - 4*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70)))},
        {x: x_0 + 4*r*Math.cos(toRad(20)) + r, y: y_0 - 4*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70)))},
                    
        {x: x_0 + 2*r*Math.cos(toRad(20)) - r - (r*Math.sin(toRad(80))/Math.sin(toRad(50)))* Math.tan(toRad(50)), y: y_0 - 2*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70))) + r*Math.sin(toRad(80))/Math.sin(toRad(50))},
        {x: x_0 + 2*r*Math.cos(toRad(20)) + r + (r*Math.sin(toRad(80))/Math.sin(toRad(50)))* Math.tan(toRad(50)), y: y_0 - 2*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70))) + r*Math.sin(toRad(80))/Math.sin(toRad(50))},
                    
        {x: x_0 + 2*r*Math.cos(toRad(20)) - r , y: y_0 - 2*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70))) + 2*r*Math.sin(toRad(80))/Math.sin(toRad(50))},
        {x: x_0 + 2*r*Math.cos(toRad(20)) + r , y: y_0 - 2*r*Math.sin(toRad(20)) + (r*Math.tan(toRad(70)) - 2*r*Math.sin(toRad(80))/Math.sin(toRad(50)) + r/Math.cos(toRad(70))) + 2*r*Math.sin(toRad(80))/Math.sin(toRad(50))}
    ]},
    12: (r, x_0, y_0) => {return [
        {x: x_0 + 4*r*Math.sin(toRad(33.644)), y: y_0},
        {x: x_0 + 2*r*Math.sin(toRad(33.644)), y: y_0 + 2*r*Math.cos(toRad(33.644))},
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) - 2*r*Math.cos(toRad(60)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60))},
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) + 2*r*Math.cos(toRad(60)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60))},
                    
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) - 2*r*Math.cos(toRad(60)) - r*2.648309*Math.cos(toRad(52.185)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60)) - r*2.648309*Math.sin(toRad(52.185))},
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) + 2*r*Math.cos(toRad(60)) + r*2.648309*Math.cos(toRad(52.185)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60)) - r*2.648309*Math.sin(toRad(52.185))},
                    
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) - 2*r*Math.cos(toRad(60)) - r*2.648309*Math.cos(toRad(52.185)) - 2*r*Math.cos(toRad(79.274)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60)) - r*2.648309*Math.sin(toRad(52.185))+ 2*r*Math.sin(toRad(79.274))},
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) + 2*r*Math.cos(toRad(60)) + r*2.648309*Math.cos(toRad(52.185)) + 2*r*Math.cos(toRad(79.274)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60)) - r*2.648309*Math.sin(toRad(52.185))+ 2*r*Math.sin(toRad(79.274))},
                    
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) - 2*r*Math.cos(toRad(60)) - r*2.648309*Math.cos(toRad(52.185)) - 2*r*Math.cos(toRad(79.274)) + r*2.216095*Math.sin(toRad(30)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60)) - r*2.648309*Math.sin(toRad(52.185)) + 2*r*Math.sin(toRad(79.274)) + r*2.216095*Math.cos(toRad(30))},
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) + 2*r*Math.cos(toRad(60)) + r*2.648309*Math.cos(toRad(52.185)) + 2*r*Math.cos(toRad(79.274)) - r*2.216095*Math.sin(toRad(30)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60)) - r*2.648309*Math.sin(toRad(52.185))+ 2*r*Math.sin(toRad(79.274)) + r*2.216095*Math.cos(toRad(30))},
                    
        {x: x_0 + 2*r*Math.sin(toRad(33.644)) - 2*r*Math.cos(toRad(60)) - r*2.648309*Math.cos(toRad(52.185)) - 2*r*Math.cos(toRad(79.274)) + r*2.216095*Math.sin(toRad(30)) + 2*r*Math.sin(toRad(70.727)), y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60)) - r*2.648309*Math.sin(toRad(52.185)) + 2*r*Math.sin(toRad(79.274)) + r*2.216095*Math.cos(toRad(30)) + 2*r*Math.cos(toRad(70.727))},
    ]}
};

/**
 * dictionary for looking up the radius of a bundle given the number of sticks inside it
 */
export let radiusLookup = {
    2: (r) => {return 2*r},
    3: (r) => {return Math.sqrt(Math.pow(2*r, 2) - Math.pow(r, 2)) + r - Math.sqrt(Math.pow(2*r, 2) - Math.pow(r, 2))/3},
    4: (r) => {return r/Math.cos(toRad(45)) + r},
    5: (r) => {return r/Math.sin(toRad(36)) + r},
    6: (r) => {return 3*r},
    7: (r) => {return 3*r},
    8: (r) => {return r / Math.cos(toRad(30))},
    9: (r) => {return Math.sqrt(8)*r+r},
    10: (r) => {return 3.813*r},
    11: (r) => {return r * (1 + 1/Math.sin(Math.PI/9))},
    12: (r) => {return 4.029*r}
}

/**
 * dictionary for looking up where the centre of a bundle would be given how many sticks are in it
 */
export let centerLookup = {
    2: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0}},
    3: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + Math.sqrt(3)*r/3}},
    4: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r}},
    5: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r / Math.tan(toRad(36))}},
    6: (r, x_0, y_0) => {return {x: x_0 + 2*r*Math.sin(toRad(36)), y: y_0 + 2*r*Math.cos(toRad(36))}},
    7: (r, x_0, y_0) => {return {x: x_0, y: y_0}},
    8: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + r/Math.tan(toRad(360/14))}},
    9: (r, x_0, y_0) => {return {x: x_0 + 2*r, y: y_0 + 2*r}},
    10: (r, x_0, y_0) => {return {x: x_0 + r, y: y_0 + 2.65*r}},
    11: (r, x_0, y_0) => {return {x: x_0 + 2*r*Math.cos(toRad(20)), y: y_0 - 2*r*Math.sin(toRad(20)) + r/Math.cos(toRad(70))}},
    12: (r, x_0, y_0) => {return {x: x_0 + 2*r*Math.sin(toRad(33.644)) - 2*r*Math.cos(toRad(60)) + r, y: y_0 + 2*r*Math.cos(toRad(33.644)) + 2*r*Math.sin(toRad(60))- r*Math.tan(toRad(30))}}
}

/**
 * Converts an angle in degrees to radians
 * @param {number} degrees the angle in degrees
 * @returns the angle in radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180)
}