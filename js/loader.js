'use strict';

var $ = require('../js/lib/jQuery');
var THREE = require('../js/lib/three');

var globalDeferred = $.Deferred();
var deps = []; 
var textures = [];
var models = [];

var load = function(items) {

	var name, type, path;

	var self = this;

	items.forEach(function(item){
		name = item.name;
		type = item.type;
		path = item.path;

		if(item.type == 'texture'){
			deps.push(loadTexture(name, path));
		}else{
			deps.push(loadModel(name, path));
		}
	});

	$.when.apply($, deps).done(function(){
		globalDeferred.resolve();
	});

	return globalDeferred.promise();
};

function loadTexture(name, path){
	var deferred = $.Deferred();

	var textureLoader = new THREE.TextureLoader();
	textureLoader.load('../img/' + path, function(texture){
		textures[name] = texture;
		deferred.resolve();
	});

	return deferred.promise();
};

function loadModel(name, path){
	var deferred = $.Deferred();

	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load('../model/' + path, function(geometry){
		models[name] = geometry;
		deferred.resolve();
	});

	return deferred.promise();
};

var getTexture = function(name){
	return textures[name];
}

var getModel = function(name){
	return models[name];
}

module.exports = {
	load: load,
	getTexture: getTexture,
	getModel: getModel
};