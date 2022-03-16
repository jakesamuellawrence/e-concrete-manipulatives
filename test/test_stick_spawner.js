import { assert, expect } from "chai";
import { Scene, Vector3 } from "three";
import { App } from "../source/js/App";
import { StickSpawner } from "../source/js/StickSpawner";

let app = new App();
describe("StickSpawner", function() {
    

    describe("constructor()", function() {
        //put beforeEach HERE
        beforeEach("Make mock app context", function() {
            app = new App();
            app.scene = new Scene();
        });

        it("should return object of type StickSpawner", function() {
           let stickSpawner = new StickSpawner(app.scene, "#000000");
           expect(stickSpawner).to.be.instanceOf(StickSpawner);           
        });

        it("should put stick spawner in given scene", function() {
            let stickSpawner = new StickSpawner(app.scene, "#000000");
            expect(stickSpawner in app.scene);            
        });

        it("should create stick spawner at given position", function() {
            app.StickSpawner = new StickSpawner(app.scene, "#000000", new Vector3(1, 0, 0));
            assert.equal(app.StickSpawner.position.toString(), new Vector3(1, 0, 0).toString() );
        });

        it("should have default position of (0,0,0)", function() {
            let stickSpawner = new StickSpawner(app.scene, "#000000");           
            assert.equal(stickSpawner.position.toString(), new Vector3(0, 0, 0).toString() );
        });

        it("should have given stick colour", function() {
            app.StickSpawner = new StickSpawner(app.scene, "#100000");           
            assert.equal(app.StickSpawner.stickParameters.colour,"#100000");
        });                
    });

    describe("spawn()", function() {
        beforeEach("Make mock app context", function() {
            app = new App();
            app.scene = new Scene();
            app.stickSpawner = new StickSpawner(app.scene, "#000000");                        
        });

        it("should return an object of type Mesh", function() {        
        let stick = app.stickSpawner.spawn();
        expect(stick.type).to.equal("Mesh");
        });    
        
        it("should put new stick at spawners position", function() {            
            let stick = app.stickSpawner.spawn();
            assert.equal(stick.position.toString(), app.stickSpawner.position.toString());
        });

        it("stick is draggable", function() {            
            let stick = app.stickSpawner.spawn();            
            assert(stick.userData.draggable);
        });
});
})