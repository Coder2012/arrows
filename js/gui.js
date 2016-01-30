var settings, gui, ctrlX, ctrlY;
var owner = this;

var Settings = function() {
  this.x = 0,
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
  ctrlX = gui.add(settings, 'x', -30, 30);
  ctrlY = gui.add(settings, 'y', 0, 60);
  ctrlZ = gui.add(settings, 'z', -400, 0);
  ctrlCameraX = gui.add(settings, 'cameraX', 0, 5000);
  ctrlCameraY = gui.add(settings, 'cameraY', 0, 5000);
  ctrlCameraZ = gui.add(settings, 'cameraZ', 0, 15000);
  gui.add(settings, 'reset');

  ctrlX.onFinishChange(function(value) {
      settings.x = value;
      owner.update(settings);
  });

  ctrlY.onFinishChange(function(value) {
      settings.y = value;
      owner.update(settings);
  });

  ctrlZ.onFinishChange(function(value) {
      settings.z = value;
      owner.update(settings);
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
