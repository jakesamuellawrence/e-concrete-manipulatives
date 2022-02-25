import '/source/style.css';
import * as Setup from "./Setup";
import { App } from './App';

let app = new App();
Setup.initializeApp(app);
animate();

/**
 * Updates the canvas every frame
 */
function animate(){
  requestAnimationFrame(animate);
  app.effectComposer.render(app.scene, app.camera);
}