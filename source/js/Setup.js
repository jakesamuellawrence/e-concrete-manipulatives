import { TextureLoader, Vector3 } from "three";
import { Vector2 } from "three";
import { OrthographicCamera, Scene, WebGLRenderer } from "three";
import { EffectComposer, OutlinePass, RenderPass, ShaderPass } from "three-outlinepass";
import FXAAShader from "three-shaders/shaders/FXAAShader";
import {App} from "./App"
import * as Utils from "./Utils";
import darkShrubTexture from "../../resources/images/bg_shrub_dark.svg";
import { SpriteMaterial } from "three";
import { Sprite } from "three";
import { StickSpawner } from "./StickSpawner";
import { Plane } from "three";
import { RelativeDragControls } from "./RelativeDragControls";
import { SelectionControls } from "./SelectionControls";
import * as BundleUtils from "./BundleUtils";
import { DirectionalLight } from "three";
import { CircleGeometry } from "three";
import { MeshBasicMaterial } from "three";
import { Mesh } from "three";

/**
 * Performs all required steps to setup up the program in a browser context
 * @param {App} app the app to be initialised
 */
export function initializeApp(app) {
    app.setSticksInABundle(5);
    setupScene(app);
    setupRenderer(app);
    setupControls(app);
    setupEventCallbacks(app);
    app.setStickColour(Utils.getColourFromURL());
    app.spawnSticks(1);
    app.updateSticksInTotal();
}

/**
 * Sets up the renderer and effectcomposer.
 * Sets the sky colour.
 * Sets the sizes of the renderer and effectcomposer. See {@link App.resizeCanvas}
 * @param {App} app the app context
 */
 export function setupRenderer(app) {
    app.renderer = new WebGLRenderer({
        canvas: document.querySelector("#cv1"),
        antialias: true,
    });
    
    app.effectComposer = new EffectComposer(app.renderer);
    app.effectComposer.addPass(new RenderPass(app.scene, app.camera));
    app.shaderPass = new ShaderPass(new FXAAShader)
    app.effectComposer.addPass(app.shaderPass);

    // set sky colour
    app.renderer.setClearColor("#97E4D8", 1); 

    app.resizeCanvas();
}

/**
 * Sets up the Scene and Camera, then places all the objects that are supposed to be in the scene.
 * creates the app's sticksSpawner
 * @param {App} app 
 */
export function setupScene(app) {
    app.scene = new Scene();
    app.camera = new OrthographicCamera();

    app.camera.position.set(20, 10, 10)
    app.camera.lookAt(new Vector3(0, 0, 0));

    // Lighting
    const light = new DirectionalLight(0xFFFFFF, 0.75);
    light.position.set(20, 10, 10);
    light.target.position.set(0, 0, 0);
    light.lookAt(light.target.position);
    app.scene.add(light);
    app.scene.add(light.target);

    const textureLoader = new TextureLoader();

    // Ground
    const planeGeo = new CircleGeometry(2.5, 64); //radius, segments. more segments give a cleaner curve but theoretically worse performance
    const planeMat = new MeshBasicMaterial({color: 0x26A44C});
    const ground = new Mesh(planeGeo, planeMat);
    ground.rotation.x = -Math.PI / 2;
    ground.rotation.z = -Math.PI * 1.14;
    ground.position.x = 1.25;
    ground.position.z = ground.position.x/2; //This is because camera position is also a 2:1 ratio
    app.scene.add(ground);

    // Bushes
    const darkBushMap = textureLoader.load(darkShrubTexture);
    const darkShrubMaterial = new SpriteMaterial({
        map: darkBushMap
    });
    const bushSprite1 = new Sprite(darkShrubMaterial);
    bushSprite1.center.set(0.5, 0);
    bushSprite1.scale.set(0.6, 0.5, 0.6);
    bushSprite1.position.set(-1.6, -0.25, 0);
    app.scene.add(bushSprite1);
    const bushSprite2 = new Sprite(darkShrubMaterial);
    bushSprite2.center.copy(bushSprite1.center);
    bushSprite2.scale.copy(bushSprite1.scale);
    bushSprite2.position.set(-0.6, -0.08, -1.2);
    app.scene.add(bushSprite2);

    // Spawner
    app.stickSpawner = new StickSpawner(app.scene, new Vector3(0, 0.2, 0.7), app.stickColour);
}

