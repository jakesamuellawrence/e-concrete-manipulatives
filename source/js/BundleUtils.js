import { Group, TorusGeometry } from "three";
import { Object3D } from "three";
import { App } from "./App";
import { BundleErrType } from "./BundleErrType";
import * as Utils from "./Utils";
import * as LookupTable from "./BundleLookup";
import { Mesh } from "three";
import { Vector3 } from "three";
import { MeshBasicMaterial } from "three";

/**
 * @param {App} app
 * @param {Array<Object3D>} toBundle 
 * @returns 
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
 * 
 * @param {App} app 
 * @param {Array<Object3D>} toBundle 
 */
export function bundleSticks(app, toBundle) {
    if (toBundle.length == 0) return;

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

    console.log(positions);

    // Move sticks into position
    for (let i = 1; i < toBundle.length; i++) {
        toBundle[i].position.set(
            positions[i-1].x,
            positions[i-1].y,
            toBundle[0].position.z
        );
    }

    // attach sticks to bundle
    for (let stick of toBundle) {
        bundle.attach(stick);
    }

    // Deselect sticks
    while (app.selectControls.currentlySelected.length > 0) {
        app.selectControls.deselect(app.selectControls.currentlySelected[0]);
    }

    app.scene.add(bundle);
}

/**
 * 
 * @param {App} app 
 * @param {Array<Object3D>} toRemove 
 */
export function removeSticks(app, toRemove) {
    for (let object of toRemove) {
        Utils.removeAllChildrenFromList(object, app.sticksInScene);
        app.scene.remove(object);
    }
    while (app.selectControls.currentlySelected.length > 0) {
        app.selectControls.deselect(toRemove[0]);
    }
    app.updateSticksInTotal();
}

/**
 * 
 * @param {App} app 
 * @param {Array<Object3D>} toUnbundle 
 */
export function unbundleSticks(app, toUnbundle) {
    let sticksToRespawn = 0;
    for (let i = 0; i < toUnbundle.length; i++) {
        console.log(i);
        if (toUnbundle[i].type == "Group") {
            let sticksBefore = app.sticksInScene.length;
            Utils.removeAllChildrenFromList(toUnbundle[i], app.sticksInScene);
            app.scene.remove(toUnbundle[i])
            sticksToRespawn += (sticksBefore - app.sticksInScene.length);
        }
    }
    app.spawnSticks(sticksToRespawn);
    while (app.selectControls.currentlySelected.length > 0) {
        console.log("deselecting");
        app.selectControls.deselect(toUnbundle[0]);
    }
}