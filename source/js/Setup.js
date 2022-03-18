import { TextureLoader, Vector3 } from "three";
import { Vector2 } from "three";
import { OrthographicCamera, Scene, WebGLRenderer } from "three";
import { EffectComposer, OutlinePass, RenderPass, ShaderPass } from "three-outlinepass";
import FXAAShader from "three-shaders/shaders/FXAAShader";
import {App} from "./App"
import * as Utils from "./Utils";
import darkShrubTexture from "../../resources/images/bg_shrub_dark.svg";
import lightShrubTexture from "../../resources/images/bg_shrub_light.svg";
import largeShrub1Texture from "../../resources/images/lg_shrub1.svg";
import largeShrub2Texture from "../../resources/images/lg_shrub2.svg";
import smallSpikeTexture from "../../resources/images/sm_shrub1.svg";
import smallRoundTexture from "../../resources/images/sm_shrub2.svg";
import beaverTexture from "../../resources/images/beaver.gif";
import beaverSpritesheet from "../../resources/images/beaver_spritesheet.png";
import { PlainAnimator } from "three-plain-animator/lib/plain-animator";
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
    app.setSticksInABundle(3);
    setupScene(app);
    setupRenderer(app);
    setupControls(app);
    setupEventCallbacks(app);
    app.setStickColour(Utils.getColourFromURL());
    app.spawnSticks(1);
    app.updateSticksInTotal();
    app.updateSticksInBundleDisplay();
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
    bushSprite1.center.set(0.5,0)
    bushSprite1.scale.set(0.75,0.75,0.6);
    bushSprite1.position.set(-1.9,-0.61,0);
    app.scene.add(bushSprite1);

    const bushSprite2 = new Sprite(darkShrubMaterial);
    bushSprite2.center.set(0.5,0)
    bushSprite2.scale.set(0.75,0.75,0.6);
    bushSprite2.position.set(-0.6,-0.31,-1.2);
    app.scene.add(bushSprite2);

    const bushSprite3 = new Sprite(darkShrubMaterial);
    bushSprite3.center.set(1.15,0)
    bushSprite3.scale.set(0.75,0.75,0.6);
    bushSprite3.position.set(-1.1,-0.51,-1.2);
    app.scene.add(bushSprite3);

    const lightBushMap = textureLoader.load(lightShrubTexture);
    const lightShrubMaterial = new SpriteMaterial( { map: lightBushMap } );

    const bushSprite4 = new Sprite(lightShrubMaterial);
    bushSprite4.center.set(1.05,0)
    bushSprite4.scale.set(0.75, 0.75,0.6);
    bushSprite4.position.set(-0.6,-0.32,-1.2);
    app.scene.add(bushSprite4);

    const bushSprite5 = new Sprite(lightShrubMaterial);
    bushSprite5.center.set(1.95,0)
    bushSprite5.scale.set(0.75, 0.75,0.6);
    bushSprite5.position.set(-0.6,-0.32,-1.2);
    app.scene.add(bushSprite5);

    const largeBush1Map = textureLoader.load(largeShrub1Texture);
    const largeShrub1Material = new SpriteMaterial( { map: largeBush1Map } );
   
    const bushSprite6 = new Sprite(largeShrub1Material);
    bushSprite6.center.set(0.7,0)
    bushSprite6.scale.set(0.8, 0.7,0.6);
    bushSprite6.position.set(-0.55,-0.25,-1.13);
    app.scene.add(bushSprite6);

    const largeBush2Map = textureLoader.load(largeShrub2Texture);
    const largeShrub2Material = new SpriteMaterial( { map: largeBush2Map } );

    const bushSprite7 = new Sprite(largeShrub2Material);
    bushSprite7.center.set(2.2,0)
    bushSprite7.scale.set(0.8, 0.7,0.6);
    bushSprite7.position.set(-0.55,-0.25,-1.13);
    app.scene.add(bushSprite7);

    const smallSpikeMap = textureLoader.load(smallSpikeTexture);
    const smallSpikeMaterial = new SpriteMaterial( { map: smallSpikeMap } );

    const bushSprite8 = new Sprite(smallSpikeMaterial);
    bushSprite8.center.set(0.9,-0.45)
    bushSprite8.scale.set(0.47, 0.47,0.9);
    bushSprite8.position.set(-0.3,-0.32,-1.3);
    app.scene.add(bushSprite8);

    const smallRoundMap = textureLoader.load(smallRoundTexture);
    const smallRoundMaterial = new SpriteMaterial( { map: smallRoundMap } );

    const bushSprite9 = new Sprite(smallRoundMaterial);
    bushSprite9.center.set(4.6,-0.45)
    bushSprite9.scale.set(0.45, 0.45, 0.9);
    bushSprite9.position.set(-0.3,-0.25,-1.3);
    app.scene.add(bushSprite9);

    const beaverSpritesheetTexture = textureLoader.load(beaverSpritesheet);
    // 4 magic numbers are number of frames horizontally in texture, num frames vertically, total frames, desired framerate
    const beaverAnimator = new PlainAnimator(beaverSpritesheetTexture, 5, 16, 79, 12);
    const beaverMap = beaverAnimator.init();
    const beaverMaterial = new SpriteMaterial({map: beaverMap});
    const beaverSprite = new Sprite(beaverMaterial);
    beaverSprite.center.set(0, -0.7);
    beaverSprite.scale.set(0.3, 0.4, 0.5);
    beaverSprite.position.set(-0.1, 0, 0.55);
    app.scene.add(beaverSprite);
    app.beaverAnimator = beaverAnimator;


    // Spawner
    app.stickSpawner = new StickSpawner(app.scene, app.stickColour, new Vector3(-0.4, 0.3, 0.7));
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
        function(event) {
            app.setStickColour(event.target.value);
            document.getElementById("colourPicker").value = app.stickColour;
        }, 
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
        if (app.areThereBundles()) {
            if (confirm("This will unbundle the existing bundles. Are you sure?")) {
                app.unbundleExistingBundles();
                app.increaseSticksInABundle();
            }
        } else {
            app.increaseSticksInABundle();
        }
        app.updateSticksInBundleDisplay();
    };
    document.getElementById("fewerSticksInABundle").onclick = function() {
        if (app.areThereBundles()) {
            if (confirm("This will unbundle the existing bundles. Are you sure?")) {
                app.unbundleExistingBundles();
                app.increaseSticksInABundle();
            }
        } else {
            app.decreaseSticksInABundle();
        }
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
            app.updateSticksInTotal();
        }
    }
    document.getElementById("unbundleButton").onclick = function() {
        BundleUtils.unbundleSticks(app, app.selectControls.currentlySelected);
        app.selectControls.deselectAll();
    }
}
