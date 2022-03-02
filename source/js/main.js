import * as Setup from "./Setup";
import * as Utils from "./Utils";
import { App } from './App';

let app = new App();
Setup.initializeApp(app);
animate();

/**
 * Updates the canvas every frame
 */
function animate(){
  for(let stick of Utils.flattenObject(app.scene)) {
    if (stick.desiredPosition) {
      if (Utils.vecsNearlyEqual(stick.desiredPosition, stick.position)) {
        stick.desiredPosition = null;
      } else {
        stick.position.lerp(stick.desiredPosition, 0.1);
      }
    }
  }

  requestAnimationFrame(animate);
  app.effectComposer.render(app.scene, app.camera);
}