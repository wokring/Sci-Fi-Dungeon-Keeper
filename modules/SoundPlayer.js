import {camera} from "../modules/gui.js";


function playSound(filepath) {
    let listener;
    if (camera.children.length === 0) {
        listener = new THREE.AudioListener();
        camera.add( listener );
    } else {
        listener = camera.children[0];
    }

// create a global audio source
    const sound = new THREE.Audio( listener );
// load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( filepath, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume( 1 );
        sound.play();
    });
}

export {playSound}