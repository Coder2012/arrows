var settings, gui, ctrlX, ctrlY;
var owner = this;

var Settings = function() {
  this.y = 35,
  this.z = -70,
  this.cameraX = 3500;
  this.cameraY = 2500;
  this.cameraZ = 12000;
  this.reset = function(){
    owner.update(this.y, this.z);
  }
};

window.onload = function() {
  settings = new Settings();
  gui = new dat.GUI();
  ctrlY = gui.add(settings, 'y', 0, 90);
  ctrlZ = gui.add(settings, 'z', -100, 0);
  ctrlCameraX = gui.add(settings, 'cameraX', 0, 5000);
  ctrlCameraY = gui.add(settings, 'cameraY', 0, 5000);
  ctrlCameraZ = gui.add(settings, 'cameraZ', 0, 15000);
  gui.add(settings, 'reset');

  ctrlY.onFinishChange(function(value) {
      settings.y = value;
      owner.update(settings.y, settings.z);
  });

  ctrlZ.onFinishChange(function(value) {
      settings.z = value;
      owner.update(settings.y, settings.z);
  });

  ctrlCameraX.onFinishChange(function(value) {
      settings.cameraX = value;
      owner.updateCamera(settings.cameraX, settings.cameraY, settings.cameraZ);
  });

  ctrlCameraY.onFinishChange(function(value) {
      settings.cameraY = value;
      owner.updateCamera(settings.cameraX, settings.cameraY, settings.cameraZ);
  });

  ctrlCameraZ.onFinishChange(function(value) {
      settings.cameraZ = value;
      owner.updateCamera(settings.cameraX, settings.cameraY, settings.cameraZ);
  });
};
