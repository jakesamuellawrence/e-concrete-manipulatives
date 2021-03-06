import { Object3D, Vector3 } from 'three';

/**
 * extracts the stick colour from the url, if present
 * if not, uses default colour
 * @returns {string} the extracted colour
 */
export function getColourFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    if(/^[0-9A-F]{6}$/i.test(urlParams.getAll('c'))){ //if c parameter valid hex colour
        return "#" + urlParams.getAll('c');        
    } else {
        return "#8C5D41"; //default colour
    }
}

/**
 * Constructs a link to preserve settings
 * @param {string} stickColour The hex string representing the set colour
 * @returns {string} The link containing the given colour
 */
export function constructLink(stickColour){
    return window.location.origin + "?c=" + stickColour.replace("#",'');
}

/**
 * Follows the trail of parents until it finds the largest non-scene
 * group that the given object is a child of
 * 
 * @param {Object3D} object the object to find the group of
 * @returns the largest non-scene object that the given object is a child of
 */
 export function getLargestGroup(object) {
    if (object == null) return null;
    while (object.parent != null &&
           (object.parent.type == "Object3D" ||
            object.parent.type == "Group")) {
        object = object.parent;
    }
    return object
};

/**
 * Sets the highlight colour of given object and all it's children
 * to given colour, if they have a highlight colour
 * 
 * @param {Object3D} root the root object to set the emmissive of
 * @param {Color} value the color to set the emmissive to
 */
export function setEmissiveAllChildren(root, value) {
    if (root.material != null && root.material.emissive != null) {
        root.material.emissive.set(value);
    }
    if (root.children) {
        for (let child of root.children) {
            setEmissiveAllChildren(child, value);
        }
    }
}

/**
 * Removes the given element from the given list, if it is present in it
 * @param {any} element the element to be removed
 * @param {Array<any>} list the list to remove the element from
 */
export function removeFromList(element, list) {
    let index = list.indexOf(element);
    if (index >= 0) {
        list.splice(index, 1);
    }
}

/**
 * Recursively removes all leaf children of the given object from the given list
 * @param {Object3D} object the object to remove the children of
 * @param {Array<Object3D>} list the list that the children should be removed from
 */
export function removeAllChildrenFromList(object, list){
    if (object.children.length > 0){
        for (let child of object.children) {
            removeAllChildrenFromList(child, list);
        }
    } else {
        removeFromList(object, list);
    }
}

/**
 * Recursively creates a list of all children of a given group, if they are sticks.
 * Note this will only ever return a list of the leaf nodes of the tree of the children of object
 * @param {Object3D} object the group that should be flattened
 * @return {Array<Object3D>} the list of leaf children
 */
export function flattenBundle(object) {
    if (object.children.length > 0) {
        let listOfSticks = []
        for (let child of object.children) {
            listOfSticks = listOfSticks.concat(flattenBundle(child));
        }
        return listOfSticks
    } else {
        if (object.geometry.type == "CylinderGeometry") { // only count sticks
            return [object]
        } else {
            return []
        }
    }
}

/**
 * Recursively flattens the whole hierarchy of object children and returns it as a list, 
 * including the parent and any intermediary parents
 * @param {Object3D} object the object to flatten
 * @return {Array<Object3D>} the list of the object and all children
 */
export function flattenObject(object) {
    let listOfObjects = [object]
    for (let child of object.children) {
        listOfObjects = listOfObjects.concat(flattenObject(child));
    }
    return listOfObjects
}

/**
 * Checks if two vectors are nearly equal, i.e. is the distance between them < epsilon
 * @param {Vector3} v1 the left of the comparison
 * @param {Vector3} v2 the right of the comparison
 * @param {number} epsilon the number the difference must be less than
 * @return {boolean} whether or not v1 and v2 are approximately equal
 */
export function vecsNearlyEqual(v1, v2, epsilon=0.0001) {
    let distance = v1.clone().sub(v2).length();
    return distance < epsilon;
}

/**
 * returns a random element from the given array
 * @param {Array<T>} array list from which to pick a random element
 * @returns {T} the randomly chosen element
 */
export function randomElementFromArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * Generates a vector pointing in a random direction with length randomly chosen between the given range
 * @param {number} minLength the minimum length the vector should be
 * @param {number} maxLength the maxmimum length the vector should be
 * @returns {Vector3} the generated vector
 */
export function randomVector(minLength, maxLength) {
    let vec = new Vector3(Math.random()-0.5, Math.random-0.5, Math.random()-0.5).normalize();
    let randLength = Math.random() * (maxLength - minLength) + minLength;
    return vec.multiplyScalar(randLength);
}
/*
 * Displays message box on screen
 * @param {Document} document the HTML document object
 * @param {string} message the message to be displayed
 */
 export function displayMessage(document, message) {
    document.getElementById("alertMessage").innerText = message;
    document.getElementById("alertBox").style.display = "inline-block";
    let msgTimeout = setTimeout(function(){document.getElementById("alertBox").style.display = "none";},5000)
}
