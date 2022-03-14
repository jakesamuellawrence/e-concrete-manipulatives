import { expect } from "chai";
import { Vector3 } from "three";
import { Scene } from "three";
import { App } from "../source/js/App";
import { StickSpawner } from "../source/js/StickSpawner";
import * as Utils from "../source/js/Utils";
import * as BundleUtils from "../source/js/BundleUtils";

let app = new App();

describe("App", function() {
    beforeEach("Make mock app context", function() {
        app = new App();
        app.scene = new Scene();
        app.stickSpawner = new StickSpawner(app.scene, new Vector3(0, 0, 0), "#000000");
        app.sticksInABundle = 5;
    });

    describe("setSticksInABundle()", function() {
        it("Should set the sticksInABundle value to be the value passed", function() {
            app.setSticksInABundle(7);

            expect(app.sticksInABundle).to.equal(7);
        });
    }); 

    describe("setStickColour()", function(){
        it("should set the stickColour field to be the value passed", function() {
            let colourToSet = "#FFFFFF";
            app.setStickColour(colourToSet);

            expect(app.stickColour).to.equal(colourToSet);
        });

        it("should set the stick spawner's colour field to the value given", function() {
            let colourToSet = "#FFFFFF";
            app.setStickColour(colourToSet);

            expect(app.stickSpawner.stickParameters.colour).to.equal(colourToSet);
        });
    });

    describe("spawnStick()", function() {
        it("should return the created stick", function() {
            let stick = app.spawnStick();
            expect(stick).to.not.be.undefined;
            expect(stick).to.not.be.null;
        });

        it("should add the new stick to the sticksInScene list", function() {
            let stick = app.spawnStick();
            expect(app.sticksInScene.includes(stick)).to.be.true;
        });

        it("should add the new stick to the scene", function() {
            let stick = app.spawnStick();
            expect(Utils.flattenObject(app.scene).includes(stick)).to.be.true;
        });
    });

    describe("spawnSticks()", function() {
        it("should return a list of sticks with length equal to the value passed", function() {
            let sticks = app.spawnSticks(10);

            expect(sticks).to.not.be.null;
            expect(sticks.length).to.equal(10);
            for (let stick of sticks) {
                expect(stick).to.not.be.null
            }
        });

        it("should add the created sticks to the sticksInScene list", function() {
            let sticks = app.spawnSticks(5);

            for (let stick of sticks) {
                expect(app.sticksInScene.includes(stick)).to.be.true;
            }
        });

        it("should add the created sticks to the scene", function() {
            let sticks = app.spawnSticks(5);

            for (let stick of sticks) {
                expect(Utils.flattenObject(app.scene).includes(stick)).to.be.true;
            }
        });
    });

    describe("calculatePossibleStickPositions()", function() {
        it("should return a list of 7 positions when 7 is passed", function() {
            let positions = app.calculatePossibleStickPositions(7);

            expect(positions.length).to.equal(7);
        })
    });

    describe("increaseSticksInABundle()", function() {
        it("should increase the sticksInABundle field by 1 if it's currently less than 12", function() {
            app.sticksInABundle = 5;
            
            let sticksInABundleBefore = app.sticksInABundle;
            app.increaseSticksInABundle();
            let sticksInABundleAfter = app.sticksInABundle;

            expect(sticksInABundleAfter).to.equal(sticksInABundleBefore+1);
        });

        it("should not increase the sticksInABundle field if it's currently 12", function() {
            app.sticksInABundle = 12;
            
            let sticksInABundleBefore = app.sticksInABundle;
            app.increaseSticksInABundle();
            let sticksInABundleAfter = app.sticksInABundle;

            expect(sticksInABundleAfter).to.equal(sticksInABundleBefore);
        });
    });

    describe("decreaseSticksInABundle", function() {
        it("should decrease the sticksInABundle field by 1 if it's currently more than 2", function() {
            app.sticksInABundle = 3;
            
            let sticksInABundleBefore = app.sticksInABundle;
            app.decreaseSticksInABundle();
            let sticksInABundleAfter = app.sticksInABundle;

            expect(sticksInABundleAfter).to.equal(sticksInABundleBefore-1);
        });

        it("should not decrease the sticksInABundle field if it's currently 2", function() {
            app.sticksInABundle = 2;
            
            let sticksInABundleBefore = app.sticksInABundle;
            app.decreaseSticksInABundle();
            let sticksInABundleAfter = app.sticksInABundle;

            expect(sticksInABundleAfter).to.equal(sticksInABundleBefore);
        });
    });

    describe("areThereBundles()", function() {
        it("should return true when a bundle has been made", function() {
            app.setSticksInABundle(7);
            let sticksToBundle = app.spawnSticks(7);
            BundleUtils.bundleSticks(app, sticksToBundle);

            expect(app.areThereBundles()).to.be.true;
        });

        it("should return false when there are no bundles", function() {
            app.spawnSticks(17);

            expect(app.areThereBundles()).to.be.false;
        });
    });

    describe("unbundleExistingBundles()", function() {
        it("should remove all the existing bundles when called", function() {
            let sticksToBundle = app.spawnSticks(5);
            BundleUtils.bundleSticks(app, sticksToBundle);

            app.unbundleExistingBundles();

            expect(app.areThereBundles()).to.be.false;
        });

        it("should not affect the number of sticks in the scene", function() {
            app.setSticksInABundle(11);
            let sticksToBundle = app.spawnSticks(11);
            BundleUtils.bundleSticks(app, sticksToBundle);

            let sticksBefore = app.sticksInScene.length;
            app.unbundleExistingBundles();
            let sticksAfter = app.sticksInScene.length;

            expect(sticksBefore).to.equal(sticksAfter);
        });
    });
});