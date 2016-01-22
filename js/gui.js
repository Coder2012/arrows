var settings, gui, ctrlX, ctrlY;
var owner = this;

var Settings = function() {
  this.y = 35,
  this.z = -50,
  this.reset = function(){
    owner.update(this.y, this.z);
  }
};

window.onload = function() {
  settings = new Settings();
  gui = new dat.GUI();
  ctrlY = gui.add(settings, 'y', 0, 90);
  ctrlZ = gui.add(settings, 'z', -100, 0);
  gui.add(settings, 'reset');

  ctrlY.onFinishChange(function(value) {
      settings.y = value;
      owner.update(settings.y, settings.z);
  });

  ctrlZ.onFinishChange(function(value) {
      settings.z = value;
      owner.update(settings.y, settings.z);
  });

  
};