/**
 * Creates the DragControls and SelectControls and sets appropritate callbacks for them
 * @param {App} app the app context
 */
export function setupControls(app) {
    const movementPlane = new Plane(new Vector3(0, 1, 0), -app.stickSpawner.stickParameters.radius);
    app.dragControls = new RelativeDragControls(app.sticksInScene, app.camera, movementPlane, app.renderer.domElement);
    app.dragControls.onHover = function(object) {
        Utils.setEmissiveAllChildren(object, 0x222222);
        document.body.style.cursor = "pointer";
    }
    app.dragControls.onUnhover = function(object) {
        Utils.setEmissiveAllChildren(object, 0x000000);
        document.body.style.cursor = "default";
    }
    app.dragControls.onDragStart = function(object){
        document.body.style.cursor = "grabbing";
    }
    app.dragControls.onDragEnd = function(object) {
        document.body.style.cursor = "pointer";
    }

    app.selectControls = new SelectionControls(app.sticksInScene, app.camera, app.renderer.domElement);
    app.selectControls.onSelect = function(object) {
        if (object.outlinePass) {
            object.outlinePass.enabled = true;
        } else {
            const outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), app.scene, app.camera, [object]);
            outlinePass.renderToScreen = true;
            app.effectComposer.addPass(outlinePass);
            object.outlinePass = outlinePass;
        }
        app.showOrHideButtons();
        };
    app.selectControls.onDeselect = function(object) {
        if (object.outlinePass) {
            object.outlinePass.enabled = false;
        }
        app.showOrHideButtons();
    };

    app.showOrHideButtons();
}

/**
 * Sets callbacks for UI elements and window resizing
 * @param {App} app the app context
 */
export function setupEventCallbacks(app) {
    document.getElementById("colourPicker").addEventListener(
        "input", 
        function(event) {app.setStickColour(event.target.value);}, 
        false
    );

    window.onresize = function() {app.resizeCanvas()};

    document.getElementById("getLink").addEventListener("click", function() {
        window.alert("Use this URL to keep your settings:\n"+ Utils.constructLink(app.stickColour));
    });
    document.getElementById("addStick").onclick = function() {
        app.spawnStick();
        app.updateSticksInTotal();
    };
    document.getElementById("add10Sticks").onclick = function() {
        app.spawnSticks(10);
        app.updateSticksInTotal();
    };
    document.getElementById("moreSticksInABundle").onclick = function() {
        app.increaseSticksInABundle();
        app.updateSticksInBundleDisplay();
    };
    document.getElementById("fewerSticksInABundle").onclick = function() {
        app.decreaseSticksInABundle();
        app.updateSticksInBundleDisplay();
    };
    document.getElementById("bundleButton").onclick = function() {
        let err = BundleUtils.canBundle(app, app.selectControls.currentlySelected);
        if (err == null) {
            BundleUtils.bundleSticks(app, app.selectControls.currentlySelected)
            app.selectControls.deselectAll();
        } else {
            window.alert(err.err_message);
        }
    }
    document.getElementById("removeButton").onclick = function() {
        if (confirm("This will delete all selected sticks and bundles. Are you sure?")) {
            BundleUtils.removeSticks(app, app.selectControls.currentlySelected);
            app.selectControls.deselectAll();
        }
    }
    document.getElementById("unbundleButton").onclick = function() {
        BundleUtils.unbundleSticks(app, app.selectControls.currentlySelected);
        app.selectControls.deselectAll();
    }
}