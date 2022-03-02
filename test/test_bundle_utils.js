import { expect } from "chai";
import { Scene, Vector3 } from "three";
import { App } from "../source/js/App";
import { BundleErrType } from "../source/js/BundleErrType";
import * as BundleUtils from "../source/js/BundleUtils";
import { StickSpawner } from "../source/js/StickSpawner";

let app = new App();

describe("BundleUtils", function() {
    beforeEach("Make mock app context", function() {
        app = new App();
        app.scene = new Scene();
        app.stickSpawner = new StickSpawner(app.scene, new Vector3(0, 0, 0), "#000000");
        app.sticksInABundle = 5;
    });

    describe("canBundle()", function() {
        it("should return NONE_SELECTED if the list is empty", function() {
            let testList = []
            let err = BundleUtils.canBundle(app, testList);
            expect(err).to.equal(BundleErrType.NONE_SELECTED);
        });

        it("should return TOO_MANY if list is bigger than SticksInABundle", function() {
            let testList = app.spawnSticks(6);
            app.sticksInABundle = 5;

            let err = BundleUtils.canBundle(app, testList);

            expect(err).to.equal(BundleErrType.TOO_MANY);
        });

        it("should return TOO_FEW if list is smaller than SticksInABundle", function() {
            let testList = app.spawnSticks(4);
            app.sticksInABundle = 5;

            let err = BundleUtils.canBundle(app, testList);

            expect(err).to.equal(BundleErrType.TOO_FEW);
        });

        it("should return DIFF_TYPES when checked with stick and bundle", function() {
            app.sticksInABundle = 2;
            let stick = app.spawnStick();
            let sticksToBundle = app.spawnSticks(2);
            let bundle = BundleUtils.bundleSticks(app, sticksToBundle);

            let err = BundleUtils.canBundle(app, [stick, bundle]);

            expect(err).to.equal(BundleErrType.DIFF_TYPES);
        });

        it("should return DIFF_TYPES when checked with bundles or order 1 and 2", function() {
            app.sticksInABundle = 2;
            let bundle1 = BundleUtils.bundleSticks(app, app.spawnSticks(2));
            let bundle2 = BundleUtils.bundleSticks(app, app.spawnSticks(2));
            let bundle3 = BundleUtils.bundleSticks(app, app.spawnSticks(2));
            let bundleOfBundles = BundleUtils.bundleSticks(app, [bundle2, bundle3]);

            let err = BundleUtils.canBundle(app, [bundle1, bundleOfBundles]);

            expect(err).to.equal(BundleErrType.DIFF_TYPES);
        });

        it("should return null when checked with the right number of sticks", function() {
            app.sticksInABundle = 12;
            let sticks = app.spawnSticks(12);

            let err = BundleUtils.canBundle(app, sticks);

            expect(err).is.null;
        });

        it("should return null when checked with the right number of bundles", function() {
            app.sticksInABundle = 3;
            let bundle1 = BundleUtils.bundleSticks(app, app.spawnSticks(3));
            let bundle2 = BundleUtils.bundleSticks(app, app.spawnSticks(3));
            let bundle3 = BundleUtils.bundleSticks(app, app.spawnSticks(3));

            let err = BundleUtils.canBundle(app, [bundle1, bundle2, bundle3]);

            expect(err).is.null;
        });
    });
});