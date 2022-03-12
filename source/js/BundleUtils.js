import { Group, TorusGeometry } from "three";
import { Object3D } from "three";
import { App } from "./App";
import { BundleErrType } from "./BundleErrType";
import * as Utils from "./Utils";
import * as LookupTable from "./BundleLookup";
import { Mesh } from "three";
import { MeshBasicMaterial } from "three";
import { Vector3 } from "three";

/**
 * Checks whether a given list of sticks would be able to be bundled
 * @param {App} app the app context
 * @param {Array<Object3D>} toBundle the list to check 
 * @returns {BundleErrType} the reason the list cannot be bundled
 */
export function canBundle(app, toBundle) {
    if (toBundle.length == 0) {
        return BundleErrType.NONE_SELECTED;
    }
    let allSameOrder = toBundle.every((object) => object.order == toBundle[0].order);
    if (!allSameOrder) {
        return BundleErrType.DIFF_TYPES
    }
    if (toBundle.length > app.sticksInABundle) {
        return BundleErrType.TOO_MANY;
    }
    if (toBundle.length < app.sticksInABundle) {
        return BundleErrType.TOO_FEW;
    }
    return null;
}

/**
 * Bundles the given list of sticks together into a Group object
 * Adds a band around the bundle
 * @param {App} app the app context
 * @param {Array<Object3D>} toBundle the sticks to be bundled
 * @return {Group} the resulting bundle
 */
export function bundleSticks(app, toBundle) {
    if (!toBundle) return null;
    if (toBundle.length == 0) return null;

    // Setup bundle object
    let bundle = new Group();
    bundle.order = toBundle[0].order + 1;
    let base = app.sticksInABundle;
    bundle.radius = LookupTable.radiusLookup[base](toBundle[0].radius);
    let bundleCenter = LookupTable.centerLookup[base](
        toBundle[0].radius,
        toBundle[0].position.x,
        toBundle[0].position.y
    );
    bundle.position.set(
        bundleCenter.x,
        bundleCenter.y,
        toBundle[0].position.z
    );

    // Get list of stick positions for bundle
    const positions = LookupTable.positionLookup[base](
        toBundle[0].radius,
        toBundle[0].position.x,
        toBundle[0].position.y
    );

    // Make torus for ribbon
    let bundleColours = [0xffff00, 0xff9900, 0xff0000];
    let torusColour = bundleColours[(bundle.order-1) % bundleColours.length];
    const torus = new Mesh(
        new TorusGeometry(bundle.radius, 0.005, 16, 100),
        new MeshBasicMaterial({color: torusColour})
    );
    torus.position.copy(bundle.position);
    bundle.attach(torus);

    // Move sticks into position
    for (let i = 0; i < toBundle.length; i++) {
        // subtract bundle centre because desiredPosition must be relative to parent
        toBundle[i].desiredPosition = new Vector3(positions[i].x, positions[i].y, bundle.position.z).sub(bundle.position);
    }

    // attach sticks to bundle
    for (let stick of toBundle) {
        bundle.attach(stick);
    }

    app.scene.add(bundle);

    return bundle;
}

/**
 * Removes the given list of sticks and bundles from the scene, including
 * any children of any bundles
 * @param {App} app the app context
 * @param {Array<Object3D>} toRemove the list of objects to remove
 */
export function removeSticks(app, toRemove) {
    for (let object of toRemove) {
        Utils.removeAllChildrenFromList(object, app.sticksInScene);
        app.scene.remove(object);
    }

}

/**
 * Unbundles any bundles in the provided list.
 * Does this by removing the bundle and spawning however many sticks where in it
 * @param {App} app the app context
 * @param {Array<Object3D>} toUnbundle the list of objects to try to unbundle
 */
export function unbundleSticks(app, toUnbundle) {
    for (let object of toUnbundle) {
        if (object.type == "Group") {
            let flattened = Utils.flattenBundle(object);
            let newSticks = app.spawnSticks(flattened.length);

            // put the new sticks where the old ones were and set them to move towards where they spawned
            for (let i = 0; i < flattened.length; i++) {
                newSticks[i].desiredPosition = newSticks[i].position.clone();
                newSticks[i].position.copy(object.position.add(flattened[i].position));
            }

            removeSticks(app, [object]);
        }
    }
}