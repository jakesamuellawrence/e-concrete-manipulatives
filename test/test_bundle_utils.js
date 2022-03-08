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

    describe("bundleSticks()", function() {
        it("should not return null when given a list of sticks", function() {
            app.sticksInABundle = 5;
            let sticks = app.spawnSticks(5);
            let group = BundleUtils.bundleSticks(app, sticks);

            expect(group).to.not.be.null;
        });

        it("should return null when given an empty list", function() {
            let group = BundleUtils.bundleSticks(app, []);
            expect(group).to.be.null;
        });

        it ("should return null when not given a toBundle parameter", function() {
            let group = BundleUtils.bundleSticks(app);
            expect(group).to.be.null;
        });

        it("should not change the number of sticks in the scene", function() {
            app.spawnSticks(10);
            let sticksToBundle = app.spawnSticks(5);
            app.sticksInABundle = 5;
            
            let sticksBefore = app.sticksInScene;
            BundleUtils.bundleSticks(app, sticksToBundle);
            let sticksAfter = app.sticksInScene;

            expect(sticksBefore).to.equal(sticksAfter);
        });

        it("should return an object with type == 'Group' when given a list of sticks", function() {
            app.sticksInABundle = 10;
            let sticksToBundle = app.spawnSticks(10);
            
            let bundle = BundleUtils.bundleSticks(app, sticksToBundle);

            expect(bundle.type).to.equal("Group");
        });
    });

    describe("removeSticks()", function() {
        it("should decrease the number of sticks in the scene by the size of the list given when given just sticks", function() {
            app.spawnSticks(10);
            let sticksToRemove = app.spawnSticks(5);

            let sticksBefore = app.sticksInScene.length;
            BundleUtils.removeSticks(app, sticksToRemove);
            let sticksAfter = app.sticksInScene.length;

            expect(sticksAfter).to.equal(sticksBefore - 5);
        });

        it("should decrease the number of sticks in the scene by the size of the bundle when given a bundle", function() {
            app.spawnSticks(13);
            let sticksToBundle = app.spawnSticks(12);
            app.sticksInABundle = 12;
            let bundle = BundleUtils.bundleSticks(app, sticksToBundle);

            let sticksBefore = app.sticksInScene.length;
            BundleUtils.removeSticks(app, [bundle]);
            let sticksAfter = app.sticksInScene.length;

            expect(sticksAfter).to.equal(sticksBefore - 12);
        })
    });

    describe("unbundleSticks", function() {
        it("should not change the number of sticks in the scene when given loose sticks", function() {
            app.spawnSticks(2);
            let looseSticks = app.spawnSticks(8);

            let sticksBefore = app.sticksInScene.length;
            BundleUtils.unbundleSticks(app, looseSticks);
            let sticksAfter = app.sticksInScene.length;

            expect(sticksBefore).to.equal(sticksAfter);
        });

        it("should not change the number of sticks in the scene when given a bundle", function() {
            app.spawnSticks(2);
            let sticksToBundle = app.spawnSticks(8);
            app.sticksInABundle = 8;
            let bundle = BundleUtils.bundleSticks(app, sticksToBundle);

            let sticksBefore = app.sticksInScene.length;
            BundleUtils.unbundleSticks(app, [bundle]);
            let sticksAfter = app.sticksInScene.length;

            expect(sticksBefore).to.equal(sticksAfter);
        });

        it("should not change the number of sticks in the scene when given a bundle and loose sticks", function() {
            app.spawnSticks(2);
            let sticksToBundle = app.spawnSticks(8);
            app.sticksInABundle = 8;
            let bundle = BundleUtils.bundleSticks(app, sticksToBundle);
            let extraSticks = app.spawnSticks(10);

            let sticksBefore = app.sticksInScene.length;
            BundleUtils.unbundleSticks(app, [bundle].concat(extraSticks));
            let sticksAfter = app.sticksInScene.length;

            expect(sticksBefore).to.equal(sticksAfter);
        });
    });
});