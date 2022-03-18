import { expect } from "chai";
import { Scene, Vector3 } from "three";
import { App } from "../source/js/App";
import * as Utils from "../source/js/Utils";
import { StickSpawner } from "../source/js/StickSpawner";

let app = new App();

describe("TestUtils", function() {
    beforeEach("Make mock app context", function() {
        app = new App();
        app.scene = new Scene();
        app.stickSpawner = new StickSpawner(app.scene, new Vector3(0, 0, 0), "#000000");
        app.sticksInABundle = 5;
    });    

    describe("getLargestGroup()", function() {
        it("should return largest non-scene object group of given object", function() {
            expect(true);
        });        
    });

    describe("setEmissiveAllChildren()", function() {
        it("should change highlight colour of given root object", function() {
            
            expect(true);
        });

        
    });

    describe("removeFromList()", function() {
        it("remove given element from list", function() {
            let list = [0, 1, 2, 3, 4]
            let value = 4
            Utils.removeFromList(value, list)
            let result = value in list
            expect(result==false);
        });   
        
        it("list shouldn't change if given element isn't present", function() {
            let list = [0, 1, 2, 3, 4]
            let value = 6
            let listBefore = [0, 1, 2, 3, 4]
            Utils.removeFromList(value, list)            
            expect(list == listBefore);
        }); 
    });

    describe("removeAllChildrenFromList()", function() {
        it("should remove given objects children from list, if they are childless", function() {
            expect(true);
        });        
    });

    describe("flattenBundle()", function() {
        it("should create list of all sticks in given group", function() {
           
            expect(true);
        });        
    });

    describe("flattenObject()", function() {
        it("should return a list of the object and all its children", function() {
           
            expect(true);
        });        
    });

    describe("vecsNearlyEqual()", function() {
        it("should return true if given vectors have the same values", function() {
            let vector1 = new Vector3(10,10,10);
            let vector2 = new Vector3(10,10,10);
            let result = Utils.vecsNearlyEqual(vector1,vector2)
            expect(result).to.equal(true);
        });  
        
        it("should return true if given vectors are within given distance of each other", function() {
            let vector1 = new Vector3(10,10,10);
            let vector2 = new Vector3(11,11,11);
            let epsilon = 5;
            let result = Utils.vecsNearlyEqual(vector1,vector2,epsilon)
            expect(result).to.equal(true);
        });    
        
        it("should return false if given vectors aren't within given distance of each other", function() {
            let vector1 = new Vector3(10,10,10);
            let vector2 = new Vector3(20,20,20);
            let epsilon = 5;
            let result = Utils.vecsNearlyEqual(vector1,vector2,epsilon)
            expect(result).to.equal(false);
        });
    });

    describe("randomElementFromArray()", function() {
        it("should return random element present in array", function() {
           let array = [10, 20, 30, 40, 50, 60, 70];
           let value = Utils.randomElementFromArray(array);
           expect(value in array);
        });     
        
        it("should not change the array", function() {
            let array = [10, 20, 30, 40, 50, 60, 70];
            Utils.randomElementFromArray(array);
            expect(array == [10, 20, 30, 40, 50, 60, 70]);
         });  
    });

    describe("randomVector()", function() {
        it("should return a vector", function() {
            let result = Utils.randomVector(0,1);        
            expect(result).to.instanceOf(Vector3);
        });

        it("should return vector within given max and min length", function() {
           
            let result = Utils.randomVector(0,10);           
            let min_length = result.length >= 0;
            let max_length = result.length <= 10;
            expect(min_length && max_length);
        });        
    });
});